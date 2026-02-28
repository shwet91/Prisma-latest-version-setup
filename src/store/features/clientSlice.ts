import { createSlice, PayloadAction, createSelector } from "@reduxjs/toolkit";
import { Client, ClientMealPlan } from "@/types/client";
import { RootState } from "../store";

// ─── State Shape ───────────────────────────────────────────────

interface ClientFilters {
  search: string;
  status: "all" | "active" | "inactive";
  condition: string | null;
  sortBy: "name" | "joinedDate" | "age";
  sortOrder: "asc" | "desc";
}

interface ClientState {
  /** All clients keyed by id for O(1) lookups */
  byId: Record<string, Client>;
  /** Ordered list of client ids (controls display order) */
  allIds: string[];
  /** Currently selected client id */
  selectedClientId: string | null;
  /** Meal plans keyed by client id */
  mealPlansByClientId: Record<string, ClientMealPlan[]>;
  /** Filter / search state */
  filters: ClientFilters;
  /** Loading & error state */
  loading: boolean;
  error: string | null;
}

const initialFilters: ClientFilters = {
  search: "",
  status: "all",
  condition: null,
  sortBy: "name",
  sortOrder: "asc",
};

const initialState: ClientState = {
  byId: {},
  allIds: [],
  selectedClientId: null,
  mealPlansByClientId: {},
  filters: initialFilters,
  loading: false,
  error: null,
};

// ─── Slice ─────────────────────────────────────────────────────

const clientSlice = createSlice({
  name: "clients",
  initialState,
  reducers: {
    // ── Bulk operations ──────────────────────────────────────

    /** Replace the entire client list (e.g. after initial fetch) */
    setClients: (state, action: PayloadAction<Client[]>) => {
      state.byId = {};
      state.allIds = [];
      action.payload.forEach((client) => {
        state.byId[client.id] = client;
        state.allIds.push(client.id);
      });
      state.loading = false;
      state.error = null;
    },

    // ── Single-client CRUD ───────────────────────────────────

    /** Add a new client */
    addClient: (state, action: PayloadAction<Client>) => {
      const client = action.payload;
      if (!state.byId[client.id]) {
        state.byId[client.id] = client;
        state.allIds.push(client.id);
      }
    },

    /** Update an existing client (partial merge) */
    updateClient: (
      state,
      action: PayloadAction<{
        id: string;
        changes: Partial<Omit<Client, "id">>;
      }>,
    ) => {
      const { id, changes } = action.payload;
      if (state.byId[id]) {
        state.byId[id] = { ...state.byId[id], ...changes };
      }
    },

    /** Remove a client by id */
    removeClient: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      delete state.byId[id];
      state.allIds = state.allIds.filter((cid) => cid !== id);
      delete state.mealPlansByClientId[id];
      if (state.selectedClientId === id) {
        state.selectedClientId = null;
      }
    },

    // ── Selection ────────────────────────────────────────────

    /** Select a client (for detail panel) */
    selectClient: (state, action: PayloadAction<string | null>) => {
      state.selectedClientId = action.payload;
    },

    // ── Meal Plans ───────────────────────────────────────────

    /** Set meal plans for a specific client */
    setClientMealPlans: (
      state,
      action: PayloadAction<{ clientId: string; plans: ClientMealPlan[] }>,
    ) => {
      state.mealPlansByClientId[action.payload.clientId] = action.payload.plans;
    },

    /** Add a single meal plan for a client */
    addClientMealPlan: (state, action: PayloadAction<ClientMealPlan>) => {
      const plan = action.payload;
      if (!state.mealPlansByClientId[plan.clientId]) {
        state.mealPlansByClientId[plan.clientId] = [];
      }
      state.mealPlansByClientId[plan.clientId].push(plan);
    },

    /** Update a meal plan's status (draft → review → published) */
    updateMealPlanStatus: (
      state,
      action: PayloadAction<{
        clientId: string;
        planId: string;
        status: ClientMealPlan["status"];
      }>,
    ) => {
      const { clientId, planId, status } = action.payload;
      const plans = state.mealPlansByClientId[clientId];
      if (plans) {
        const plan = plans.find((p) => p.id === planId);
        if (plan) plan.status = status;
      }
    },

    /** Remove a meal plan */
    removeMealPlan: (
      state,
      action: PayloadAction<{ clientId: string; planId: string }>,
    ) => {
      const { clientId, planId } = action.payload;
      const plans = state.mealPlansByClientId[clientId];
      if (plans) {
        state.mealPlansByClientId[clientId] = plans.filter(
          (p) => p.id !== planId,
        );
      }
    },

    // ── Filters ──────────────────────────────────────────────

    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.filters.search = action.payload;
    },

    setStatusFilter: (
      state,
      action: PayloadAction<ClientFilters["status"]>,
    ) => {
      state.filters.status = action.payload;
    },

    setConditionFilter: (state, action: PayloadAction<string | null>) => {
      state.filters.condition = action.payload;
    },

    setSortBy: (state, action: PayloadAction<ClientFilters["sortBy"]>) => {
      state.filters.sortBy = action.payload;
    },

    toggleSortOrder: (state) => {
      state.filters.sortOrder =
        state.filters.sortOrder === "asc" ? "desc" : "asc";
    },

    resetFilters: (state) => {
      state.filters = initialFilters;
    },

    // ── Loading / Error ──────────────────────────────────────

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

// ─── Actions ───────────────────────────────────────────────────

export const {
  setClients,
  addClient,
  updateClient,
  removeClient,
  selectClient,
  setClientMealPlans,
  addClientMealPlan,
  updateMealPlanStatus,
  removeMealPlan,
  setSearchQuery,
  setStatusFilter,
  setConditionFilter,
  setSortBy,
  toggleSortOrder,
  resetFilters,
  setLoading,
  setError,
} = clientSlice.actions;

// ─── Selectors ─────────────────────────────────────────────────

/** Raw state accessor */
const selectClientState = (state: RootState) => state.clients;

/** All clients as an array */
export const selectAllClients = createSelector([selectClientState], (cs) =>
  cs.allIds.map((id) => cs.byId[id]),
);

/** Single client by id */
export const selectClientById = (state: RootState, id: string) =>
  state.clients.byId[id] ?? null;

/** Currently selected client */
export const selectSelectedClient = createSelector([selectClientState], (cs) =>
  cs.selectedClientId ? (cs.byId[cs.selectedClientId] ?? null) : null,
);

/** Filtered & sorted client list */
export const selectFilteredClients = createSelector(
  [selectAllClients, (state: RootState) => state.clients.filters],
  (clients, filters) => {
    let result = [...clients];

    // Search
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.email?.toLowerCase().includes(q) ||
          c.phoneNo?.toLowerCase().includes(q),
      );
    }

    // Status
    if (filters.status !== "all") {
      result = result.filter((c) => c.status === filters.status);
    }

    // Condition
    if (filters.condition) {
      const cond = filters.condition.toLowerCase();
      result = result.filter((c) => c.condition?.toLowerCase().includes(cond));
    }

    // Sort
    result.sort((a, b) => {
      let cmp = 0;
      switch (filters.sortBy) {
        case "name":
          cmp = a.name.localeCompare(b.name);
          break;
        case "joinedDate":
          cmp =
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case "age":
          cmp = (a.age ?? 0) - (b.age ?? 0);
          break;
      }
      return filters.sortOrder === "asc" ? cmp : -cmp;
    });

    return result;
  },
);

/** Meal plans for the selected client */
export const selectSelectedClientMealPlans = createSelector(
  [selectClientState],
  (cs) =>
    cs.selectedClientId
      ? (cs.mealPlansByClientId[cs.selectedClientId] ?? [])
      : [],
);

/** Meal plans for a given client id */
export const selectMealPlansByClientId = (state: RootState, clientId: string) =>
  state.clients.mealPlansByClientId[clientId] ?? [];

/** Total client count */
export const selectClientCount = (state: RootState) =>
  state.clients.allIds.length;

/** Loading state */
export const selectClientsLoading = (state: RootState) => state.clients.loading;

/** Error state */
export const selectClientsError = (state: RootState) => state.clients.error;

/** Current filters */
export const selectClientFilters = (state: RootState) => state.clients.filters;

// ─── Reducer ───────────────────────────────────────────────────

export default clientSlice.reducer;
