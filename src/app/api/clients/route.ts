import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

// POST /api/clients — Create a new client
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    console.log("request body :", body);

    const { name, phoneNo, email, age, assignedToId } = body;

    // Validate required fields
    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { error: "Client name is required." },
        { status: 400 },
      );
    }

    if (!assignedToId || typeof assignedToId !== "string") {
      return NextResponse.json(
        { error: "Assigned user ID is required." },
        { status: 400 },
      );
    }

    // Verify the assigned user exists
    const user = await prisma.user.findUnique({
      where: { id: assignedToId },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Assigned user not found." },
        { status: 404 },
      );
    }

    // Create the client record
    const client = await prisma.client.create({
      data: {
        name: name.trim(),
        phoneNo: phoneNo?.trim() || null,
        email: email?.trim() || null,
        age: age ? parseInt(age, 10) : null,
        assignedToId,
      },
    });

    return NextResponse.json({ client }, { status: 201 });
  } catch (error) {
    console.error("Error creating client:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 },
    );
  }
}

// GET /api/clients?assignedToId=xxx — List clients for a user
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const assignedToId = searchParams.get("assignedToId");

    if (!assignedToId) {
      return NextResponse.json(
        { error: "assignedToId query parameter is required." },
        { status: 400 },
      );
    }

    const clients = await prisma.client.findMany({
      where: { assignedToId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ clients }, { status: 200 });
  } catch (error) {
    console.error("Error fetching clients:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 },
    );
  }
}
