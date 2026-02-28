import type { WeekData } from "./meal-plan";

export interface Client {
  id: string;
  name: string;
  email: string | null;
  phoneNo: string | null;
  age: number | null;
  assignedToId: string;
  createdAt: string;
  updatedAt: string;
  // Embedded meal plans from the API
  mealPlans?: ClientMealPlan[];
  // Future fields (not in DB yet)
  gender?: "male" | "female" | "other";
  condition?: string;
  status?: "active" | "inactive";
}

export interface ClientMealPlan {
  id: string;
  clientId: string;
  status: "draft" | "review" | "published";
  weekData: WeekData;
  createdAt: string;
  updatedAt: string;
}
