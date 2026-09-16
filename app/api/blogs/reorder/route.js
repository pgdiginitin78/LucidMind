import { NextResponse } from "next/server";
import { reorderBlogs } from "@/lib/dbHelper";

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

export async function POST(request) {
  return PUT(request);
}
