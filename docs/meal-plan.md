Meal Plan Structure

Each meal plan:

7 days (Mon–Sun)

6–7 meals per day

Fixed timestamps per meal

Grid format (like spreadsheet)

Daily Meal Slots (Fixed)

Early Morning – 06:30

Breakfast – 08:00

Mid Meal – 10:30

Lunch – 12:30

Evening Snack – 15:00

Dinner – 18:30

Post Dinner – 21:00
 
Each cell contains:

diet (text)

quantity

note

timestamp (fixed, auto-filled)

UI Layout

Grid format:

Columns → Days (Mon–Sun)

Rows → Meal types (Early Morning → Post Dinner)

Total visible cells: 7 × 7 = 49

Entire week must fit in one screen (no scrolling)

Compact cell size

Clean, minimal layout

Cell Behavior (Like Google Sheets)

Each cell must support:

Click to edit

Copy

Paste

Delete

Keyboard navigation (arrow keys, enter)

Copy:

Single cell

Full row

Full column

Across different clients

Multi-cell selection (optional but ideal)

Goal: Very fast editing with minimum clicks.

Data Structure (Optimized)

Structure:

mealPlan {
  clientId
  status: draft | review | published
  week: {
    monday: { mealType: { diet, quantity, note, time } }
    tuesday: { ... }
    ...
  }
}

Timestamps are fixed per meal type (not manually entered every time).

Important UX Rules

No horizontal scroll

No vertical scroll

Full week visible at once

Auto-save on edit

Instant duplication of:

Previous week

Specific day

Specific row

Entire plan

Performance Requirement

Creating a new weekly meal plan should take < 5–7 minutes.

Primary focus:

Speed

Low friction

Zero unnecessary clicks

Spreadsheet-like experience inside a controlled workflow system