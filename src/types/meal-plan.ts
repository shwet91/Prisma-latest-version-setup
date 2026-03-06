export type MealType =
  | "early_morning"
  | "breakfast"
  | "mid_meal"
  | "lunch"
  | "evening_snack"
  | "dinner"
  | "post_dinner";

export interface MealCell {
  diet: string;
  quantity: string;
  note: string;
}

export interface CellComment {
  id: string;
  authorId: string;
  authorName: string;
  text: string;
  createdAt: string;
  resolved?: boolean;
}

/** Comments keyed by "day::meal" e.g. "monday::breakfast", or "general" for overall plan comments */
export type MealPlanComments = Record<string, CellComment[]>;

export const GENERAL_COMMENT_KEY = "general";

export function commentKey(day: DayOfWeek, meal: MealType): string {
  return `${day}::${meal}`;
}

export type DayOfWeek =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export type WeekData = Record<DayOfWeek, Record<MealType, MealCell>>;

export interface MealPlan {
  clientId: string;
  clientName: string;
  status: "draft" | "review" | "published";
  weekStartDate: string;
  week: WeekData;
}

export const DAYS: { key: DayOfWeek; label: string; short: string }[] = [
  { key: "monday", label: "Monday", short: "Mon" },
  { key: "tuesday", label: "Tuesday", short: "Tue" },
  { key: "wednesday", label: "Wednesday", short: "Wed" },
  { key: "thursday", label: "Thursday", short: "Thu" },
  { key: "friday", label: "Friday", short: "Fri" },
  { key: "saturday", label: "Saturday", short: "Sat" },
  { key: "sunday", label: "Sunday", short: "Sun" },
];

export const MEAL_SLOTS: { key: MealType; label: string; time: string }[] = [
  { key: "early_morning", label: "Early Morning", time: "06:30" },
  { key: "breakfast", label: "Breakfast", time: "08:00" },
  { key: "mid_meal", label: "Mid Meal", time: "10:30" },
  { key: "lunch", label: "Lunch", time: "12:30" },
  { key: "evening_snack", label: "Evening Snack", time: "15:00" },
  { key: "dinner", label: "Dinner", time: "18:30" },
  { key: "post_dinner", label: "Post Dinner", time: "21:00" },
];

export function createEmptyWeek(): WeekData {
  const days: DayOfWeek[] = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];
  const meals: MealType[] = [
    "early_morning",
    "breakfast",
    "mid_meal",
    "lunch",
    "evening_snack",
    "dinner",
    "post_dinner",
  ];

  const week = {} as WeekData;
  for (const day of days) {
    week[day] = {} as Record<MealType, MealCell>;
    for (const meal of meals) {
      week[day][meal] = { diet: "", quantity: "", note: "" };
    }
  }
  return week;
}
