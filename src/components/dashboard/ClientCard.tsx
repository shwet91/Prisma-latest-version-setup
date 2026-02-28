"use client";

import { Client } from "@/types/client";

interface ClientCardProps {
  client: Client;
  isSelected: boolean;
  onClick: (client: Client) => void;
}

export default function ClientCard({
  client,
  isSelected,
  onClick,
}: ClientCardProps) {
  const statusColor =
    client.status === "active"
      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
      : client.status === "inactive"
        ? "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
        : "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400";

  const initials = client.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <button
      onClick={() => onClick(client)}
      className={`group w-full rounded-xl border p-4 text-left transition-all ${
        isSelected
          ? "border-indigo-500 bg-indigo-50/50 shadow-md ring-1 ring-indigo-500 dark:border-indigo-500 dark:bg-indigo-950/20"
          : "border-zinc-200 bg-white hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-indigo-500 to-purple-600 text-sm font-bold text-white">
          {initials}
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              {client.name}
            </h3>
            {client.status && (
              <span
                className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${statusColor}`}
              >
                {client.status}
              </span>
            )}
          </div>

          {client.email && (
            <p className="mt-0.5 truncate text-xs text-zinc-500 dark:text-zinc-400">
              {client.email}
            </p>
          )}

          <div className="mt-2 flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
            {client.phoneNo && (
              <span className="flex items-center gap-1">
                <svg
                  className="h-3.5 w-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                {client.phoneNo}
              </span>
            )}
            {client.age != null && (
              <>
                {client.phoneNo && <span>•</span>}
                <span>{client.age} yrs</span>
              </>
            )}
            {client.gender && (
              <>
                <span>•</span>
                <span className="capitalize">{client.gender}</span>
              </>
            )}
          </div>

          {client.condition && (
            <div className="mt-1.5">
              <span className="inline-block rounded-md bg-amber-50 px-1.5 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                {client.condition}
              </span>
            </div>
          )}
        </div>
      </div>
    </button>
  );
}
