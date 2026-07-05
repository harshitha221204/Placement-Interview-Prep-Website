# 🚀 Antigravity — Placement & Interview Preparation Agent

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-6366f1?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-10b981?style=for-the-badge)
![Stack](https://img.shields.io/badge/stack-HTML%20%7C%20CSS%20%7C%20JS-06b6d4?style=for-the-badge)
![No Dependencies](https://img.shields.io/badge/dependencies-none-f59e0b?style=for-the-badge)

**A premium, AI-powered placement preparation platform to get you interview-ready at top tech companies.**

[Features](#-features) • [Getting Started](#-getting-started) • [Modules](#-modules) • [Tech Stack](#-tech-stack) • [Screenshots](#-screenshots)

</div>

---

## ✨ Features

- 📊 **Interactive Dashboard** — GitHub-style activity heatmap, streak tracker, and overall readiness scoring
- 📄 **ATS Resume Reviewer** — Smart resume parsing with keyword gap analysis and improvement suggestions
- 💻 **DSA Practice Planner** — Curated Blind 75 + SDE Sheet problems with Spaced Repetition scheduling
- 🤖 **AI Mock Interview Agent** — Voice-enabled chatbot with real-time answer evaluation and scorecards
- 🏢 **Company-Specific Prep Planner** — Targeted guides for Google, Meta, Amazon, and Microsoft
- 💾 **Persistent Progress Tracking** — All data auto-saved to localStorage across sessions

---

## 🎯 Getting Started

### Prerequisites

- Python 3.x (for local development server)
- Any modern browser (Chrome, Edge, Firefox)

### Run Locally

```bash
# 1. Clone the repository
git clone https://github.com/your-username/placement-prep-agent.git

# 2. Enter the project directory
cd placement-prep-agent

# 3. Start the local server
python -m http.server 8080

# 4. Open your browser and navigate to:
#    http://localhost:8080
```

> ⚡ No npm, no build step, no framework — just open and go.

---

## 📦 Project Structure

```
placement-prep-agent/
│
├── index.html      # App layout, SPA structure, sidebar nav, modals
├── style.css       # Dark glassmorphic design system, animations, responsive layout
├── app.js          # Core controller: routing, state, all 5 module engines
└── db.js           # Seed data: DSA problems, company profiles, interview Q&A
```

---

## 🧩 Modules

### 🏠 Dashboard
The command centre for your preparation journey.
- **GitHub-style Heatmap** — 15-week activity grid that glows with your consistency
- **Streak Counter** — Consecutive active days tracked with 🔥 animation
- **4 Live Stat Cards** — DSA progress %, Resume ATS score, Mock interviews count, Streak record
- **Overall Readiness Ring** — Composite circular gauge *(40% DSA + 30% Resume + 30% Mocks)*
- **Daily Milestones** — 3 auto-resetting daily goals to sustain your streak

---

### 📄 Resume Reviewer
Upload your resume and get an instant ATS compatibility audit.
- **Drag & Drop or Paste** — Accepts file upload (PDF/TXT/DOCX) or plain text
- **4-Dimension ATS Analysis**:
  | Dimension | Weight | What it checks |
  |-----------|--------|----------------|
  | Section Structure | 20% | Standard resume headers present |
  | Impact & Metrics | 30% | Quantified results (%, $, scale) |
  | Action Verbs | 20% | Strong professional verbs (led, architected...) |
  | Keyword Match | 30% | Role-specific tech keywords |
- **Score Radial Chart** — Animated circular score meter with color-coded grades
- **Missing Keywords Cloud** — Clickable tags with suggested sentence templates
- **Improvement Bullets** — Specific, actionable rewrite recommendations

**Supported Roles:** Software Engineer · Frontend · Backend · Fullstack

---

### 💻 DSA Practice Planner
Structured algorithmic preparation with 31 hand-picked problems.

**Problem Lists:**
| Filter | Description |
|--------|-------------|
| Blind 75 | Most asked coding patterns across top companies |
| SDE Sheet | Striver's comprehensive SDE preparation list |
| All Problems | Complete library across all topics |
| Spaced Repetition | Problems due for review based on your schedule |

**Topics covered:**
`Arrays` · `Two Pointers` · `Sliding Window` · `Linked Lists` · `Trees` · `Graphs` · `Dynamic Programming`

**Key Features:**
- ✅ **Solve Logger Modal** — Log time taken + solution notes per problem
- 🔄 **Spaced Repetition (SRS)** — 3 / 7 / 14-day review intervals with live due-count badge
- 📅 **Custom Study Timeline** — 30 / 60 / 90-day planner with daily pace tracker
- 🔍 **Search & Filter** — Instant text search + difficulty filter (Easy / Medium / Hard)
- 🔗 **LeetCode Links** — Direct links to every problem

---

### 🤖 Mock Interview Agent
A voice-powered AI interviewer that evaluates your answers in real time.

**Interview Domains:**
| Domain | Focus Areas |
|--------|-------------|
| Frontend Engineering | Virtual DOM, Event Loop, Performance, Accessibility |
| Backend Engineering | Databases, APIs, Authentication, Scalability |
| System Design | Distributed Systems, Caching, Message Queues |
| Behavioral / Cultural | STAR Method, Conflict Resolution, Leadership |

**Voice Mode:**
- 🗣️ Bot reads questions aloud via **Web Speech Synthesis API**
- 🎙️ Capture answers with **microphone via Web Speech Recognition API**
- Text-only fallback fully supported

**Evaluation Criteria:**
| Metric | Weight | How it's scored |
|--------|--------|-----------------|
| Technical Accuracy | 50% | Keyword coverage from expert answer pools |
| Structured Communication | 30% | STAR-method signals, logical connectors |
| Handling Ambiguity | 20% | Trade-off, assumption, clarification language |

**Post-session Scorecard:**
- Overall % score with letter-grade comment
- Per-question breakdown with matched & missing keywords
- Targeted feedback bullets for each answer

---

### 🏢 Company-Specific Prep Planner
Tailored preparation roadmaps for 4 major tech companies.

| Company | Rounds | Key Focus |
|---------|--------|-----------|
| **Google** | OA → Phone Screen → Onsite Loop | Graphs, Trees, DP, Googleyness |
| **Meta** | Tech Screen → Coding Onsite → System Design → Behavioral | Arrays, Hash Maps, Speed |
| **Amazon** | OA → Tech Screen → Loop (+ Bar Raiser) | LP Questions, Trees, Heaps |
| **Microsoft** | Screen → Onsite Loop | Linked Lists, OOD, Growth Mindset |

Each profile includes:
- 📋 Detailed interview round breakdown
- ✅ Core values & culture checklist
- 📊 Topic distribution weight chart
- 💡 Highly-probable practice problems

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Structure | HTML5 (Semantic, accessible) |
| Styling | Vanilla CSS3 (Custom Properties, Grid, Flexbox, Animations) |
| Logic | Vanilla JavaScript ES6+ (No frameworks) |
| Fonts | Inter + Fira Code via Google Fonts |
| Icons | Inline SVG (zero external requests) |
| Storage | Browser LocalStorage API |
| Speech | Web Speech API (SpeechSynthesis + SpeechRecognition) |
| Server | Python built-in HTTP server |

---

## 🎨 Design System

- **Theme**: Deep dark glassmorphism (`#0a0e17` base)
- **Accents**: Electric Indigo `#6366f1` · Cyan `#06b6d4` · Emerald `#10b981` · Amber `#f59e0b` · Rose `#f43f5e`
- **Typography**: Inter (UI) + Fira Code (code/mono elements)
- **Effects**: `backdrop-filter: blur()`, gradient glows, SVG progress rings, micro-animations
- **Responsive**: Full mobile/tablet adaptation via CSS Grid breakpoints

---

## 💾 Data Persistence

All data is stored in the **browser's localStorage** under the key `antigravity_prep_state`. This includes:

- ✅ Solved DSA problems (with timestamps, notes, SRS review dates)
- 📄 Resume score history
- 🤖 Mock interview session logs and scores
- 🔥 Streak data and longest streak records
- 📅 Custom study timeline settings
- 🗓️ Daily activity log (powers the heatmap)

> Data persists across browser restarts and page refreshes. Clear localStorage to reset all progress.

---

## 🗺️ Roadmap

- [ ] Add more DSA problems (100+ full set)
- [ ] Export resume feedback as PDF report
- [ ] Add more company profiles (Apple, Netflix, Uber, Flipkart)
- [ ] Interview session replay with transcript download
- [ ] Dark/Light theme toggle
- [ ] Backend integration with real AI (Gemini / GPT) for smarter answer evaluation
- [ ] User authentication and cloud sync

---

## 📄 License

This project is licensed under the **MIT License** — feel free to use, modify, and distribute.

---

## 🙏 Acknowledgements

- [Blind 75 List](https://leetcode.com/discuss/general-discussion/460599/blind-75-leetcode-questions) — Original curated problem set
- [Striver's SDE Sheet](https://takeuforward.org/interviews/strivers-sde-sheet-top-coding-interview-problems/) — Comprehensive SDE preparation resource
- [LeetCode](https://leetcode.com) — Problem hosting platform

---

<div align="center">
  <strong>Built with ❤️ to help engineers land their dream jobs.</strong><br>
  <em>Star ⭐ this repo if it helped your preparation!</em>
</div>
#   P l a c e m e n t - I n t e r v i e w - P r e p - W e b s i t e  
 