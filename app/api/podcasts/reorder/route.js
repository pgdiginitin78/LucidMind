import { NextResponse } from "next/server";
import { reorderPodcasts } from "@/lib/dbHelper";

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

export async function POST(request) {
  return PUT(request);
}
