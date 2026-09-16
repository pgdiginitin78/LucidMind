import { NextResponse } from "next/server";
import { updateService, deleteService } from "@/lib/dbHelper";

export async function PUT(request, context) {
  try {
    const params = await context?.params;
    const id = params?.id || new URL(request.url).pathname.split("/").pop();
    const body = await request.json();
    const service = updateService(id, body);

    if (!service) {
      return NextResponse.json({ message: "Service not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Service updated", service });
  } catch (error) {
    console.error("PUT /api/services/[id] error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, context) {
  try {
    const params = await context?.params;
    const id = params?.id || new URL(request.url).pathname.split("/").pop();
    deleteService(id);
    return NextResponse.json({ message: "Service deleted" });
  } catch (error) {
    console.error("DELETE /api/services/[id] error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
