"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { ClientMealPlan } from "@/types/client";
import type { AppDispatch } from "@/store/store";
import { DashboardNavbar } from "@/components/dashboard";
import { ClientList } from "@/components/dashboard";
import { ClientDetailPanel } from "@/components/dashboard";
import CreateClientModal from "./CreateClientModal";
import { loadExistingMealPlan } from "@/store/features/mealSlice";
import {
  selectFilteredClients,
  selectSelectedClient,
  selectSelectedClientMealPlans,
  selectClient,
  setSearchQuery,
  selectClientsLoading,
  selectClientsError,
  removeMealPlan,
} from "@/store/features/clientSlice";

import { useState } from "react";

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
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const filteredClients = useSelector(selectFilteredClients);
  const selectedClient = useSelector(selectSelectedClient);
  const selectedMealPlans = useSelector(selectSelectedClientMealPlans);
  const isLoading = useSelector(selectClientsLoading);
  const error = useSelector(selectClientsError);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleSearch = useCallback(
    (query: string) => {
      dispatch(setSearchQuery(query));
    },
    [dispatch],
  );

  const handleCreateClient = () => {
    setIsCreateModalOpen(true);
  };

  const handleClientCreated = () => {
    // Client is added to store via CreateClientModal dispatch — nothing extra needed
  };

  const handleSelectClient = useCallback(
    (client: { id: string }) => {
      dispatch(selectClient(client.id));
    },
    [dispatch],
  );

  const handleViewMealPlanDetails = (mealPlan: ClientMealPlan) => {
    dispatch(
      loadExistingMealPlan({
        mealPlanId: mealPlan.id,
        clientId: mealPlan.clientId,
        weekData: mealPlan.weekData,
        status: mealPlan.status,
      }),
    );
    router.push("/editor");
  };

  const handleDeleteMealPlan = async (mealPlan: ClientMealPlan) => {
    try {
      const res = await fetch(`/api/meal-plans/${mealPlan.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        console.error("Failed to delete meal plan");
        return;
      }
      dispatch(
        removeMealPlan({ clientId: mealPlan.clientId, planId: mealPlan.id }),
      );
    } catch (err) {
      console.error("Error deleting meal plan:", err);
    }
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

          {/* Loading state */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <svg
                className="h-6 w-6 animate-spin text-indigo-500"
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
            </div>
          )}

          {/* Error state */}
          {error && !isLoading && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center text-sm text-red-600 dark:border-red-800 dark:bg-red-950/30 dark:text-red-400">
              {error}
            </div>
          )}

          {/* Client list */}
          {!isLoading && !error && (
            <ClientList
              clients={filteredClients}
              selectedClient={selectedClient}
              onSelectClient={handleSelectClient}
            />
          )}
        </aside>

        {/* Right Panel – Client Details */}
        <main className="hidden flex-1 overflow-hidden bg-white dark:bg-zinc-900 sm:block">
          <ClientDetailPanel
            client={selectedClient}
            mealPlans={selectedMealPlans}
            onViewMealPlanDetails={handleViewMealPlanDetails}
            onDeleteMealPlan={handleDeleteMealPlan}
          />
        </main>
      </div>
    </div>
  );
}
