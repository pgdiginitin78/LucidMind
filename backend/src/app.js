import fs from 'node:fs';
import path from 'node:path';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import config from './config/env.js';
import logger from './utils/logger.js';
import routes from './routes/index.js';
import { apiLimiter } from './middleware/rateLimit.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

export function createApp() {
  const app = express();
  app.disable('x-powered-by');
  app.set('trust proxy', /^\d+$/.test(config.trustProxy) ? Number(config.trustProxy) : config.trustProxy);

  app.use(
    helmet({
      // Uploaded images/frontend are loaded cross-origin by the SPA
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      contentSecurityPolicy: config.serveFrontend ? false : undefined,
    }),
  );

  app.use(
    cors({
      origin(origin, cb) {
        if (
          !origin ||
          config.allowedOrigins.includes(origin) ||
          /\.hostingersite\.com$/i.test(origin)
        )
          return cb(null, true);
        return cb(new Error('CORS_NOT_ALLOWED'));
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    }),
  );

  if (!config.isProduction && process.env.NODE_ENV !== 'test') {
    app.use((req, res, next) => {
      const start = Date.now();
      res.on('finish', () => logger.info(`${req.method} ${req.originalUrl} ${res.statusCode} ${Date.now() - start}ms`));
      next();
    });
  }

  // Podcast thumbnails can be base64 data URLs, so allow larger JSON bodies than the default.
  app.use(express.json({ limit: '25mb' }));

  // Uploaded files. Served sandboxed so an uploaded SVG cannot run script.
  const serveUploads = express.static(config.uploads.dir, {
    index: false,
    dotfiles: 'deny',
    setHeaders(res) {
      res.setHeader('Content-Security-Policy', "default-src 'none'; style-src 'unsafe-inline'; sandbox");
      res.setHeader('X-Content-Type-Options', 'nosniff');
    },
  });
  app.use('/uploads', serveUploads);
  app.use('/api/uploads', serveUploads);

  app.use('/api', apiLimiter, routes);
  app.use('/api', notFound);

  // Serve the built frontend SPA from the same process/domain (single Hostinger Node app)
  const distCandidates = [
    config.frontendDist,
    path.resolve(config.backendRoot, '../frontend/dist'),
    path.resolve(config.backendRoot, '../dist'),
    path.resolve(config.backendRoot, '../build'),
    path.resolve(config.backendRoot, '../.next'),
  ];
  const matchedDist = distCandidates.find((d) => fs.existsSync(path.join(d, 'index.html')));

  if ((config.serveFrontend || config.isProduction) && matchedDist) {
    app.use(express.static(matchedDist, { index: false, maxAge: '1h' }));
    app.get(/^\/(?!api\/|uploads\/).*/, (req, res) => {
      res.sendFile(path.join(matchedDist, 'index.html'));
    });
  }

  app.use(notFound);
  app.use(errorHandler);
  return app;
}

export default createApp;
