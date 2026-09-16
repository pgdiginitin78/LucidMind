import { NextResponse } from "next/server";
import { reorderServices } from "@/lib/dbHelper";

export async function PUT(request) {
  try {
    const body = await request.json();
    const orderedIds = body.orderedIds || body.services?.map((s) => s._id || s.id);
    if (!orderedIds || !Array.isArray(orderedIds)) {
      return NextResponse.json({ message: "orderedIds array is required" }, { status: 400 });
    }

    const services = reorderServices(orderedIds);
    return NextResponse.json({ message: "Services reordered", services });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  return PUT(request);
}
