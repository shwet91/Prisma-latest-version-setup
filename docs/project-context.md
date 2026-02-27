Project: Sia Health Internal Diet Plan System
Context

Sia Health is a women’s hormonal health company (PCOS, thyroid, peri-menopause, hormonal imbalance).
Dietitians collect client data (symptoms, labs, history, goals) and create personalized meal plans.

Currently, plans are created in Google Sheets → time-consuming, repetitive, hard to review, no structured workflow.

Goal

Build an internal web tool to:

Create diet plans faster

Reduce repetitive work

Enable structured review workflow

Publish finalized plans

Export as image for WhatsApp

Workflow similar to code review systems (Draft → Review → Approve → Publish).

Core Features
1. Client Management

Create/edit client profile

Store: symptoms, labs, history, goals

Filter by condition, assigned dietitian, plan status

2. Meal Plan Builder (Spreadsheet UI)

Grid-based (rows = meals, columns = days)

Fast editing, keyboard-first

Auto-save

Copy/paste:

Single cell

Row

Column

Across different clients

Duplicate previous plan

Template support

3. Workflow System

Statuses:

Draft

Under Review

Published

Process:

Dietitian creates plan (Draft)

Submit for review

Team members add inline comments (cell-level)

After approval → Publish

4. AI Check (Optional Layer)

Before human review:

Validate nutrition balance

Flag conflicts (e.g., high GI for PCOS)

Suggest improvements

5. Version Control

Track edits

View history

Revert to previous version

6. Export

After publish:

Download as PNG or PDF

Send via WhatsApp

UX Requirements

Minimal clicks

Keyboard-friendly

Fast duplication

Auto-save

Plan creation <10 min

Roles

Dietitian (create/edit)

Reviewer (comment/approve)

Admin (manage users/clients)