import { NextResponse } from "next/server";
import { getPodcasts, createPodcast, reorderPodcasts } from "@/lib/dbHelper";

export async function GET() {
  try {
    const podcasts = getPodcasts();
    return NextResponse.json({ podcasts });
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

    const podcast = createPodcast(body);
    return NextResponse.json({ message: "Episode created", podcast }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const orderedIds = body.orderedIds || body.podcasts?.map((p) => p._id || p.id);
    if (!orderedIds || !Array.isArray(orderedIds)) {
      return NextResponse.json({ message: "orderedIds array is required" }, { status: 400 });
    }

    const podcasts = reorderPodcasts(orderedIds);
    return NextResponse.json({ message: "Podcasts reordered", podcasts });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
