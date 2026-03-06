"use client";

import { useState } from "react";
import { ClientMealPlan } from "@/types/client";

interface MealPlanCardProps {
  mealPlan: ClientMealPlan;
  onViewDetails: (mealPlan: ClientMealPlan) => void;
  onDelete: (mealPlan: ClientMealPlan) => void;
}

export default function MealPlanCard({
  mealPlan,
  onViewDetails,
  onDelete,
}: MealPlanCardProps) {
  const [deleting, setDeleting] = useState(false);
  const statusStyles = {
    draft: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
    review:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    published:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  };

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4 transition-colors hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-zinc-600">
      <div className="flex items-center justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <svg
              className="h-4 w-4 shrink-0 text-indigo-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <h4 className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
              Meal Plan
            </h4>
          </div>
          <div className="mt-1 flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
            <span>
              Created {new Date(mealPlan.createdAt).toLocaleDateString()}
            </span>
            <span>
              Updated {new Date(mealPlan.updatedAt).toLocaleDateString()}
            </span>
            <span
              className={`rounded-full px-1.5 py-0.5 text-xs font-medium ${statusStyles[mealPlan.status]}`}
            >
              {mealPlan.status}
            </span>
          </div>
        </div>
        <div className="ml-3 flex shrink-0 items-center gap-2">
          <button
            onClick={() => onViewDetails(mealPlan)}
            className="rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-600 transition-colors hover:bg-indigo-100 dark:bg-indigo-950/30 dark:text-indigo-400 dark:hover:bg-indigo-950/50"
          >
            Editor
          </button>
          <button
            disabled={deleting}
            onClick={async () => {
              setDeleting(true);
              await onDelete(mealPlan);
              setDeleting(false);
            }}
            className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-100 disabled:opacity-50 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-950/50"
          >
            {deleting ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
