import { NextResponse } from "next/server";
import { getBlogs, createBlog, reorderBlogs } from "@/lib/dbHelper";

export async function GET() {
  try {
    const blogs = getBlogs();
    return NextResponse.json({ blogs });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    if (!body.title) {
      return NextResponse.json({ message: "Title is required" }, { status: 400 });
    }

    const blog = createBlog(body);
    return NextResponse.json({ message: "Article created", blog }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const orderedIds = body.orderedIds || body.blogs?.map((b) => b._id || b.id);
    if (!orderedIds || !Array.isArray(orderedIds)) {
      return NextResponse.json({ message: "orderedIds array is required" }, { status: 400 });
    }

    const blogs = reorderBlogs(orderedIds);
    return NextResponse.json({ message: "Articles reordered", blogs });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
