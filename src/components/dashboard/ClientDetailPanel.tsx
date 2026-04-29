"use client";

import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { useState } from "react";
import type { AppDispatch } from "@/store/store";
import { startNewMealPlan } from "@/store/features/mealSlice";
import { Client, ClientMealPlan } from "@/types/client";
import MealPlanCard from "./MealPlanCard";

interface HealthDetails {
  height: string;
  weight: string;
  bloodGroup: string;
  allergies: string;
  symptoms: string;
  medicalHistory: string;
  currentMedications: string;
  activityLevel: string;
  dietaryPreferences: string;
  sleepHours: string;
  waterIntake: string;
  notes: string;
}

interface ClientDetailPanelProps {
  client: Client | null;
  mealPlans: ClientMealPlan[];
  onViewMealPlanDetails: (mealPlan: ClientMealPlan) => void;
  onDeleteMealPlan: (mealPlan: ClientMealPlan) => void;
}

const emptyHealth: HealthDetails = {
  height: "",
  weight: "",
  bloodGroup: "",
  allergies: "",
  symptoms: "",
  medicalHistory: "",
  currentMedications: "",
  activityLevel: "",
  dietaryPreferences: "",
  sleepHours: "",
  waterIntake: "",
  notes: "",
};

export default function ClientDetailPanel({
  client,
  mealPlans,
  onViewMealPlanDetails,
  onDeleteMealPlan,
}: ClientDetailPanelProps) {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const [healthOpen, setHealthOpen] = useState(false);
  const [editingHealth, setEditingHealth] = useState(false);
  const [savedHealth, setSavedHealth] = useState<HealthDetails | null>(null);
  const [form, setForm] = useState<HealthDetails>(emptyHealth);
  const [saving, setSaving] = useState(false);

  const handleCreateNewMeal = () => {
    if (!client) return;
    dispatch(startNewMealPlan(client.id));
    router.push("/editor");
  };

  const handleHealthEdit = () => {
    setForm(savedHealth ?? emptyHealth);
    setEditingHealth(true);
    setHealthOpen(true);
  };

  const handleHealthSave = async () => {
    setSaving(true);
    // dummy API call
    await new Promise((r) => setTimeout(r, 1000));
    setSavedHealth({ ...form });
    setSaving(false);
    setEditingHealth(false);
  };

  const handleHealthCancel = () => {
    setEditingHealth(false);
    if (!savedHealth) setHealthOpen(false);
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
          Client Basic Details55
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

      {/* Health Details Section */}
      <div className="border-b border-zinc-200 dark:border-zinc-800">
        <button
          onClick={() => {
            if (!healthOpen && !savedHealth) {
              setForm(emptyHealth);
              setEditingHealth(true);
            }
            setHealthOpen((o) => !o);
          }}
          className="flex w-full items-center justify-between px-5 py-3 text-left"
        >
          <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Health Details
          </h2>
          <div className="flex items-center gap-2">
            {savedHealth && (
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400">
                Saved
              </span>
            )}
            <svg
              className={`h-4 w-4 text-zinc-400 transition-transform ${healthOpen ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>

        {healthOpen && (
          <div className="px-5 pb-5">
            {!editingHealth && savedHealth ? (
              /* ── Saved view ── */
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  {savedHealth.height && <DetailItem label="Height" value={`${savedHealth.height} cm`} />}
                  {savedHealth.weight && <DetailItem label="Weight" value={`${savedHealth.weight} kg`} />}
                  {savedHealth.bloodGroup && <DetailItem label="Blood Group" value={savedHealth.bloodGroup} />}
                  {savedHealth.activityLevel && <DetailItem label="Activity Level" value={savedHealth.activityLevel} />}
                  {savedHealth.sleepHours && <DetailItem label="Sleep" value={`${savedHealth.sleepHours} hrs/day`} />}
                  {savedHealth.waterIntake && <DetailItem label="Water Intake" value={`${savedHealth.waterIntake} L/day`} />}
                </div>
                {savedHealth.allergies && (
                  <HealthTag label="Allergies" value={savedHealth.allergies} color="rose" />
                )}
                {savedHealth.symptoms && (
                  <HealthTag label="Symptoms" value={savedHealth.symptoms} color="amber" />
                )}
                {savedHealth.currentMedications && (
                  <HealthTag label="Medications" value={savedHealth.currentMedications} color="blue" />
                )}
                {savedHealth.medicalHistory && (
                  <HealthTag label="Medical History" value={savedHealth.medicalHistory} color="purple" />
                )}
                {savedHealth.dietaryPreferences && (
                  <HealthTag label="Dietary Preferences" value={savedHealth.dietaryPreferences} color="green" />
                )}
                {savedHealth.notes && (
                  <div className="rounded-md bg-zinc-50 p-3 dark:bg-zinc-800/50">
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">Notes</p>
                    <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">{savedHealth.notes}</p>
                  </div>
                )}
                <button
                  onClick={handleHealthEdit}
                  className="mt-1 text-xs font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 cursor-pointer"
                >
                  Edit health details
                </button>
              </div>
            ) : (
              /* ── Edit form ── */
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <HealthInput label="Height (cm)" value={form.height} onChange={(v) => setForm((f) => ({ ...f, height: v }))} placeholder="e.g. 170" />
                  <HealthInput label="Weight (kg)" value={form.weight} onChange={(v) => setForm((f) => ({ ...f, weight: v }))} placeholder="e.g. 65" />
                  <div>
                    <label className="mb-1 block text-xs text-zinc-500 dark:text-zinc-400">Blood Group</label>
                    <select
                      value={form.bloodGroup}
                      onChange={(e) => setForm((f) => ({ ...f, bloodGroup: e.target.value }))}
                      className="w-full rounded-md border border-zinc-200 bg-white px-2.5 py-1.5 text-sm text-zinc-900 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                    >
                      <option value="">Select</option>
                      {["A+","A-","B+","B-","AB+","AB-","O+","O-"].map((g) => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-zinc-500 dark:text-zinc-400">Activity Level</label>
                    <select
                      value={form.activityLevel}
                      onChange={(e) => setForm((f) => ({ ...f, activityLevel: e.target.value }))}
                      className="w-full rounded-md border border-zinc-200 bg-white px-2.5 py-1.5 text-sm text-zinc-900 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                    >
                      <option value="">Select</option>
                      {["Sedentary","Lightly Active","Moderately Active","Very Active","Extremely Active"].map((a) => (
                        <option key={a} value={a}>{a}</option>
                      ))}
                    </select>
                  </div>
                  <HealthInput label="Sleep (hrs/day)" value={form.sleepHours} onChange={(v) => setForm((f) => ({ ...f, sleepHours: v }))} placeholder="e.g. 7" />
                  <HealthInput label="Water Intake (L/day)" value={form.waterIntake} onChange={(v) => setForm((f) => ({ ...f, waterIntake: v }))} placeholder="e.g. 2.5" />
                </div>
                <HealthTextarea label="Symptoms" value={form.symptoms} onChange={(v) => setForm((f) => ({ ...f, symptoms: v }))} placeholder="e.g. fatigue, bloating, headaches..." />
                <HealthTextarea label="Allergies" value={form.allergies} onChange={(v) => setForm((f) => ({ ...f, allergies: v }))} placeholder="e.g. gluten, dairy, nuts..." />
                <HealthTextarea label="Current Medications" value={form.currentMedications} onChange={(v) => setForm((f) => ({ ...f, currentMedications: v }))} placeholder="e.g. Metformin 500mg..." />
                <HealthTextarea label="Medical History" value={form.medicalHistory} onChange={(v) => setForm((f) => ({ ...f, medicalHistory: v }))} placeholder="e.g. Type 2 Diabetes, Hypertension..." />
                <HealthTextarea label="Dietary Preferences" value={form.dietaryPreferences} onChange={(v) => setForm((f) => ({ ...f, dietaryPreferences: v }))} placeholder="e.g. vegetarian, low-carb, no pork..." />
                <HealthTextarea label="Additional Notes" value={form.notes} onChange={(v) => setForm((f) => ({ ...f, notes: v }))} placeholder="Any other relevant health information..." />
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={handleHealthSave}
                    disabled={saving}
                    className="inline-flex items-center gap-1.5 rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-indigo-700 disabled:opacity-70 transition-colors cursor-pointer"
                  >
                    {saving ? (
                      <>
                        <svg className="h-3.5 w-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                        Saving…
                      </>
                    ) : (
                      "Save Health Details"
                    )}
                  </button>
                  <button
                    onClick={handleHealthCancel}
                    disabled={saving}
                    className="rounded-md px-3 py-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 disabled:opacity-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
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
                onDelete={onDeleteMealPlan}
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

const tagColors = {
  rose: "bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-300",
  amber: "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300",
  blue: "bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-300",
  purple: "bg-purple-50 text-purple-700 dark:bg-purple-950/30 dark:text-purple-300",
  green: "bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-300",
};

function HealthTag({ label, value, color }: { label: string; value: string; color: keyof typeof tagColors }) {
  return (
    <div>
      <p className="mb-1 text-xs text-zinc-500 dark:text-zinc-400">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {value.split(",").map((v) =>
          v.trim() ? (
            <span key={v} className={`rounded-full px-2 py-0.5 text-xs font-medium ${tagColors[color]}`}>
              {v.trim()}
            </span>
          ) : null
        )}
      </div>
    </div>
  );
}

function HealthInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs text-zinc-500 dark:text-zinc-400">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-md border border-zinc-200 bg-white px-2.5 py-1.5 text-sm text-zinc-900 shadow-sm placeholder:text-zinc-400 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500"
      />
    </div>
  );
}

function HealthTextarea({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs text-zinc-500 dark:text-zinc-400">{label}</label>
      <textarea
        rows={2}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full resize-none rounded-md border border-zinc-200 bg-white px-2.5 py-1.5 text-sm text-zinc-900 shadow-sm placeholder:text-zinc-400 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500"
      />
    </div>
  );
}
