import { NextResponse } from "next/server";
import { updateBlog, deleteBlog } from "@/lib/dbHelper";

export async function PUT(request, context) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const blog = updateBlog(id, body);

    if (!blog) {
      return NextResponse.json({ message: "Article not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Article updated", blog });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, context) {
  try {
    const { id } = await context.params;
    deleteBlog(id);
    return NextResponse.json({ message: "Article deleted" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
