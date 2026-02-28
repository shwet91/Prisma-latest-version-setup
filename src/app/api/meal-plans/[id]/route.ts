import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";

// GET /api/meal-plans/[id] — Fetch a single meal plan with full weekData
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in." },
        { status: 401 },
      );
    }

    const { id } = await params;

    const mealPlan = await prisma.mealPlan.findUnique({
      where: { id },
      include: {
        reviewer: {
          select: { id: true, name: true, email: true, image: true },
        },
      },
    });

    if (!mealPlan) {
      return NextResponse.json(
        { error: "Meal plan not found." },
        { status: 404 },
      );
    }

    // Allow access if user is creator or reviewer
    if (
      mealPlan.createdById !== session.user.id &&
      mealPlan.reviewerId !== session.user.id
    ) {
      return NextResponse.json({ error: "Access denied." }, { status: 403 });
    }

    return NextResponse.json(mealPlan, { status: 200 });
  } catch (error) {
    console.error("Error fetching meal plan:", error);
    return NextResponse.json(
      { error: "Failed to fetch meal plan." },
      { status: 500 },
    );
  }
}

// DELETE /api/meal-plans/[id] — Delete a meal plan
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in." },
        { status: 401 },
      );
    }

    const { id } = await params;

    const mealPlan = await prisma.mealPlan.findUnique({
      where: { id },
    });

    if (!mealPlan) {
      return NextResponse.json(
        { error: "Meal plan not found." },
        { status: 404 },
      );
    }

    if (mealPlan.createdById !== session.user.id) {
      return NextResponse.json({ error: "Access denied." }, { status: 403 });
    }

    await prisma.mealPlan.delete({
      where: { id },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error deleting meal plan:", error);
    return NextResponse.json(
      { error: "Failed to delete meal plan." },
      { status: 500 },
    );
  }
}
