"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@/store/store";
import {
  updateCell as updateCellAction,
  setWeekData as setWeekDataAction,
  pasteRow as pasteRowAction,
  pasteColumn as pasteColumnAction,
  duplicateDay as duplicateDayAction,
  clearAll as clearAllAction,
  setStatus as setStatusAction,
  setMealPlanId,
} from "@/store/features/mealSlice";
import type {
  MealCell,
  DayOfWeek,
  MealType,
  WeekData,
} from "@/types/meal-plan";
import { DAYS, MEAL_SLOTS } from "@/types/meal-plan";
import { MEAL_TEMPLATES, getTemplateWeekData } from "@/lib/templates";

interface CellPosition {
  day: DayOfWeek;
  meal: MealType;
}

interface CellEditorProps {
  cell: MealCell;
  onSave: (cell: MealCell) => void;
  onClose: () => void;
  position: { top: number; left: number };
}

function CellEditor({ cell, onSave, onClose, position }: CellEditorProps) {
  const [diet, setDiet] = useState(cell.diet);
  const [quantity, setQuantity] = useState(cell.quantity);
  const [note, setNote] = useState(cell.note);
  const ref = useRef<HTMLDivElement>(null);
  const dietRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    dietRef.current?.focus();
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        handleSave();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [diet, quantity, note]);

  const handleSave = () => {
    onSave({ diet, quantity, note });
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
  };

  return (
    <div
      ref={ref}
      className="fixed z-50 bg-white dark:bg-zinc-900 rounded-lg shadow-2xl border-2 border-indigo-400 dark:border-indigo-500 p-3 w-64"
      style={{ top: position.top, left: position.left }}
      onKeyDown={handleKeyDown}
    >
      <div className="space-y-2">
        <div>
          <label className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
            Diet
          </label>
          <input
            ref={dietRef}
            type="text"
            value={diet}
            onChange={(e) => setDiet(e.target.value)}
            className="w-full px-2 py-1 text-xs border border-zinc-200 dark:border-zinc-700 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
            placeholder="e.g. Oats with milk"
          />
        </div>
        <div>
          <label className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
            Quantity
          </label>
          <input
            type="text"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full px-2 py-1 text-xs border border-zinc-200 dark:border-zinc-700 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
            placeholder="e.g. 1 bowl"
          />
        </div>
        <div>
          <label className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
            Note
          </label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full px-2 py-1 text-xs border border-zinc-200 dark:border-zinc-700 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
            placeholder="e.g. no sugar"
          />
        </div>
        <div className="flex gap-2 pt-1">
          <button
            onClick={handleSave}
            className="flex-1 px-2 py-1 text-xs font-medium text-white bg-indigo-600 rounded hover:bg-indigo-700 transition-colors cursor-pointer"
          >
            Save
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-2 py-1 text-xs font-medium text-zinc-700 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function GridCell({
  cell,
  isSelected,
  isCopied,
  onClick,
  onDoubleClick,
}: {
  cell: MealCell;
  isSelected: boolean;
  isCopied: boolean;
  onClick: () => void;
  onDoubleClick: (rect: DOMRect) => void;
}) {
  const ref = useRef<HTMLTableCellElement>(null);
  const isEmpty = !cell.diet && !cell.quantity && !cell.note;

  return (
    <td
      ref={ref}
      onClick={onClick}
      onDoubleClick={() => {
        if (ref.current) {
          onDoubleClick(ref.current.getBoundingClientRect());
        }
      }}
      className={`
        relative px-1.5 py-1 border cursor-pointer select-none transition-all duration-100
        min-w-30 max-w-37.5 h-15.5 align-top text-[11px] leading-tight
        ${
          isSelected
            ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/20 ring-2 ring-indigo-500/50 z-10"
            : "border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
        }
        ${isCopied ? "border-dashed border-indigo-400 bg-indigo-100/40 dark:bg-indigo-950/30" : ""}
        ${isEmpty ? "bg-white dark:bg-zinc-900" : "bg-white dark:bg-zinc-900"}
      `}
    >
      {isEmpty ? (
        <span className="text-zinc-400 dark:text-zinc-500 text-[10px] italic">
          Click to add
        </span>
      ) : (
        <div className="space-y-0.5 overflow-hidden">
          <div className="font-medium text-zinc-900 dark:text-zinc-100 truncate">
            {cell.diet}
          </div>
          {cell.quantity && (
            <div className="text-indigo-600 dark:text-indigo-400 text-[10px] truncate">
              {cell.quantity}
            </div>
          )}
          {cell.note && (
            <div className="text-zinc-500 dark:text-zinc-400 text-[10px] truncate italic">
              {cell.note}
            </div>
          )}
        </div>
      )}
    </td>
  );
}

export default function MealPlanGrid() {
  const dispatch = useDispatch<AppDispatch>();
  const weekData = useSelector((state: RootState) => state.meal.weekData);
  const status = useSelector((state: RootState) => state.meal.status);
  const currentClientId = useSelector(
    (state: RootState) => state.meal.currentClientId,
  );
  const mealPlanId = useSelector((state: RootState) => state.meal.mealPlanId);

  const [saving, setSaving] = useState(false);

  const [selectedCell, setSelectedCell] = useState<CellPosition | null>(null);
  const [editingCell, setEditingCell] = useState<CellPosition | null>(null);
  const [editorPos, setEditorPos] = useState({ top: 0, left: 0 });
  const [clipboard, setClipboard] = useState<{
    pos: CellPosition;
    cell: MealCell;
  } | null>(null);
  const [copiedRow, setCopiedRow] = useState<MealType | null>(null);
  const [copiedCol, setCopiedCol] = useState<DayOfWeek | null>(null);
  // Store full row/column data so paste works correctly
  const [copiedRowData, setCopiedRowData] = useState<Record<
    DayOfWeek,
    MealCell
  > | null>(null);
  const [copiedColData, setCopiedColData] = useState<Record<
    MealType,
    MealCell
  > | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [copiedPlan, setCopiedPlan] = useState<WeekData | null>(null);
  const [showTemplateMenu, setShowTemplateMenu] = useState(false);
  const [visibleDays, setVisibleDays] = useState<Set<DayOfWeek>>(
    new Set(DAYS.map((d) => d.key)),
  );
  const [visibleMeals, setVisibleMeals] = useState<Set<MealType>>(
    new Set(MEAL_SLOTS.map((m) => m.key)),
  );
  const [showDayPicker, setShowDayPicker] = useState(false);
  const [showMealPicker, setShowMealPicker] = useState(false);
  const dayPickerRef = useRef<HTMLDivElement>(null);
  const mealPickerRef = useRef<HTMLDivElement>(null);
  const templateMenuRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLTableElement>(null);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  }, []);

  const updateCell = useCallback(
    (day: DayOfWeek, meal: MealType, cell: MealCell) => {
      dispatch(updateCellAction({ day, meal, cell }));
      showToast("Auto-saved");
    },
    [dispatch, showToast],
  );

  const handleCellClick = useCallback((day: DayOfWeek, meal: MealType) => {
    setSelectedCell({ day, meal });
  }, []);

  const handleCellDoubleClick = useCallback(
    (day: DayOfWeek, meal: MealType, rect: DOMRect) => {
      setEditingCell({ day, meal });
      // Position editor near the cell, but keep it within viewport
      const top = Math.min(rect.bottom + 4, window.innerHeight - 240);
      const left = Math.min(rect.left, window.innerWidth - 280);
      setEditorPos({ top, left });
    },
    [],
  );

  // Keyboard navigation & shortcuts
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (editingCell) return; // let editor handle keys

      if (!selectedCell) return;

      const dayIdx = DAYS.findIndex((d) => d.key === selectedCell.day);
      const mealIdx = MEAL_SLOTS.findIndex((m) => m.key === selectedCell.meal);

      switch (e.key) {
        case "ArrowUp":
          e.preventDefault();
          if (mealIdx > 0)
            setSelectedCell({
              day: selectedCell.day,
              meal: MEAL_SLOTS[mealIdx - 1].key,
            });
          break;
        case "ArrowDown":
          e.preventDefault();
          if (mealIdx < MEAL_SLOTS.length - 1)
            setSelectedCell({
              day: selectedCell.day,
              meal: MEAL_SLOTS[mealIdx + 1].key,
            });
          break;
        case "ArrowLeft":
          e.preventDefault();
          if (dayIdx > 0)
            setSelectedCell({
              day: DAYS[dayIdx - 1].key,
              meal: selectedCell.meal,
            });
          break;
        case "ArrowRight":
          e.preventDefault();
          if (dayIdx < DAYS.length - 1)
            setSelectedCell({
              day: DAYS[dayIdx + 1].key,
              meal: selectedCell.meal,
            });
          break;
        case "Enter":
          e.preventDefault();
          // Open editor for selected cell - find the DOM element
          if (tableRef.current) {
            const cellEl = tableRef.current.querySelector(
              `[data-day="${selectedCell.day}"][data-meal="${selectedCell.meal}"]`,
            ) as HTMLElement;
            if (cellEl) {
              const rect = cellEl.getBoundingClientRect();
              handleCellDoubleClick(selectedCell.day, selectedCell.meal, rect);
            }
          }
          break;
        case "Delete":
        case "Backspace":
          e.preventDefault();
          updateCell(selectedCell.day, selectedCell.meal, {
            diet: "",
            quantity: "",
            note: "",
          });
          showToast("Cell cleared");
          break;
        case "c":
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            setClipboard({
              pos: selectedCell,
              cell: { ...weekData[selectedCell.day][selectedCell.meal] },
            });
            setCopiedRow(null);
            setCopiedCol(null);
            showToast("Cell copied");
          }
          break;
        case "v":
          if ((e.ctrlKey || e.metaKey) && clipboard) {
            e.preventDefault();
            if (copiedRow && copiedRowData) {
              // Paste entire row to the selected cell's meal slot
              pasteRow(selectedCell.meal);
            } else if (copiedCol && copiedColData) {
              // Paste entire column to the selected cell's day
              pasteColumn(selectedCell.day);
            } else {
              updateCell(selectedCell.day, selectedCell.meal, {
                ...clipboard.cell,
              });
              showToast("Cell pasted");
            }
          }
          break;
        case "Escape":
          setSelectedCell(null);
          break;
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    selectedCell,
    editingCell,
    clipboard,
    copiedRow,
    copiedCol,
    copiedRowData,
    copiedColData,
    weekData,
    updateCell,
    handleCellDoubleClick,
    showToast,
  ]);

  const copyRow = (meal: MealType) => {
    setCopiedRow(meal);
    setCopiedCol(null);
    setCopiedColData(null);
    // Snapshot entire row data (all days for this meal)
    const rowData = {} as Record<DayOfWeek, MealCell>;
    for (const day of DAYS) {
      rowData[day.key] = { ...weekData[day.key][meal] };
    }
    setCopiedRowData(rowData);
    setClipboard({
      pos: { day: "monday", meal },
      cell: weekData["monday"][meal],
    });
    showToast(`Row "${MEAL_SLOTS.find((m) => m.key === meal)?.label}" copied`);
  };

  const pasteRow = (targetMeal: MealType) => {
    if (!copiedRowData) return;
    dispatch(pasteRowAction({ targetMeal, rowData: copiedRowData }));
    showToast(
      `Pasted "${MEAL_SLOTS.find((m) => m.key === copiedRow)?.label}" → "${MEAL_SLOTS.find((m) => m.key === targetMeal)?.label}"`,
    );
  };

  const copyColumn = (day: DayOfWeek) => {
    setCopiedCol(day);
    setCopiedRow(null);
    setCopiedRowData(null);
    // Snapshot entire column data (all meals for this day)
    const colData = {} as Record<MealType, MealCell>;
    for (const meal of MEAL_SLOTS) {
      colData[meal.key] = { ...weekData[day][meal.key] };
    }
    setCopiedColData(colData);
    setClipboard({
      pos: { day, meal: "early_morning" },
      cell: weekData[day]["early_morning"],
    });
    showToast(`Column "${DAYS.find((d) => d.key === day)?.label}" copied`);
  };

  const pasteColumn = (targetDay: DayOfWeek) => {
    if (!copiedColData) return;
    dispatch(pasteColumnAction({ targetDay, colData: copiedColData }));
    showToast(
      `Pasted "${DAYS.find((d) => d.key === copiedCol)?.short}" → "${DAYS.find((d) => d.key === targetDay)?.short}"`,
    );
  };

  const duplicateDay = (fromDay: DayOfWeek, toDay: DayOfWeek) => {
    dispatch(duplicateDayAction({ fromDay, toDay }));
    showToast(
      `${DAYS.find((d) => d.key === fromDay)?.short} → ${DAYS.find((d) => d.key === toDay)?.short}`,
    );
  };

  const clearAll = () => {
    dispatch(clearAllAction());
    showToast("All cells cleared");
  };

  const loadTemplate = (templateId: string) => {
    const data = getTemplateWeekData(templateId);
    if (data) {
      dispatch(setWeekDataAction(data));
      const name = MEAL_TEMPLATES.find((t) => t.id === templateId)?.name;
      showToast(`Template "${name}" loaded`);
    }
    setShowTemplateMenu(false);
  };

  // Close template menu on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        templateMenuRef.current &&
        !templateMenuRef.current.contains(e.target as Node)
      ) {
        setShowTemplateMenu(false);
      }
      if (
        dayPickerRef.current &&
        !dayPickerRef.current.contains(e.target as Node)
      ) {
        setShowDayPicker(false);
      }
      if (
        mealPickerRef.current &&
        !mealPickerRef.current.contains(e.target as Node)
      ) {
        setShowMealPicker(false);
      }
    }
    if (showTemplateMenu || showDayPicker || showMealPicker) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showTemplateMenu, showDayPicker, showMealPicker]);

  const toggleDay = (day: DayOfWeek) => {
    setVisibleDays((prev) => {
      const next = new Set(prev);
      if (next.has(day)) {
        if (next.size <= 1) {
          showToast("Need at least 1 day");
          return prev;
        }
        next.delete(day);
      } else {
        next.add(day);
      }
      return next;
    });
  };

  const toggleMeal = (meal: MealType) => {
    setVisibleMeals((prev) => {
      const next = new Set(prev);
      if (next.has(meal)) {
        if (next.size <= 1) {
          showToast("Need at least 1 meal");
          return prev;
        }
        next.delete(meal);
      } else {
        next.add(meal);
      }
      return next;
    });
  };

  const activeDays = DAYS.filter((d) => visibleDays.has(d.key));
  const activeMeals = MEAL_SLOTS.filter((m) => visibleMeals.has(m.key));

  return (
    <div className="h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 overflow-hidden">
      {/* Header Bar */}
      <div className="flex-none flex items-center justify-between px-4 py-2.5 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              Weekly Meal Plan
            </h1>
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400">
              {currentClientId
                ? `Client ID: ${currentClientId}`
                : "No client selected"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Status Badge */}
          <span
            className={`px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
              !mealPlanId
                ? "bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                : status === "draft"
                  ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400"
                  : status === "review"
                    ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
                    : "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
            }`}
          >
            {!mealPlanId ? "unsaved" : status}
          </span>

          {/* Action Buttons */}
          <div className="relative" ref={templateMenuRef}>
            <button
              onClick={() => setShowTemplateMenu((v) => !v)}
              className={`px-2.5 py-1.5 text-[10px] font-medium border rounded-md transition-colors cursor-pointer flex items-center gap-1 ${
                showTemplateMenu
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-950/50"
              }`}
            >
              <svg
                className="w-3 h-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h7"
                />
              </svg>
              Load Template
              <svg
                className={`w-2.5 h-2.5 transition-transform ${showTemplateMenu ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {showTemplateMenu && (
              <div className="absolute top-full right-0 mt-1 z-50 bg-white dark:bg-zinc-900 rounded-lg shadow-xl border border-zinc-200 dark:border-zinc-700 py-1.5 w-56 animate-in fade-in">
                <div className="px-3 py-1 text-[9px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Choose a template
                </div>
                {MEAL_TEMPLATES.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => loadTemplate(template.id)}
                    className="w-full text-left px-3 py-1.5 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer group"
                  >
                    <div className="text-[11px] font-medium text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                      {template.name}
                    </div>
                    <div className="text-[9px] text-zinc-500 dark:text-zinc-400">
                      {template.description}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={() => {
              setCopiedPlan(JSON.parse(JSON.stringify(weekData)));
              showToast("Entire meal plan copied!");
            }}
            className={`px-2.5 py-1.5 text-[10px] font-medium border rounded-md transition-colors cursor-pointer flex items-center gap-1 ${
              copiedPlan
                ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-950/50"
                : "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-950/50"
            }`}
          >
            <svg
              className="w-3 h-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            {copiedPlan ? "✓ Plan Copied" : "Copy Plan"}
          </button>
          {copiedPlan && (
            <button
              onClick={() => {
                dispatch(
                  setWeekDataAction(JSON.parse(JSON.stringify(copiedPlan))),
                );
                showToast("Meal plan pasted!");
              }}
              className="px-2.5 py-1.5 text-[10px] font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-md hover:bg-blue-100 dark:hover:bg-blue-950/50 transition-colors cursor-pointer flex items-center gap-1 animate-pulse"
            >
              <svg
                className="w-3 h-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              Paste Plan
            </button>
          )}
          <button
            onClick={clearAll}
            className="px-2.5 py-1.5 text-[10px] font-medium text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-md hover:bg-red-100 dark:hover:bg-red-950/50 transition-colors cursor-pointer"
          >
            Clear All
          </button>

          <div className="w-px h-6 bg-zinc-200 dark:bg-zinc-700 mx-1" />

          {/* Conditional workflow buttons */}
          {!mealPlanId && (
            <button
              disabled={saving || !currentClientId}
              onClick={async () => {
                if (!currentClientId) {
                  showToast("No client selected");
                  return;
                }
                setSaving(true);
                try {
                  const res = await fetch("/api/meal-plans", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      clientId: currentClientId,
                      weekData,
                    }),
                  });
                  if (!res.ok) {
                    const err = await res.json();
                    showToast(err.error || "Failed to save");
                    return;
                  }
                  const data = await res.json();
                  dispatch(setMealPlanId(data.id));
                  dispatch(setStatusAction("draft"));
                  showToast("Meal plan saved!");
                } catch {
                  showToast("Network error");
                } finally {
                  setSaving(false);
                }
              }}
              className="px-3 py-1.5 text-[10px] font-semibold rounded-md transition-colors cursor-pointer bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
            >
              <svg
                className="w-3 h-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              {saving ? "Saving..." : "Save"}
            </button>
          )}

          {mealPlanId && status === "draft" && (
            <button
              disabled={saving}
              onClick={async () => {
                setSaving(true);
                try {
                  const res = await fetch("/api/meal-plans", {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      id: mealPlanId,
                      weekData,
                      status: "review",
                    }),
                  });
                  if (!res.ok) {
                    const err = await res.json();
                    showToast(err.error || "Failed to submit");
                    return;
                  }
                  dispatch(setStatusAction("review"));
                  showToast("Submitted for review!");
                } catch {
                  showToast("Network error");
                } finally {
                  setSaving(false);
                }
              }}
              className="px-3 py-1.5 text-[10px] font-semibold rounded-md transition-colors cursor-pointer bg-amber-500 text-white hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
            >
              <svg
                className="w-3 h-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              {saving ? "Submitting..." : "Submit for Review"}
            </button>
          )}

          {mealPlanId && status === "review" && (
            <button
              disabled={saving}
              onClick={async () => {
                setSaving(true);
                try {
                  const res = await fetch("/api/meal-plans", {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      id: mealPlanId,
                      status: "published",
                    }),
                  });
                  if (!res.ok) {
                    const err = await res.json();
                    showToast(err.error || "Failed to publish");
                    return;
                  }
                  dispatch(setStatusAction("published"));
                  showToast("Meal plan published!");
                } catch {
                  showToast("Network error");
                } finally {
                  setSaving(false);
                }
              }}
              className="px-3 py-1.5 text-[10px] font-semibold rounded-md transition-colors cursor-pointer bg-emerald-500 text-white hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
            >
              <svg
                className="w-3 h-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              {saving ? "Publishing..." : "Publish"}
            </button>
          )}

          {mealPlanId && status === "published" && (
            <span className="px-3 py-1.5 text-[10px] font-semibold rounded-md bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
              <svg
                className="w-3 h-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Published
            </span>
          )}
        </div>
      </div>

      {/* Keyboard Shortcuts Hint */}
      <div className="flex-none flex items-center gap-4 px-4 py-1.5 bg-zinc-100/50 dark:bg-zinc-900/50 border-b border-zinc-200/50 dark:border-zinc-800/50 text-[10px] text-zinc-500 dark:text-zinc-400">
        <span>
          <kbd className="px-1 py-0.5 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-[9px]">
            ↑↓←→
          </kbd>{" "}
          Navigate
        </span>
        <span>
          <kbd className="px-1 py-0.5 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-[9px]">
            Enter
          </kbd>{" "}
          Edit
        </span>
        <span>
          <kbd className="px-1 py-0.5 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-[9px]">
            Ctrl+C
          </kbd>{" "}
          Copy
        </span>
        <span>
          <kbd className="px-1 py-0.5 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-[9px]">
            Ctrl+V
          </kbd>{" "}
          Paste
        </span>
        <span>
          <kbd className="px-1 py-0.5 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-[9px]">
            Del
          </kbd>{" "}
          Clear
        </span>
        <span>
          <kbd className="px-1 py-0.5 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-[9px]">
            Esc
          </kbd>{" "}
          Deselect
        </span>

        <div className="ml-auto flex items-center gap-2">
          {/* Day picker */}
          <div className="relative" ref={dayPickerRef}>
            <button
              onClick={() => setShowDayPicker((v) => !v)}
              className={`px-2 py-0.5 rounded text-[10px] font-medium border transition-colors cursor-pointer ${
                showDayPicker
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "text-indigo-600 dark:text-indigo-400 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700"
              }`}
            >
              Days ({activeDays.length}/7)
            </button>
            {showDayPicker && (
              <div className="absolute top-full right-0 mt-1 z-50 bg-white dark:bg-zinc-900 rounded-lg shadow-xl border border-zinc-200 dark:border-zinc-700 py-1.5 w-40">
                <div className="px-3 py-1 text-[9px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Toggle Days
                </div>
                {DAYS.map((day) => (
                  <button
                    key={day.key}
                    onClick={() => toggleDay(day.key)}
                    className="w-full text-left px-3 py-1 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer flex items-center justify-between"
                  >
                    <span
                      className={`text-[11px] ${visibleDays.has(day.key) ? "font-medium text-zinc-900 dark:text-zinc-100" : "text-zinc-400 dark:text-zinc-500"}`}
                    >
                      {day.label}
                    </span>
                    <span
                      className={`text-[11px] ${visibleDays.has(day.key) ? "text-emerald-500" : "text-zinc-300 dark:text-zinc-600"}`}
                    >
                      {visibleDays.has(day.key) ? "✓" : "○"}
                    </span>
                  </button>
                ))}
                <div className="border-t border-zinc-100 dark:border-zinc-800 mt-1 pt-1 px-3 flex gap-1">
                  <button
                    onClick={() =>
                      setVisibleDays(new Set(DAYS.map((d) => d.key)))
                    }
                    className="text-[9px] text-indigo-500 dark:text-indigo-400 hover:underline cursor-pointer"
                  >
                    All
                  </button>
                  <span className="text-zinc-300 dark:text-zinc-600">·</span>
                  <button
                    onClick={() =>
                      setVisibleDays(
                        new Set<DayOfWeek>([
                          "monday",
                          "tuesday",
                          "wednesday",
                          "thursday",
                          "friday",
                        ]),
                      )
                    }
                    className="text-[9px] text-indigo-500 dark:text-indigo-400 hover:underline cursor-pointer"
                  >
                    Weekdays
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Meal picker */}
          <div className="relative" ref={mealPickerRef}>
            <button
              onClick={() => setShowMealPicker((v) => !v)}
              className={`px-2 py-0.5 rounded text-[10px] font-medium border transition-colors cursor-pointer ${
                showMealPicker
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "text-indigo-600 dark:text-indigo-400 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700"
              }`}
            >
              Meals ({activeMeals.length}/7)
            </button>
            {showMealPicker && (
              <div className="absolute top-full right-0 mt-1 z-50 bg-white dark:bg-zinc-900 rounded-lg shadow-xl border border-zinc-200 dark:border-zinc-700 py-1.5 w-48">
                <div className="px-3 py-1 text-[9px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Toggle Meals
                </div>
                {MEAL_SLOTS.map((meal) => (
                  <button
                    key={meal.key}
                    onClick={() => toggleMeal(meal.key)}
                    className="w-full text-left px-3 py-1 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer flex items-center justify-between"
                  >
                    <span
                      className={`text-[11px] ${visibleMeals.has(meal.key) ? "font-medium text-zinc-900 dark:text-zinc-100" : "text-zinc-400 dark:text-zinc-500"}`}
                    >
                      {meal.label}
                      <span className="text-[9px] text-zinc-400 dark:text-zinc-500 ml-1">
                        {meal.time}
                      </span>
                    </span>
                    <span
                      className={`text-[11px] ${visibleMeals.has(meal.key) ? "text-emerald-500" : "text-zinc-300 dark:text-zinc-600"}`}
                    >
                      {visibleMeals.has(meal.key) ? "✓" : "○"}
                    </span>
                  </button>
                ))}
                <div className="border-t border-zinc-100 dark:border-zinc-800 mt-1 pt-1 px-3 flex gap-1">
                  <button
                    onClick={() =>
                      setVisibleMeals(new Set(MEAL_SLOTS.map((m) => m.key)))
                    }
                    className="text-[9px] text-indigo-500 dark:text-indigo-400 hover:underline cursor-pointer"
                  >
                    All
                  </button>
                  <span className="text-zinc-300 dark:text-zinc-600">·</span>
                  <button
                    onClick={() =>
                      setVisibleMeals(
                        new Set<MealType>(["breakfast", "lunch", "dinner"]),
                      )
                    }
                    className="text-[9px] text-indigo-500 dark:text-indigo-400 hover:underline cursor-pointer"
                  >
                    3 Meals
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-hidden p-2">
        <table
          ref={tableRef}
          className="w-full h-full table-fixed border-collapse border border-zinc-200 dark:border-zinc-700 rounded-lg overflow-hidden bg-white dark:bg-zinc-900 shadow-sm"
        >
          <thead>
            <tr>
              <th className="w-25 bg-zinc-800 dark:bg-zinc-800 text-zinc-100 text-[10px] font-semibold p-2 border border-zinc-700 text-left">
                <div className="flex flex-col">
                  <span>Meal / Day</span>
                  <span className="font-normal text-zinc-400 text-[9px]">
                    Week Plan
                  </span>
                </div>
              </th>
              {activeDays.map((day) => (
                <th
                  key={day.key}
                  className="bg-zinc-800 dark:bg-zinc-800 text-zinc-100 text-[11px] font-semibold p-2 border border-zinc-700 text-center cursor-pointer hover:bg-zinc-700 transition-colors"
                  onContextMenu={(e) => {
                    e.preventDefault();
                    copyColumn(day.key);
                  }}
                >
                  <div className="flex flex-col items-center">
                    <span>{day.short}</span>
                    <span className="text-zinc-400 text-[9px] font-normal">
                      {day.label}
                    </span>
                  </div>

                  {/* Copy / Paste / Dup actions */}
                  <div className="flex items-center justify-center gap-1 mt-0.5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        copyColumn(day.key);
                      }}
                      className={`text-[9px] px-1 rounded transition-colors cursor-pointer ${
                        copiedCol === day.key
                          ? "bg-white/30 text-white font-semibold"
                          : "text-zinc-400 hover:text-white hover:bg-white/10"
                      }`}
                      title={`Copy ${day.label} column`}
                    >
                      {copiedCol === day.key ? "✓ copied" : "⧉ copy"}
                    </button>

                    {copiedCol && copiedCol !== day.key && copiedColData && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          pasteColumn(day.key);
                        }}
                        className="text-[9px] px-1 rounded text-amber-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer animate-pulse"
                        title={`Paste ${DAYS.find((d) => d.key === copiedCol)?.short} → ${day.short}`}
                      >
                        ⎘ paste
                      </button>
                    )}

                    {/* Duplicate dropdown */}
                    <div className="group relative inline-block">
                      <button
                        className="text-[9px] text-zinc-400 hover:text-white transition-colors opacity-50 hover:opacity-100 cursor-pointer px-1"
                        title="Duplicate this day"
                      >
                        ⤵
                      </button>
                      <div className="hidden group-hover:block absolute top-full left-1/2 -translate-x-1/2 z-40 bg-white dark:bg-zinc-900 rounded shadow-xl border border-zinc-200 dark:border-zinc-700 py-1 min-w-20">
                        {activeDays
                          .filter((d) => d.key !== day.key)
                          .map((targetDay) => (
                            <button
                              key={targetDay.key}
                              onClick={() =>
                                duplicateDay(day.key, targetDay.key)
                              }
                              className="block w-full px-2 py-0.5 text-[10px] text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-left cursor-pointer"
                            >
                              → {targetDay.short}
                            </button>
                          ))}
                      </div>
                    </div>

                    {/* Remove day */}
                    {activeDays.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleDay(day.key);
                        }}
                        className="text-[9px] text-zinc-400 hover:text-red-400 transition-colors cursor-pointer px-0.5 opacity-50 hover:opacity-100"
                        title={`Hide ${day.label}`}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {activeMeals.map((meal) => (
              <tr key={meal.key} className="group">
                {/* Row header */}
                <td
                  className="bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 px-2 py-1 text-left cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  onContextMenu={(e) => {
                    e.preventDefault();
                    copyRow(meal.key);
                  }}
                >
                  <div className="flex flex-col">
                    <span className="text-[11px] font-semibold text-zinc-900 dark:text-zinc-100">
                      {meal.label}
                    </span>
                    <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono">
                      {meal.time}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        copyRow(meal.key);
                      }}
                      className={`text-[9px] px-1 rounded transition-colors cursor-pointer ${
                        copiedRow === meal.key
                          ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 font-semibold"
                          : "text-zinc-400 dark:text-zinc-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                      }`}
                      title={`Copy ${meal.label} row`}
                    >
                      {copiedRow === meal.key ? "✓ copied" : "⧉ copy"}
                    </button>

                    {copiedRow && copiedRow !== meal.key && copiedRowData && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          pasteRow(meal.key);
                        }}
                        className="text-[9px] px-1 rounded text-indigo-500 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer animate-pulse"
                        title={`Paste ${MEAL_SLOTS.find((m) => m.key === copiedRow)?.label} → ${meal.label}`}
                      >
                        ⎘ paste
                      </button>
                    )}
                  </div>

                  {/* Remove meal row */}
                  {activeMeals.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleMeal(meal.key);
                      }}
                      className="text-[9px] text-zinc-300 dark:text-zinc-600 hover:text-red-500 dark:hover:text-red-400 transition-colors cursor-pointer mt-0.5 opacity-0 group-hover:opacity-100"
                      title={`Hide ${meal.label}`}
                    >
                      ✕ remove
                    </button>
                  )}
                </td>

                {/* Data cells */}
                {activeDays.map((day) => {
                  const isSelected =
                    selectedCell?.day === day.key &&
                    selectedCell?.meal === meal.key;
                  const isCopied =
                    (clipboard?.pos.day === day.key &&
                      clipboard?.pos.meal === meal.key) ||
                    copiedRow === meal.key ||
                    copiedCol === day.key;

                  return (
                    <td
                      key={`${day.key}-${meal.key}`}
                      data-day={day.key}
                      data-meal={meal.key}
                      onClick={() => handleCellClick(day.key, meal.key)}
                      onDoubleClick={(e) => {
                        const rect = (
                          e.currentTarget as HTMLElement
                        ).getBoundingClientRect();
                        handleCellDoubleClick(day.key, meal.key, rect);
                      }}
                      className={`
                        relative px-1.5 py-1 border cursor-pointer select-none transition-all duration-100
                        h-15.5 align-top text-[11px] leading-tight
                        ${
                          isSelected
                            ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/20 ring-2 ring-indigo-500/50 z-10"
                            : "border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                        }
                        ${isCopied ? "border-dashed border-indigo-400! dark:border-indigo-500! bg-indigo-100/40 dark:bg-indigo-950/30" : ""}
                      `}
                    >
                      {!weekData[day.key][meal.key].diet &&
                      !weekData[day.key][meal.key].quantity &&
                      !weekData[day.key][meal.key].note ? (
                        <span className="text-zinc-400 dark:text-zinc-500 text-[10px] italic">
                          Click to add
                        </span>
                      ) : (
                        <div className="space-y-0.5 overflow-hidden">
                          <div className="font-medium text-zinc-900 dark:text-zinc-100 truncate">
                            {weekData[day.key][meal.key].diet}
                          </div>
                          {weekData[day.key][meal.key].quantity && (
                            <div className="text-indigo-600 dark:text-indigo-400 text-[10px] truncate">
                              {weekData[day.key][meal.key].quantity}
                            </div>
                          )}
                          {weekData[day.key][meal.key].note && (
                            <div className="text-zinc-500 dark:text-zinc-400 text-[10px] truncate italic">
                              {weekData[day.key][meal.key].note}
                            </div>
                          )}
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cell Editor Popover */}
      {editingCell && (
        <CellEditor
          cell={weekData[editingCell.day][editingCell.meal]}
          onSave={(cell) => updateCell(editingCell.day, editingCell.meal, cell)}
          onClose={() => setEditingCell(null)}
          position={editorPos}
        />
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-4 right-4 z-50 px-3 py-2 bg-indigo-600 text-white text-xs font-medium rounded-lg shadow-lg animate-fade-in">
          {toast}
        </div>
      )}
    </div>
  );
}
