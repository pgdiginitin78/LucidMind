import './helpers.js';
import { test, describe, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { app, mockDb, authHeader } from './helpers.js';

const blogRow = {
  id: 'blog_1', title: 'Hello', slug: 'hello', is_published: 1, tags: '["a"]', author_role: 'Role',
  read_time: '3 MIN READ', cover_image: 'c.png', sort_order: 1, created_at: '2026-01-01 00:00:00',
};
const podRow = {
  id: 'pod_1', title: 'Pod', slug: 'pod', episode: 'V1', is_published: 1, tags: ['video'], audio_url: 'a.mp3',
  cover_image: 'c.png', media_type: null,
};
const srvRow = {
  id: 'srv_1', title: 'Svc', slug: 'svc', is_active: 1, features: '["x","y"]', real_problem: 'rp', success_looks_like: 'ok',
};

/** Scripted SQL responder shared by the CRUD tests. */
function respond(sql) {
  if (sql.startsWith('SHOW COLUMNS')) return [{ Field: 'x', Type: 'longtext' }];
  if (/^SELECT \* FROM blogs/.test(sql)) return [blogRow];
  if (/^SELECT \* FROM podcasts/.test(sql)) return [podRow];
  if (/^SELECT \* FROM services/.test(sql)) return [srvRow];
  return { affectedRows: 1 };
}

describe('blogs', () => {
  let m;
  afterEach(() => m?.restore());

  test('GET list maps legacy + camelCase fields', async () => {
    m = mockDb(respond);
    const res = await request(app).get('/api/blogs');
    assert.equal(res.status, 200);
    const b = res.body.blogs[0];
    assert.equal(b._id, 'blog_1');
    assert.deepEqual(b.tags, ['a']);
    assert.equal(b.isPublished, true);
    assert.equal(b.readTime, '3 MIN READ');
    assert.equal(b.coverImage, 'c.png');
    assert.equal(b.read_time, '3 MIN READ'); // raw column kept, as PHP did
  });

  test('GET by id|slug and 404', async () => {
    m = mockDb(respond);
    const ok = await request(app).get('/api/blogs/hello');
    assert.equal(ok.body.blog.slug, 'hello');
    assert.deepEqual(m.calls[0].params, ['hello', 'hello']);
    m.restore();
    m = mockDb(() => []);
    const nf = await request(app).get('/api/blogs/missing');
    assert.equal(nf.status, 404);
    assert.equal(nf.body.message, 'Blog not found');
  });

  test('POST requires title; creates 201 with generated id/slug', async () => {
    m = mockDb(respond);
    const bad = await request(app).post('/api/blogs').set(authHeader()).send({});
    assert.equal(bad.status, 400);
    assert.equal(bad.body.message, 'Title is required');

    const res = await request(app).post('/api/blogs').set(authHeader()).send({ title: 'My First Post!', tags: ['x'] });
    assert.equal(res.status, 201);
    assert.equal(res.body.message, 'Blog created');
    assert.match(res.body.blog._id, /^blog_[0-9a-f]{13}$/);
    const insert = m.calls.find((c) => c.sql.startsWith('INSERT INTO blogs'));
    assert.equal(insert.params[2], 'my-first-post'); // slugify
    assert.equal(insert.params[3], 'MINDSET');
    assert.equal(insert.params[14], 1);
    assert.equal(insert.params[15], '["x"]');
  });

  test('POST ignores unknown fields (no mass assignment)', async () => {
    m = mockDb(respond);
    await request(app).post('/api/blogs').set(authHeader()).send({ title: 't', sort_order: 99, id: 'hijack' });
    const insert = m.calls.find((c) => c.sql.startsWith('INSERT INTO blogs'));
    assert.notEqual(insert.params[0], 'hijack');
    assert.equal(insert.params.includes(99), false);
  });

  test('duplicate slug -> 400 without leaking SQL', async () => {
    m = mockDb(() => {
      throw Object.assign(new Error("Duplicate entry 'x' for key 'slug' (secret sql)"), { code: 'ER_DUP_ENTRY' });
    });
    const res = await request(app).post('/api/blogs').set(authHeader()).send({ title: 'dup' });
    assert.equal(res.status, 400);
    assert.equal(res.body.message.includes('secret'), false);
  });

  test('PUT updates only whitelisted fields; no fields -> 400; missing -> 404', async () => {
    m = mockDb(respond);
    const ok = await request(app).put('/api/blogs/blog_1').set(authHeader())
      .send({ title: 'New', authorRole: 'R', is_published: 0, evil: 1 });
    assert.equal(ok.status, 200);
    assert.equal(ok.body.message, 'Blog updated');
    const upd = m.calls.find((c) => c.sql.startsWith('UPDATE blogs'));
    assert.match(upd.sql, /title = \?, slug = \?|slug = \?, title = \?|title = \?/);
    assert.equal(upd.sql.includes('evil'), false);
    assert.equal(upd.sql.includes('is_published'), false);
    assert.ok(upd.sql.includes('author_role = ?'));

    const none = await request(app).put('/api/blogs/blog_1').set(authHeader()).send({});
    assert.equal(none.status, 400);
    assert.equal(none.body.message, 'No fields to update');
    m.restore();

    m = mockDb(() => ({ affectedRows: 0 }));
    const nf = await request(app).put('/api/blogs/zzz').set(authHeader()).send({ title: 'x' });
    assert.equal(nf.status, 404);
  });

  test('DELETE ok / 404', async () => {
    m = mockDb(() => ({ affectedRows: 1 }));
    const ok = await request(app).delete('/api/blogs/blog_1').set(authHeader());
    assert.deepEqual(ok.body, { message: 'Blog deleted' });
    m.restore();
    m = mockDb(() => ({ affectedRows: 0 }));
    assert.equal((await request(app).delete('/api/blogs/zzz').set(authHeader())).status, 404);
  });

  test('PATCH publish', async () => {
    m = mockDb(respond);
    const res = await request(app).patch('/api/blogs/blog_1/publish').set(authHeader()).send({ isPublished: false });
    assert.equal(res.status, 200);
    assert.equal(res.body.message, 'Blog publish status updated');
    assert.deepEqual(m.calls[0].params, [0, 'blog_1']);
  });

  test('PUT /reorder runs in a transaction with 1-based order and returns list', async () => {
    m = mockDb(respond);
    const res = await request(app).put('/api/blogs/reorder').set(authHeader()).send({ orderedIds: ['b', 'a'] });
    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.body.blogs));
    const tx = m.calls.filter((c) => c.tx).map((c) => c.params);
    assert.deepEqual(tx, [[1, 'b'], [2, 'a']]);
    assert.equal(m.calls[0].sql, 'BEGIN');
    assert.ok(m.calls.some((c) => c.sql === 'COMMIT'));

    const bad = await request(app).put('/api/blogs/reorder').set(authHeader()).send({});
    assert.equal(bad.status, 400);
    assert.equal(bad.body.message, 'orderedIds array is required');
  });

  test('database failure -> generic 500, no leak', async () => {
    m = mockDb(() => {
      throw new Error('connect ECONNREFUSED 10.0.0.5:3306 password=hunter2');
    });
    const res = await request(app).get('/api/blogs');
    assert.equal(res.status, 500);
    assert.deepEqual(res.body, { message: 'Internal server error' });
  });

  test('GET list for public filters out drafts and unpublished posts', async () => {
    m = mockDb((sql) => {
      assert.ok(sql.includes('is_published = 1'));
      return [blogRow];
    });
    const res = await request(app).get('/api/blogs');
    assert.equal(res.status, 200);
    assert.equal(res.body.blogs.length, 1);
  });

  test('GET list for admin includes all posts (drafts + published)', async () => {
    m = mockDb((sql) => {
      assert.ok(!sql.includes('is_published = 1'));
      return [blogRow, { ...blogRow, id: 'blog_draft', is_published: 0 }];
    });
    const res = await request(app).get('/api/blogs').set(authHeader());
    assert.equal(res.status, 200);
    assert.equal(res.body.blogs.length, 2);
  });

  test('GET single draft blog: 404 for public, 200 for authenticated admin', async () => {
    const draftRow = { ...blogRow, id: 'blog_draft', slug: 'my-draft', is_published: 0 };
    m = mockDb(() => [draftRow]);
    const pubRes = await request(app).get('/api/blogs/my-draft');
    assert.equal(pubRes.status, 404);

    const adminRes = await request(app).get('/api/blogs/my-draft').set(authHeader());
    assert.equal(adminRes.status, 200);
    assert.equal(adminRes.body.blog.slug, 'my-draft');
    assert.equal(adminRes.body.blog.isPublished, false);
  });

  test('GET list supports filtering by category, tag, and search', async () => {
    m = mockDb((sql, params) => {
      assert.ok(sql.includes('category = ?'));
      assert.ok(sql.includes('tag = ?'));
      assert.ok(sql.includes('LIKE ?'));
      assert.deepEqual(params, ['CatA', 'TagB', '%searchterm%', '%searchterm%', '%searchterm%', '%searchterm%']);
      return [blogRow];
    });
    const res = await request(app).get('/api/blogs?category=CatA&tag=TagB&search=searchterm').set(authHeader());
    assert.equal(res.status, 200);
  });

  test('GET list supports pagination (page, limit)', async () => {
    m = mockDb((sql) => {
      if (sql.includes('COUNT(*)')) return [{ total: 25 }];
      return [blogRow];
    });
    const res = await request(app).get('/api/blogs?page=2&limit=10').set(authHeader());
    assert.equal(res.status, 200);
    assert.equal(res.body.pagination.total, 25);
    assert.equal(res.body.pagination.page, 2);
    assert.equal(res.body.pagination.limit, 10);
    assert.equal(res.body.pagination.totalPages, 3);
  });
});

describe('podcasts', () => {
  let m;
  afterEach(() => m?.restore());

  test('GET list derives mediaType from tags/episode', async () => {
    m = mockDb(respond);
    const res = await request(app).get('/api/podcasts');
    const p = res.body.podcasts[0];
    assert.equal(p.mediaType, 'video');
    assert.equal(p.audioUrl, 'a.mp3');
    assert.equal(p._id, 'pod_1');
  });

  test('GET by id (id only) / 404', async () => {
    m = mockDb(respond);
    assert.equal((await request(app).get('/api/podcasts/pod_1')).body.podcast.id, 'pod_1');
    m.restore();
    m = mockDb((sql) => (sql.startsWith('SHOW') ? [{ Type: 'longtext' }] : []));
    assert.equal((await request(app).get('/api/podcasts/nope')).status, 404);
  });

  test('POST creates with media_type tag + column', async () => {
    m = mockDb(respond);
    const res = await request(app).post('/api/podcasts').set(authHeader())
      .send({ title: 'Ep One', audioUrl: 'u.mp3', mediaType: 'Video' });
    assert.equal(res.status, 201);
    assert.equal(res.body.podcast.mediaType, 'video');
    assert.deepEqual(res.body.podcast.tags, ['video']);
    const ins = m.calls.find((c) => c.sql.startsWith('INSERT INTO podcasts'));
    assert.equal(ins.params[4], 'u.mp3'); // src
    assert.equal(ins.params[5], 'u.mp3'); // audio_url mirror
    assert.equal(ins.params.at(-1), 'video');
    assert.equal((await request(app).post('/api/podcasts').set(authHeader()).send({})).status, 400);
  });

  test('PUT mirrors fields, 404 when absent', async () => {
    m = mockDb(respond);
    const res = await request(app).put('/api/podcasts/pod_1').set(authHeader()).send({ src: 'n.mp3', mediaType: 'podcast' });
    assert.equal(res.status, 200);
    const upd = m.calls.find((c) => c.sql.startsWith('UPDATE podcasts'));
    assert.ok(upd.sql.includes('audio_url = ?') && upd.sql.includes('media_type = ?'));
    m.restore();
    m = mockDb((sql) => (sql.startsWith('SHOW') ? [{ Type: 'longtext' }] : []));
    assert.equal((await request(app).put('/api/podcasts/zz').set(authHeader()).send({ title: 'x' })).status, 404);
  });

  test('DELETE, PATCH publish, PUT reorder', async () => {
    m = mockDb(respond);
    assert.equal((await request(app).delete('/api/podcasts/pod_1').set(authHeader())).body.message, 'Podcast deleted');
    const pub = await request(app).patch('/api/podcasts/pod_1/publish').set(authHeader()).send({ isPublished: 1 });
    assert.equal(pub.body.message, 'Podcast publish status updated');
    const re = await request(app).put('/api/podcasts/reorder').set(authHeader()).send({ podcasts: [{ _id: 'p2' }, { id: 'p1' }] });
    assert.equal(re.status, 200);
    assert.deepEqual(m.calls.filter((c) => c.tx).map((c) => c.params), [[1, 'p2'], [2, 'p1']]);
  });
});

describe('services', () => {
  let m;
  afterEach(() => m?.restore());

  test('GET list maps fields', async () => {
    m = mockDb(respond);
    const s = (await request(app).get('/api/services')).body.services[0];
    assert.deepEqual(s.features, ['x', 'y']);
    assert.equal(s.isActive, true);
    assert.equal(s.realProblem, 'rp');
    assert.equal(s.successLooksLike, 'ok');
  });

  test('POST accepts comma-separated features string', async () => {
    m = mockDb(respond);
    const res = await request(app).post('/api/services').set(authHeader()).send({ title: 'New Svc', features: 'a, b ,,c' });
    assert.equal(res.status, 201);
    assert.deepEqual(res.body.service.features, ['a', 'b', 'c']);
    assert.equal((await request(app).post('/api/services').set(authHeader()).send({})).status, 400);
  });

  test('PUT / DELETE / reorder', async () => {
    m = mockDb(respond);
    const up = await request(app).put('/api/services/srv_1').set(authHeader()).send({ title: 'T', order: 3, isActive: false });
    assert.equal(up.status, 200);
    assert.equal(up.body.message, 'Service updated');
    assert.equal((await request(app).put('/api/services/srv_1').set(authHeader()).send({})).status, 400);
    assert.equal((await request(app).delete('/api/services/srv_1').set(authHeader())).body.message, 'Service deleted');
    const re = await request(app).put('/api/services/reorder').set(authHeader()).send({ orderedIds: ['s1', 's2'] });
    assert.equal(re.status, 200);
  });

  test('there is no PATCH publish for services (as in PHP)', async () => {
    m = mockDb(respond);
    assert.equal((await request(app).patch('/api/services/srv_1/publish').set(authHeader())).status, 404);
  });
});
