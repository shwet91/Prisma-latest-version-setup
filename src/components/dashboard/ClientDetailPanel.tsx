"use client";

import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store/store";
import { startNewMealPlan } from "@/store/features/mealSlice";
import { Client, ClientMealPlan } from "@/types/client";
import MealPlanCard from "./MealPlanCard";

interface ClientDetailPanelProps {
  client: Client | null;
  mealPlans: ClientMealPlan[];
  onViewMealPlanDetails: (mealPlan: ClientMealPlan) => void;
}

export default function ClientDetailPanel({
  client,
  mealPlans,
  onViewMealPlanDetails,
}: ClientDetailPanelProps) {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const handleCreateNewMeal = () => {
    if (!client) return;
    dispatch(startNewMealPlan(client.id));
    router.push("/editor");
  };

  if (!client) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-8 text-center">
        <div className="mb-4 rounded-full bg-zinc-100 p-4 dark:bg-zinc-800">
          <svg
            className="h-8 w-8 text-zinc-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
        </div>
        <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
          Select a client
        </h3>
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          Click on a client card to view their details and meal plans.
        </p>
      </div>
    );
  }

  const initials = client.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Client Basic Details Header */}
      <div className="border-b border-zinc-200 p-5 dark:border-zinc-800">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          Client Basic Details
        </h2>

        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-indigo-500 to-purple-600 text-lg font-bold text-white">
            {initials}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              {client.name}
            </h3>
            {client.condition && (
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {client.condition}
              </p>
            )}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          {client.email && <DetailItem label="Email" value={client.email} />}
          {client.phoneNo && (
            <DetailItem label="Phone" value={client.phoneNo} />
          )}
          {client.age != null && (
            <DetailItem label="Age" value={`${client.age} years`} />
          )}
          {client.gender && (
            <DetailItem
              label="Gender"
              value={
                client.gender.charAt(0).toUpperCase() + client.gender.slice(1)
              }
            />
          )}
          <DetailItem
            label="Joined"
            value={new Date(client.createdAt).toLocaleDateString()}
          />
          {client.status && (
            <DetailItem
              label="Status"
              value={
                client.status.charAt(0).toUpperCase() + client.status.slice(1)
              }
              valueClassName={
                client.status === "active"
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-zinc-500"
              }
            />
          )}
        </div>
      </div>

      {/* Meal Plans Section */}
      <div className="flex-1 overflow-y-auto p-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Meal Plans
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCreateNewMeal}
              className="inline-flex items-center gap-1 rounded-md bg-indigo-600 px-2.5 py-1 text-xs font-medium text-white shadow-sm hover:bg-indigo-700 transition-colors cursor-pointer"
            >
              <svg
                className="h-3.5 w-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Create New Meal
            </button>
            <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400">
              {mealPlans.length}
            </span>
          </div>
        </div>

        {mealPlans.length === 0 ? (
          <div className="rounded-lg border border-dashed border-zinc-200 p-6 text-center dark:border-zinc-700">
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              No meal plans created yet.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {mealPlans.map((plan) => (
              <MealPlanCard
                key={plan.id}
                mealPlan={plan}
                onViewDetails={onViewMealPlanDetails}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function DetailItem({
  label,
  value,
  valueClassName = "text-zinc-900 dark:text-zinc-100",
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div>
      <p className="text-xs text-zinc-500 dark:text-zinc-400">{label}</p>
      <p className={`text-sm font-medium ${valueClassName}`}>{value}</p>
    </div>
  );
}
