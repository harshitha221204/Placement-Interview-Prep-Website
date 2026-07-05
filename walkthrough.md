# Placement & Interview Preparation Agent - Walkthrough

## What Was Built

A premium, zero-dependency **Single-Page Application (SPA)** served over a local Python HTTP server. The app is made of 4 files and runs directly in any modern browser.

| File | Size | Purpose |
|------|------|---------|
| [index.html](file:///c:/Users/A/Downloads/project/index.html) | 34 KB | Layout, pages, modals, and navigation shell |
| [style.css](file:///c:/Users/A/Downloads/project/style.css) | 41 KB | Full dark glassmorphic design system |
| [app.js](file:///c:/Users/A/Downloads/project/app.js) | 51 KB | State, routing, all module controllers |
| [db.js](file:///c:/Users/A/Downloads/project/db.js) | 21 KB | Seed data: DSA questions, company profiles, interview templates |

---

## How to Run

The Python server is currently running. **Open your browser and visit:**

> **http://localhost:8080**

To restart the server at any time:
```powershell
cd c:\Users\A\Downloads\project
python -m http.server 8080
```

---

## Feature Breakdown

### 🏠 Dashboard
- **Activity Heatmap** — GitHub-style 15×7 day consistency grid. Cells glow with activity intensity as you solve problems, run mocks, and scan your resume.
- **Streak Counter** — Tracks consecutive active days with an animated fire badge in the sidebar.
- **4 Stat Cards** — Live counters for DSA solved %, ATS resume score, mock interviews attempted, and current/longest streak.
- **Overall Readiness Ring** — A circular gauge (40% DSA + 30% Resume + 30% Mocks) updating in real time.
- **Daily Milestones** — 3 daily goal checkboxes that auto-reset each day.

### 📄 Resume Reviewer
- **Drag & Drop / File Upload** — Accepts .pdf, .txt, and .docx files (reads as plain text).
- **ATS Scan** — Analyzes pasted/uploaded content across 4 dimensions:
  - **Section Structure** (20%): Detects standard headers like Experience, Projects, Skills.
  - **Impact & Metrics** (30%): Regex scans for % improvements, dollar amounts, scale numbers.
  - **Action Verbs** (20%): Checks for 20+ strong professional verbs (led, architected, optimized...).
  - **Keyword Match** (30%): Cross-references against role-specific tech keyword dictionaries.
- **Visual Score Radial** — An animated radial chart showing the ATS score (color changes: green / amber / rose).
- **Missing Keywords** — Click any missing keyword tag to get suggested phrasing.
- **Action Bullet Suggestions** — Targeted, contextual improvement bullets.

### 💻 DSA Practice Planner
- **31 curated problems** from Blind 75 + SDE Sheet across 7 topic categories (Arrays, Two Pointers, Sliding Window, Linked List, Trees, Graphs, Dynamic Programming).
- **Filter tabs**: Blind 75 | SDE Sheet | All | Spaced Repetition Queue.
- **Search + Difficulty filter** for instant problem lookup.
- **Solve Log Modal**: When you check a problem, log the time spent (minutes) and solution notes.
- **Spaced Repetition (SRS)**: Choose a review interval (3 / 7 / 14 days). Due problems surface in the SRS tab with a live badge count.
- **Custom Study Planner**: Choose a 30 / 60 / 90 day window and a progress bar tracks your daily pace.

### 🤖 Mock Interview Agent
- **4 interview domains**: Frontend, Backend, System Design, Behavioral.
- **Voice Mode**: Uses the browser's Web Speech API — the bot reads questions aloud and captures voice answers via microphone.
- **Text Mode**: Type answers and send them to the bot.
- **Session Timer**: Live clock tracks interview duration.
- **Dynamic Evaluation** on 3 axes:
  - **Technical Accuracy** (50% weight): Keyword coverage from expected answer pools.
  - **Structured Communication** (30%): Detects STAR-method signals, logical transitions.
  - **Handling Ambiguity** (20%): Checks for trade-off, assumption, clarification language.
- **Detailed Scorecard**: After each session, per-question breakdowns show matched keywords, missing keywords, and targeted improvement tips.

### 🏢 Company Planner
- **4 company profiles**: Google, Meta, Amazon, Microsoft.
- Each profile shows:
  - **Interview Loop Timeline** — Each round with expected format and duration.
  - **Core Values Checklist** — Company-specific cultural fit attributes.
  - **Topic Distribution** — Weighted bar chart of topic frequency in their interviews.
  - **Highlighted Practice Problems** — The most probable DSA questions for that company.
- **"Start Company Mock"** button auto-configures a behavioral interview targeting that company's values.

---

## Data Persistence

All progress is automatically saved to **browser `localStorage`**. Your solved problems, resume score history, mock interview records, streak data, and heatmap activity survive browser refresh and system restarts.

---

## Verification Results

| Check | Status |
|-------|--------|
| HTTP server returns 200 | ✅ |
| `db.js`, `app.js`, `style.css` all loaded | ✅ |
| `window.onload` initializer confirmed | ✅ |
| All 5 modules initialized | ✅ |
| LocalStorage state management active | ✅ |
| Company profiles, DSA data, Interview templates seeded | ✅ |
