import { NextResponse } from "next/server";
import { getServices, createService, reorderServices } from "@/lib/dbHelper";

export async function GET() {
  try {
    const services = getServices();
    return NextResponse.json({ services });
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

    const service = createService(body);
    return NextResponse.json({ message: "Service created", service }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

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
