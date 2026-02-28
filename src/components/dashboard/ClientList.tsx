"use client";

import { Client } from "@/types/client";
import ClientCard from "./ClientCard";

interface ClientListProps {
  clients: Client[];
  selectedClient: Client | null;
  onSelectClient: (client: Client) => void;
}

export default function ClientList({
  clients,
  selectedClient,
  onSelectClient,
}: ClientListProps) {
  if (clients.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
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
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        </div>
        <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
          No clients found
        </h3>
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          Try adjusting your search or create a new client.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {clients.map((client) => (
        <ClientCard
          key={client.id}
          client={client}
          isSelected={selectedClient?.id === client.id}
          onClick={onSelectClient}
        />
      ))}
    </div>
  );
}
