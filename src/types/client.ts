export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  gender: "male" | "female" | "other";
  condition: string;
  joinedDate: string;
  status: "active" | "inactive";
}

export interface ClientMealPlan {
  id: string;
  clientId: string;
  title: string;
  status: "draft" | "review" | "published";
  weekStartDate: string;
  createdAt: string;
}
