export interface Client {
  id: string;
  name: string;
  email: string | null;
  phoneNo: string | null;
  age: number | null;
  assignedToId: string;
  createdAt: string;
  updatedAt: string;
  // Future fields (not in DB yet)
  gender?: "male" | "female" | "other";
  condition?: string;
  status?: "active" | "inactive";
}

export interface ClientMealPlan {
  id: string;
  clientId: string;
  title: string;
  status: "draft" | "review" | "published";
  weekStartDate: string;
  createdAt: string;
}
