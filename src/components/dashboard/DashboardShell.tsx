"use client";

import { useState, useMemo } from "react";
import { Client, ClientMealPlan } from "@/types/client";
import { DashboardNavbar } from "@/components/dashboard";
import { ClientList } from "@/components/dashboard";
import { ClientDetailPanel } from "@/components/dashboard";
import CreateClientModal from "./CreateClientModal";

// ── Mock data (replace with API calls later) ────────────────────────────────
const MOCK_CLIENTS: Client[] = [
  {
    id: "1",
    name: "Priya Sharma",
    email: "priya.sharma@email.com",
    phone: "+91 98765 43210",
    age: 28,
    gender: "female",
    condition: "PCOS",
    joinedDate: "2025-12-15",
    status: "active",
  },
  {
    id: "2",
    name: "Ananya Gupta",
    email: "ananya.g@email.com",
    phone: "+91 87654 32109",
    age: 34,
    gender: "female",
    condition: "Thyroid",
    joinedDate: "2026-01-08",
    status: "active",
  },
  {
    id: "3",
    name: "Deepika Patel",
    email: "deepika.p@email.com",
    phone: "+91 76543 21098",
    age: 31,
    gender: "female",
    condition: "Peri-menopause",
    joinedDate: "2026-02-01",
    status: "active",
  },
  {
    id: "4",
    name: "Meera Joshi",
    email: "meera.j@email.com",
    phone: "+91 65432 10987",
    age: 26,
    gender: "female",
    condition: "PCOS",
    joinedDate: "2025-11-20",
    status: "inactive",
  },
  {
    id: "5",
    name: "Kavita Reddy",
    email: "kavita.r@email.com",
    phone: "+91 54321 09876",
    age: 39,
    gender: "female",
    condition: "Thyroid",
    joinedDate: "2026-02-10",
    status: "active",
  },
];

const MOCK_MEAL_PLANS: Record<string, ClientMealPlan[]> = {
  "1": [
    {
      id: "mp1",
      clientId: "1",
      title: "PCOS Recovery – Week 1",
      status: "published",
      weekStartDate: "2026-02-17",
      createdAt: "2026-02-15",
    },
    {
      id: "mp2",
      clientId: "1",
      title: "PCOS Recovery – Week 2",
      status: "review",
      weekStartDate: "2026-02-24",
      createdAt: "2026-02-22",
    },
    {
      id: "mp3",
      clientId: "1",
      title: "PCOS Recovery – Week 3",
      status: "draft",
      weekStartDate: "2026-03-03",
      createdAt: "2026-02-28",
    },
  ],
  "2": [
    {
      id: "mp4",
      clientId: "2",
      title: "Thyroid Support – Week 1",
      status: "published",
      weekStartDate: "2026-02-10",
      createdAt: "2026-02-08",
    },
    {
      id: "mp5",
      clientId: "2",
      title: "Thyroid Support – Week 2",
      status: "draft",
      weekStartDate: "2026-02-17",
      createdAt: "2026-02-15",
    },
  ],
  "3": [
    {
      id: "mp6",
      clientId: "3",
      title: "Peri-menopause Care – Week 1",
      status: "published",
      weekStartDate: "2026-02-03",
      createdAt: "2026-02-01",
    },
  ],
  "4": [],
  "5": [
    {
      id: "mp7",
      clientId: "5",
      title: "Thyroid Nutrition – Week 1",
      status: "review",
      weekStartDate: "2026-02-24",
      createdAt: "2026-02-22",
    },
  ],
};
// ─────────────────────────────────────────────────────────────────────────────

interface DashboardShellProps {
  userName: string;
  userImage?: string;
  userEmail?: string;
}

export default function DashboardShell({
  userName,
  userImage,
  userEmail,
}: DashboardShellProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const filteredClients = useMemo(() => {
    if (!searchQuery.trim()) return MOCK_CLIENTS;
    const q = searchQuery.toLowerCase();
    return MOCK_CLIENTS.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.condition.toLowerCase().includes(q) ||
        c.phone.includes(q),
    );
  }, [searchQuery]);

  const selectedMealPlans = selectedClient
    ? (MOCK_MEAL_PLANS[selectedClient.id] ?? [])
    : [];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleCreateClient = () => {
    setIsCreateModalOpen(true);
  };

  const handleClientCreated = () => {
    // TODO: Refetch clients from API when wired up
    console.log("Client created — refresh list");
  };

  const handleSelectClient = (client: Client) => {
    setSelectedClient(client);
  };

  const handleViewMealPlanDetails = (mealPlan: ClientMealPlan) => {
    // TODO: Navigate to meal plan detail / editor
    console.log("View meal plan:", mealPlan.id);
  };

  return (
    <div className="flex h-screen flex-col bg-zinc-50 dark:bg-zinc-950">
      {/* Create Client Modal */}
      <CreateClientModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onClientCreated={handleClientCreated}
      />

      {/* Navbar */}
      <DashboardNavbar
        userName={userName}
        userImage={userImage}
        userEmail={userEmail}
        onSearch={handleSearch}
        onCreateClient={handleCreateClient}
      />

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel – Client List */}
        <aside className="w-full overflow-y-auto border-r border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950 sm:w-96 lg:w-105">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              My Clients
            </h2>
            <span className="rounded-full bg-zinc-200 px-2.5 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
              {filteredClients.length}
            </span>
          </div>
          <ClientList
            clients={filteredClients}
            selectedClient={selectedClient}
            onSelectClient={handleSelectClient}
          />
        </aside>

        {/* Right Panel – Client Details */}
        <main className="hidden flex-1 overflow-hidden bg-white dark:bg-zinc-900 sm:block">
          <ClientDetailPanel
            client={selectedClient}
            mealPlans={selectedMealPlans}
            onViewMealPlanDetails={handleViewMealPlanDetails}
          />
        </main>
      </div>
    </div>
  );
}
