import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type {
  MealCell,
  DayOfWeek,
  MealType,
  WeekData,
} from "@/types/meal-plan";
import { createEmptyWeek } from "@/types/meal-plan";

interface MealState {
  currentClientId: string | null;
  mealPlanId: string | null; // null = not saved to DB yet
  weekData: WeekData;
  status: "draft" | "review" | "published";
}

const initialState: MealState = {
  currentClientId: null,
  mealPlanId: null,
  weekData: createEmptyWeek(),
  status: "draft",
};

const mealSlice = createSlice({
  name: "meal",
  initialState,
  reducers: {
    setCurrentClientId(state, action: PayloadAction<string | null>) {
      state.currentClientId = action.payload;
    },
    setWeekData(state, action: PayloadAction<WeekData>) {
      state.weekData = action.payload;
    },
    updateCell(
      state,
      action: PayloadAction<{
        day: DayOfWeek;
        meal: MealType;
        cell: MealCell;
      }>,
    ) {
      const { day, meal, cell } = action.payload;
      state.weekData[day][meal] = cell;
    },
    pasteRow(
      state,
      action: PayloadAction<{
        targetMeal: MealType;
        rowData: Record<DayOfWeek, MealCell>;
      }>,
    ) {
      const { targetMeal, rowData } = action.payload;
      for (const day of Object.keys(rowData) as DayOfWeek[]) {
        state.weekData[day][targetMeal] = rowData[day];
      }
    },
    pasteColumn(
      state,
      action: PayloadAction<{
        targetDay: DayOfWeek;
        colData: Record<MealType, MealCell>;
      }>,
    ) {
      const { targetDay, colData } = action.payload;
      for (const meal of Object.keys(colData) as MealType[]) {
        state.weekData[targetDay][meal] = colData[meal];
      }
    },
    duplicateDay(
      state,
      action: PayloadAction<{ fromDay: DayOfWeek; toDay: DayOfWeek }>,
    ) {
      const { fromDay, toDay } = action.payload;
      state.weekData[toDay] = JSON.parse(
        JSON.stringify(state.weekData[fromDay]),
      );
    },
    clearAll(state) {
      state.weekData = createEmptyWeek();
    },
    setStatus(state, action: PayloadAction<"draft" | "review" | "published">) {
      state.status = action.payload;
    },
    resetMealPlan(state) {
      state.weekData = createEmptyWeek();
      state.status = "draft";
    },
    /** Start a new meal plan for a specific client */
    startNewMealPlan(state, action: PayloadAction<string>) {
      state.currentClientId = action.payload;
      state.mealPlanId = null;
      state.weekData = createEmptyWeek();
      state.status = "draft";
    },
    /** Set the meal plan ID after saving to DB */
    setMealPlanId(state, action: PayloadAction<string>) {
      state.mealPlanId = action.payload;
    },
    /** Load an existing meal plan into the editor */
    loadExistingMealPlan(
      state,
      action: PayloadAction<{
        mealPlanId: string;
        clientId: string;
        weekData: WeekData;
        status: "draft" | "review" | "published";
      }>,
    ) {
      state.mealPlanId = action.payload.mealPlanId;
      state.currentClientId = action.payload.clientId;
      state.weekData = action.payload.weekData;
      state.status = action.payload.status;
    },
  },
});

export const {
  setCurrentClientId,
  setWeekData,
  updateCell,
  pasteRow,
  pasteColumn,
  duplicateDay,
  clearAll,
  setStatus,
  resetMealPlan,
  startNewMealPlan,
  setMealPlanId,
  loadExistingMealPlan,
} = mealSlice.actions;

export default mealSlice.reducer;
