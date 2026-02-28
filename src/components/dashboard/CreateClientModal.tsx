"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

interface CreateClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClientCreated: () => void;
}

interface FormData {
  name: string;
  email: string;
  phoneNo: string;
  age: string;
}

const INITIAL_FORM: FormData = {
  name: "",
  email: "",
  phoneNo: "",
  age: "",
};

export default function CreateClientModal({
  isOpen,
  onClose,
  onClientCreated,
}: CreateClientModalProps) {
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const userId = useSelector((state: RootState) => state.user.id);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!form.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Invalid email format";
    }

    if (form.phoneNo && !/^\+?[\d\s-]{7,15}$/.test(form.phoneNo)) {
      newErrors.phoneNo = "Invalid phone number";
    }

    if (
      form.age &&
      (isNaN(Number(form.age)) ||
        Number(form.age) < 1 ||
        Number(form.age) > 120)
    ) {
      newErrors.age = "Age must be between 1 and 120";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear field error on change
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    setApiError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    if (!userId) {
      setApiError("You must be logged in to create a client.");
      return;
    }

    setIsSubmitting(true);
    setApiError(null);

    try {
      const res = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim() || undefined,
          phoneNo: form.phoneNo.trim() || undefined,
          age: form.age ? form.age : undefined,
          assignedToId: userId,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setApiError(data.error || "Failed to create client.");
        return;
      }

      // Success — reset form, close modal, notify parent
      setForm(INITIAL_FORM);
      setErrors({});
      onClientCreated();
      onClose();
    } catch {
      setApiError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && !isSubmitting) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="relative w-full max-w-lg rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-700 dark:bg-zinc-900">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Create New Client
            </h2>
            <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
              Fill in the details below to add a new client.
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 disabled:opacity-50 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* API Error Banner */}
        {apiError && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-400">
            {apiError}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name (required) */}
          <div>
            <label
              htmlFor="client-name"
              className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              id="client-name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Priya Sharma"
              className={`w-full rounded-lg border px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 transition-colors focus:outline-none focus:ring-1 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500 ${
                errors.name
                  ? "border-red-400 focus:border-red-500 focus:ring-red-500"
                  : "border-zinc-200 focus:border-indigo-500 focus:ring-indigo-500 dark:border-zinc-700"
              }`}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-500">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="client-email"
              className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Email
            </label>
            <input
              id="client-email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="e.g. priya@email.com"
              className={`w-full rounded-lg border px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 transition-colors focus:outline-none focus:ring-1 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500 ${
                errors.email
                  ? "border-red-400 focus:border-red-500 focus:ring-red-500"
                  : "border-zinc-200 focus:border-indigo-500 focus:ring-indigo-500 dark:border-zinc-700"
              }`}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">{errors.email}</p>
            )}
          </div>

          {/* Phone & Age row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="client-phone"
                className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Phone Number
              </label>
              <input
                id="client-phone"
                name="phoneNo"
                type="tel"
                value={form.phoneNo}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                className={`w-full rounded-lg border px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 transition-colors focus:outline-none focus:ring-1 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500 ${
                  errors.phoneNo
                    ? "border-red-400 focus:border-red-500 focus:ring-red-500"
                    : "border-zinc-200 focus:border-indigo-500 focus:ring-indigo-500 dark:border-zinc-700"
                }`}
              />
              {errors.phoneNo && (
                <p className="mt-1 text-xs text-red-500">{errors.phoneNo}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="client-age"
                className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Age
              </label>
              <input
                id="client-age"
                name="age"
                type="number"
                min="1"
                max="120"
                value={form.age}
                onChange={handleChange}
                placeholder="e.g. 28"
                className={`w-full rounded-lg border px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 transition-colors focus:outline-none focus:ring-1 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500 ${
                  errors.age
                    ? "border-red-400 focus:border-red-500 focus:ring-red-500"
                    : "border-zinc-200 focus:border-indigo-500 focus:ring-indigo-500 dark:border-zinc-700"
                }`}
              />
              {errors.age && (
                <p className="mt-1 text-xs text-red-500">{errors.age}</p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="h-4 w-4 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Creating…
                </>
              ) : (
                "Create Client"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
