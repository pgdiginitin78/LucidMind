import { NextResponse } from "next/server";
import { updatePodcast, deletePodcast } from "@/lib/dbHelper";

export async function PUT(request, context) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const podcast = updatePodcast(id, body);

    if (!podcast) {
      return NextResponse.json({ message: "Episode not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Episode updated", podcast });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, context) {
  try {
    const { id } = await context.params;
    deletePodcast(id);
    return NextResponse.json({ message: "Episode deleted" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
