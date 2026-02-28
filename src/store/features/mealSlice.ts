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
  weekData: WeekData;
  status: "draft" | "review" | "published";
}

const initialState: MealState = {
  currentClientId: null,
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
      state.weekData = createEmptyWeek();
      state.status = "draft";
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
} = mealSlice.actions;

export default mealSlice.reducer;
