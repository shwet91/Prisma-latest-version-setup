import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";

// GET /api/meal-plans?clientId=xxx — Fetch all meal plans for a client
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in." },
        { status: 401 },
      );
    }

    const { searchParams } = new URL(req.url);
    const clientId = searchParams.get("clientId");

    if (!clientId) {
      return NextResponse.json(
        { error: "clientId query parameter is required." },
        { status: 400 },
      );
    }

    // Verify client belongs to the current user
    const client = await prisma.client.findFirst({
      where: { id: clientId, assignedToId: session.user.id },
    });

    if (!client) {
      return NextResponse.json(
        { error: "Client not found or access denied." },
        { status: 404 },
      );
    }

    const mealPlans = await prisma.mealPlan.findMany({
      where: {
        clientId,
        createdById: session.user.id,
      },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        clientId: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(mealPlans, { status: 200 });
  } catch (error) {
    console.error("Error fetching meal plans:", error);
    return NextResponse.json(
      { error: "Failed to fetch meal plans." },
      { status: 500 },
    );
  }
}

// POST /api/meal-plans — Save a new meal plan as draft
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in." },
        { status: 401 },
      );
    }

    const body = await req.json();
    const { clientId, weekData } = body;

    if (!clientId || typeof clientId !== "string") {
      return NextResponse.json(
        { error: "Client ID is required." },
        { status: 400 },
      );
    }

    if (!weekData || typeof weekData !== "object") {
      return NextResponse.json(
        { error: "Week data is required." },
        { status: 400 },
      );
    }

    // Verify the client exists
    const client = await prisma.client.findUnique({
      where: { id: clientId },
    });

    if (!client) {
      return NextResponse.json({ error: "Client not found." }, { status: 404 });
    }

    const mealPlan = await prisma.mealPlan.create({
      data: {
        clientId,
        createdById: session.user.id,
        status: "draft",
        weekData,
      },
    });

    return NextResponse.json(mealPlan, { status: 201 });
  } catch (error) {
    console.error("Error creating meal plan:", error);
    return NextResponse.json(
      { error: "Failed to create meal plan." },
      { status: 500 },
    );
  }
}

// PATCH /api/meal-plans — Update an existing meal plan (status or weekData)
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in." },
        { status: 401 },
      );
    }

    const body = await req.json();
    const { id, weekData, status, reviewerId, comments } = body;

    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { error: "Meal plan ID is required." },
        { status: 400 },
      );
    }

    // Verify the meal plan exists
    const existing = await prisma.mealPlan.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Meal plan not found." },
        { status: 404 },
      );
    }

    // Build update data
    const updateData: Record<string, unknown> = {};
    if (weekData !== undefined) updateData.weekData = weekData;
    if (status !== undefined) updateData.status = status;
    if (reviewerId !== undefined) updateData.reviewerId = reviewerId;
    if (comments !== undefined) updateData.comments = comments;

    const mealPlan = await prisma.mealPlan.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(mealPlan, { status: 200 });
  } catch (error) {
    console.error("Error updating meal plan:", error);
    return NextResponse.json(
      { error: "Failed to update meal plan." },
      { status: 500 },
    );
  }
}
