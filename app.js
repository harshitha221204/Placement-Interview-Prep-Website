// Antigravity Placement Agent - Core Application Logic

// --- STATE MANAGEMENT ---
let state = {
  solvedProblems: {},       // id -> { timeSpent, notes, solvedDate, nextReview }
  resumeScoreHistory: [],   // Array of { timestamp, score, role }
  interviewStats: {
    totalInterviews: 0,
    avgScore: 0,
    history: []             // Array of { timestamp, role, score, breakdown: { technical, comm, ambiguity }, log: [] }
  },
  activityLog: {},          // YYYY-MM-DD -> count (heatmap activities)
  dailyGoals: [],           // Array of { id, name, target, completed }
  streak: {
    current: 0,
    longest: 0,
    lastActiveDate: null
  },
  customTimeline: null      // { duration, startDate, targetPerDay }
};

// Load state from LocalStorage on init
function loadState() {
  const savedState = localStorage.getItem('antigravity_prep_state');
  if (savedState) {
    try {
      const parsed = JSON.parse(savedState);
      state = { ...state, ...parsed };
    } catch (e) {
      console.error("Error parsing saved state: ", e);
    }
  }
  updateStreak();
}

// Save state to LocalStorage
function saveState() {
  localStorage.setItem('antigravity_prep_state', JSON.stringify(state));
  updateDashboardMetrics();
}

// Log activity (e.g. solving a problem, doing a mock, scanning a resume)
function logActivity(increment = 1) {
  const today = getTodayDateString();
  state.activityLog[today] = (state.activityLog[today] || 0) + increment;
  
  // Track active streak
  const streak = state.streak;
  if (streak.lastActiveDate !== today) {
    if (streak.lastActiveDate === getYesterdayDateString()) {
      streak.current += 1;
    } else if (streak.lastActiveDate !== today) {
      streak.current = 1;
    }
    streak.lastActiveDate = today;
    if (streak.current > streak.longest) {
      streak.longest = streak.current;
    }
  }
  saveState();
}

// Helper date functions
function getTodayDateString() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function getYesterdayDateString() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// Check/Update streaks on startup
function updateStreak() {
  const today = getTodayDateString();
  const yesterday = getYesterdayDateString();
  const streak = state.streak;

  if (streak.lastActiveDate) {
    if (streak.lastActiveDate !== today && streak.lastActiveDate !== yesterday) {
      streak.current = 0; // Streak broken
    }
  } else {
    streak.current = 0;
  }
}


// --- ROUTING / TAB SYSTEM ---
function initRouting() {
  const navLinks = document.querySelectorAll('.nav-link');
  const tabPanes = document.querySelectorAll('.tab-pane');
  const pageTitle = document.getElementById('page-title');
  const pageSubtitle = document.getElementById('page-subtitle');

  const routeMap = {
    dashboard: { title: "Dashboard", subtitle: "Track your daily progress and active preparation goals." },
    resume: { title: "Resume Reviewer", subtitle: "Analyze your resume against ATS tracking standards." },
    dsa: { title: "DSA Practice Planner", subtitle: "Master algorithmic problem patterns with structured study lists." },
    mock: { title: "Mock Interview Agent", subtitle: "Practice mock loops using real-time vocal or text coaching." },
    company: { title: "Company prep profiles", subtitle: "Analyze hiring bars and structured practice loops of tech giants." }
  };

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const tabId = link.getAttribute('data-tab');
      
      // Update links active states
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      
      // Toggle panes
      tabPanes.forEach(pane => pane.classList.remove('active'));
      document.getElementById(`tab-${tabId}`).classList.add('active');
      
      // Update page headers
      if (routeMap[tabId]) {
        pageTitle.textContent = routeMap[tabId].title;
        pageSubtitle.textContent = routeMap[tabId].subtitle;
      }

      // Special tab trigger loading
      if (tabId === 'dashboard') {
        renderHeatmap();
        renderGoals();
      } else if (tabId === 'dsa') {
        renderDSAProblems();
        updateTimelineView();
      } else if (tabId === 'company') {
        renderCompanyGrid();
      }
    });
  });
}


// --- DASHBOARD MODULE ---
function updateDashboardMetrics() {
  // 1. DSA count
  const solvedCount = Object.keys(state.solvedProblems).length;
  const totalDSA = window.DSA_PROBLEMS.length;
  document.getElementById('stats-dsa-count').textContent = `${solvedCount} / ${totalDSA}`;
  const dsaPercent = totalDSA > 0 ? Math.round((solvedCount / totalDSA) * 100) : 0;
  document.getElementById('stats-dsa-bar').style.width = `${dsaPercent}%`;
  document.getElementById('stats-dsa-percent').textContent = `${dsaPercent}% Completed`;

  // 2. Resume score
  const history = state.resumeScoreHistory;
  if (history.length > 0) {
    const latestScore = history[history.length - 1].score;
    document.getElementById('stats-resume-score').textContent = latestScore;
    document.getElementById('stats-resume-bar').style.width = `${latestScore}%`;
    document.getElementById('stats-resume-grade').textContent = `ATS Grade: ${getResumeGradeLabel(latestScore)}`;
  } else {
    document.getElementById('stats-resume-score').textContent = "--";
    document.getElementById('stats-resume-bar').style.width = `0%`;
    document.getElementById('stats-resume-grade').textContent = "Analyze resume to evaluate";
  }

  // 3. Mocks
  const mocks = state.interviewStats;
  document.getElementById('stats-mock-count').textContent = mocks.totalInterviews;
  document.getElementById('stats-mock-bar').style.width = `${mocks.avgScore}%`;
  document.getElementById('stats-mock-score').textContent = mocks.totalInterviews > 0 ? `Avg Score: ${Math.round(mocks.avgScore)}%` : "Avg Score: --";

  // 4. Streaks
  const streak = state.streak;
  document.getElementById('stats-streak-count').textContent = `${streak.current} ${streak.current === 1 ? 'Day' : 'Days'}`;
  document.getElementById('sidebar-streak-count').textContent = `${streak.current} ${streak.current === 1 ? 'Day' : 'Days'}`;
  const streakCap = Math.max(streak.longest, 30);
  const streakFillPercent = streakCap > 0 ? (streak.current / streakCap) * 100 : 0;
  document.getElementById('stats-streak-bar').style.width = `${streakFillPercent}%`;
  document.getElementById('stats-streak-longest').textContent = `Longest Streak: ${streak.longest} ${streak.longest === 1 ? 'Day' : 'Days'}`;

  // 5. Overall readiness scoring
  // Formula: 40% DSA solved, 30% Resume Score, 30% Avg Mock score
  let resumeFactor = history.length > 0 ? history[history.length - 1].score : 0;
  let mockFactor = mocks.totalInterviews > 0 ? mocks.avgScore : 0;
  let overall = Math.round((dsaPercent * 0.4) + (resumeFactor * 0.3) + (mockFactor * 0.3));
  
  document.getElementById('overall-readiness-ring').style.strokeDashoffset = 138 - (138 * (overall / 100)); // 2*pi*r = 2*3.14*22 = 138.16
  document.getElementById('overall-readiness-text').textContent = `${overall}%`;

  let readinessLabel = "Getting started";
  if (overall > 80) readinessLabel = "Ready for interviews";
  else if (overall > 50) readinessLabel = "Highly competitive";
  else if (overall > 20) readinessLabel = "Steady progress";
  document.getElementById('overall-readiness-desc').textContent = readinessLabel;
}

function getResumeGradeLabel(score) {
  if (score >= 85) return "Strong Profile";
  if (score >= 70) return "Competitive";
  if (score >= 50) return "Minor Improvements";
  return "Critical Improvements Needed";
}

// Generate the 15-week activity heatmap
function renderHeatmap() {
  const grid = document.getElementById('heatmap-grid-element');
  grid.innerHTML = '';

  const cellsTotal = 15 * 7; // 15 columns of 7 days
  const today = new Date();
  
  // Backtrack days to align such that today is the bottom-most cell of the last column
  const startDate = new Date();
  startDate.setDate(today.getDate() - cellsTotal + 1);

  for (let i = 0; i < cellsTotal; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);

    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
    const activityCount = state.activityLog[dateStr] || 0;

    let levelClass = 'level-0';
    if (activityCount >= 5) levelClass = 'level-3';
    else if (activityCount >= 3) levelClass = 'level-2';
    else if (activityCount >= 1) levelClass = 'level-1';

    const cell = document.createElement('div');
    cell.className = `heatmap-cell ${levelClass}`;
    
    const formattedDate = currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    cell.setAttribute('data-tooltip', `${activityCount} activity units on ${formattedDate}`);
    grid.appendChild(cell);
  }
}

// Goals system
function initGoals() {
  const today = getTodayDateString();
  const savedGoalDate = localStorage.getItem('antigravity_goal_date');

  // Initialize new goals daily
  if (savedGoalDate !== today) {
    state.dailyGoals = [
      { id: 'g_dsa', name: 'Solve a DSA Problem', target: 'Complete any topic problem', completed: false },
      { id: 'g_mock', name: 'Practice Mock Interview', target: 'Attempt 1 coding/behavioral loop', completed: false },
      { id: 'g_resume', name: 'Run ATS Resume Audit', target: 'Obtain score review', completed: false }
    ];
    localStorage.setItem('antigravity_goal_date', today);
    saveState();
  }
}

function renderGoals() {
  const container = document.getElementById('goals-checklist-element');
  container.innerHTML = '';

  state.dailyGoals.forEach((goal) => {
    const item = document.createElement('div');
    item.className = `goal-item ${goal.completed ? 'completed' : ''}`;
    
    item.innerHTML = `
      <div class="goal-checkbox" onclick="toggleGoal('${goal.id}')">
        <div class="goal-checkbox-inner"></div>
      </div>
      <div class="goal-info">
        <span class="goal-name">${goal.name}</span>
        <span class="goal-target">${goal.target}</span>
      </div>
    `;
    container.appendChild(item);
  });
}

window.toggleGoal = function(goalId) {
  const goal = state.dailyGoals.find(g => g.id === goalId);
  if (goal) {
    goal.completed = !goal.completed;
    saveState();
    renderGoals();
  }
};


// --- RESUME REVIEWER MODULE ---
function initResumeModule() {
  const dropZone = document.getElementById('resume-drop-zone');
  const fileInput = document.getElementById('resume-file-input');
  const analyzeBtn = document.getElementById('btn-analyze-resume');
  const textArea = document.getElementById('resume-text-area');
  const resultsCard = document.getElementById('resume-result-card');
  const placeholder = document.getElementById('resume-results-placeholder');
  const resultsContainer = document.getElementById('resume-results-active-container');

  // Drag and drop events
  dropZone.addEventListener('click', () => fileInput.click());
  
  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('dragover');
  });
  
  dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('dragover');
  });

  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleResumeFile(files[0]);
    }
  });

  fileInput.addEventListener('change', () => {
    if (fileInput.files.length > 0) {
      handleResumeFile(fileInput.files[0]);
    }
  });

  function handleResumeFile(file) {
    dropZone.querySelector('.upload-text').textContent = `Selected: ${file.name}`;
    dropZone.querySelector('.upload-subtext').textContent = `${(file.size / 1024).toFixed(1)} KB`;
    
    // Read local file contents as mock parser text
    const reader = new FileReader();
    reader.onload = function(e) {
      textArea.value = e.target.result || `MOCK PARSED CONTENT OF: ${file.name}\n\nSoftware Engineer experienced with algorithms and software development. Optimized systems to decrease database query load. Led teams to build React microservices.`;
    };
    reader.readAsText(file);
  }

  analyzeBtn.addEventListener('click', () => {
    const text = textArea.value.trim();
    if (!text) {
      alert("Please paste resume text or upload a file first.");
      return;
    }
    
    const targetRole = document.getElementById('resume-target-role').value;
    runATSAnalysis(text, targetRole);
  });
}

function runATSAnalysis(text, role) {
  const keywords = window.ATS_KEYWORDS;
  const roleKeywords = keywords.roles[role] || [];
  const textLower = text.toLowerCase();

  // 1. Structural Checklist Score (Max 100)
  let sectionsFound = 0;
  keywords.sections.forEach(sec => {
    if (textLower.includes(sec)) sectionsFound++;
  });
  const sectionsScore = Math.min(Math.round((sectionsFound / 5) * 100), 100);

  // 2. Impact metrics & quantifiability (look for numbers, percentages, etc.)
  // We search for numbers followed by %, K, M, B, or dollar values, or just digits in context
  const metricRegex = /(\b\d+%\b|\$\b\d+|\b\d+\s*(?:percent|million|billion|users|customers|seconds|ms|hours|days|weeks|months|years|x|percent)\b)/gi;
  const matches = textLower.match(metricRegex);
  const impactCount = matches ? matches.length : 0;
  const impactScore = Math.min(impactCount * 25, 100); // 4+ instances for max score

  // 3. Action verbs score
  let verbsCount = 0;
  keywords.verbs.forEach(verb => {
    // Word boundary check
    const r = new RegExp(`\\b${verb}(?:ed|ing|s)?\\b`, 'i');
    if (r.test(textLower)) verbsCount++;
  });
  const verbsScore = Math.min(verbsCount * 20, 100); // 5+ verbs for max score

  // 4. Keyword relevance match
  let matchedKeywords = [];
  let missingKeywords = [];
  roleKeywords.forEach(kw => {
    if (textLower.includes(kw.toLowerCase())) {
      matchedKeywords.push(kw);
    } else {
      missingKeywords.push(kw);
    }
  });
  const keywordsScore = roleKeywords.length > 0 ? Math.round((matchedKeywords.length / roleKeywords.length) * 100) : 0;

  // Compute total average score
  const totalATSScore = Math.round((sectionsScore * 0.2) + (impactScore * 0.3) + (verbsScore * 0.2) + (keywordsScore * 0.3));

  // Render scores
  document.getElementById('resume-result-card').classList.remove('disabled');
  document.getElementById('resume-results-placeholder').classList.add('hidden');
  document.getElementById('resume-results-active-container').classList.remove('hidden');

  // Animated radial score
  const fill = document.getElementById('resume-score-radial-fill');
  fill.style.strokeDashoffset = 201 - (201 * (totalATSScore / 100)); // 2*pi*32 = 200.96
  document.getElementById('resume-score-value').textContent = totalATSScore;

  // Style colors according to score tier
  if (totalATSScore >= 80) fill.setAttribute('stroke', '#10b981'); // Emerald
  else if (totalATSScore >= 50) fill.setAttribute('stroke', '#f59e0b'); // Amber
  else fill.setAttribute('stroke', '#f43f5e'); // Rose

  document.getElementById('resume-score-grade').textContent = getResumeGradeLabel(totalATSScore);
  
  let desc = `Your resume has an ATS match rating of ${totalATSScore}%. `;
  if (totalATSScore >= 85) desc += "Excellent alignment with target profile. Ready for distribution!";
  else if (totalATSScore >= 70) desc += "Good draft, but adding missing key technologies will increase recruiters callback rates.";
  else desc += "Needs restructuring. Highlight technical accomplishments using precise action verbs and quantifiable results.";
  document.getElementById('resume-score-desc').textContent = desc;

  // Progress bars
  document.getElementById('metric-score-sections').textContent = `${sectionsScore}/100`;
  document.getElementById('metric-fill-sections').style.width = `${sectionsScore}%`;

  document.getElementById('metric-score-impact').textContent = `${impactScore}/100`;
  document.getElementById('metric-fill-impact').style.width = `${impactScore}%`;

  document.getElementById('metric-score-verbs').textContent = `${verbsScore}/100`;
  document.getElementById('metric-fill-verbs').style.width = `${verbsScore}%`;

  document.getElementById('metric-score-keywords').textContent = `${keywordsScore}/100`;
  document.getElementById('metric-fill-keywords').style.width = `${keywordsScore}%`;

  // Missing tags cloud
  const missingContainer = document.getElementById('resume-missing-keywords-container');
  missingContainer.innerHTML = '';
  if (missingKeywords.length > 0) {
    missingKeywords.forEach(kw => {
      const chip = document.createElement('span');
      chip.className = 'tag-chip';
      chip.textContent = `+ ${kw}`;
      chip.title = `Click to add suggestions for "${kw}"`;
      chip.onclick = () => alert(`Suggested phrasing: "Utilized ${kw} to design, implement, and test highly scalable interfaces."`);
      missingContainer.appendChild(chip);
    });
  } else {
    missingContainer.innerHTML = '<span class="text-success text-xs">All key target tags found! Excellent keyword density.</span>';
  }

  // Suggestion bullets
  const suggContainer = document.getElementById('resume-suggestions-container');
  suggContainer.innerHTML = '';
  
  const suggestions = [];
  if (sectionsScore < 80) suggestions.push("Ensure standard headers like 'Experience', 'Projects', and 'Skills' are explicitly typed. Do not style headers as images.");
  if (impactScore < 60) suggestions.push("Quantify impact. Revise bullets to show scale: e.g., 'Optimized response parsing speeds by 30% using Redis query caching, reducing load on DB by 40%.'");
  if (verbsScore < 60) suggestions.push("Avoid weak verbs like 'Responsible for' or 'Worked on'. Use powerful starters: 'Architected', 'Spearheaded', 'Optimized', or 'Automated'.");
  if (missingKeywords.length > 2) suggestions.push(`Integrate missing tools like [${missingKeywords.slice(0, 3).join(', ')}] in your projects summaries.`);
  if (suggestions.length === 0) suggestions.push("Your resume is highly optimized! Conduct mock interviews to build communication alignment.");

  suggestions.forEach(s => {
    const li = document.createElement('li');
    li.textContent = s;
    suggContainer.appendChild(li);
  });

  // Log activity & complete goal
  state.resumeScoreHistory.push({ timestamp: Date.now(), score: totalATSScore, role });
  logActivity(2);

  // Complete milestone goal
  const goal = state.dailyGoals.find(g => g.id === 'g_resume');
  if (goal && !goal.completed) {
    goal.completed = true;
    renderGoals();
  }
}


// --- DSA PRACTICE PLANNER MODULE ---
let currentDsaFilter = 'blind75'; // blind75, sdesheet, all, srs

function initDSAModule() {
  document.getElementById('btn-dsa-blind75').onclick = () => switchDSAFilter('blind75');
  document.getElementById('btn-dsa-sdesheet').onclick = () => switchDSAFilter('sdesheet');
  document.getElementById('btn-dsa-all').onclick = () => switchDSAFilter('all');
  document.getElementById('btn-dsa-srs').onclick = () => switchDSAFilter('srs');

  document.getElementById('dsa-search-input').oninput = renderDSAProblems;
  document.getElementById('dsa-difficulty-filter').onchange = renderDSAProblems;

  // Custom study timeline builder
  document.getElementById('btn-generate-schedule').onclick = generateDSASchedule;
  
  // Modal controllers
  document.getElementById('btn-close-dsa-modal').onclick = closeDsaModal;
  document.getElementById('btn-cancel-dsa-modal').onclick = closeDsaModal;
  document.getElementById('btn-submit-dsa-modal').onclick = submitDsaProgress;
}

function switchDSAFilter(filterName) {
  currentDsaFilter = filterName;
  document.querySelectorAll('.tab-pill').forEach(btn => {
    btn.classList.remove('active');
  });
  document.getElementById(`btn-dsa-${filterName}`).classList.add('active');
  renderDSAProblems();
}

function renderDSAProblems() {
  const container = document.getElementById('dsa-accordion-container');
  container.innerHTML = '';

  const query = document.getElementById('dsa-search-input').value.toLowerCase().trim();
  const difficulty = document.getElementById('dsa-difficulty-filter').value;

  // Filter list
  let problems = window.DSA_PROBLEMS;
  const now = Date.now();

  if (currentDsaFilter === 'blind75') {
    problems = problems.filter(p => p.categories.includes("Blind 75"));
  } else if (currentDsaFilter === 'sdesheet') {
    problems = problems.filter(p => p.categories.includes("SDE Sheet"));
  } else if (currentDsaFilter === 'srs') {
    // Show only solved questions that are due for spaced repetition review
    problems = problems.filter(p => {
      const log = state.solvedProblems[p.id];
      return log && log.nextReview && log.nextReview <= now;
    });
  }

  // Text search
  if (query) {
    problems = problems.filter(p => p.title.toLowerCase().includes(query) || p.description.toLowerCase().includes(query) || p.topic.toLowerCase().includes(query));
  }

  // Difficulty filter
  if (difficulty !== 'all') {
    problems = problems.filter(p => p.difficulty === difficulty);
  }

  // Update SRS badge count
  const srsDueProblems = window.DSA_PROBLEMS.filter(p => {
    const log = state.solvedProblems[p.id];
    return log && log.nextReview && log.nextReview <= now;
  });
  const srsBadge = document.getElementById('srs-due-badge');
  if (srsDueProblems.length > 0) {
    srsBadge.textContent = srsDueProblems.length;
    srsBadge.classList.remove('hidden');
  } else {
    srsBadge.classList.add('hidden');
  }

  if (problems.length === 0) {
    container.innerHTML = `
      <div class="text-center p-relative" style="padding: 3rem 1rem;">
        <p class="text-muted">No DSA problems found matching the filters.</p>
      </div>
    `;
    return;
  }

  // Group problems by topic
  const grouped = {};
  problems.forEach(prob => {
    if (!grouped[prob.topic]) grouped[prob.topic] = [];
    grouped[prob.topic].push(prob);
  });

  // Render grouped accordions
  Object.keys(grouped).forEach(topic => {
    const topicProblems = grouped[topic];
    const card = document.createElement('div');
    card.className = 'topic-card';

    // Topic stats
    const totalCount = topicProblems.length;
    const solvedCount = topicProblems.filter(p => !!state.solvedProblems[p.id]).length;
    const solvedPercent = Math.round((solvedCount / totalCount) * 100);

    const easyCount = topicProblems.filter(p => p.difficulty === 'Easy').length;
    const medCount = topicProblems.filter(p => p.difficulty === 'Medium').length;
    const hardCount = topicProblems.filter(p => p.difficulty === 'Hard').length;

    card.innerHTML = `
      <div class="topic-header" onclick="toggleTopicAccordion(this)">
        <div class="topic-header-left">
          <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2.5" fill="none" class="topic-chevron"><polyline points="9 18 15 12 9 6"></polyline></svg>
          <span class="topic-title">${topic}</span>
        </div>
        <div class="topic-meta">
          <div class="topic-pills">
            ${easyCount > 0 ? `<span class="difficulty-pill diff-easy">${easyCount} E</span>` : ''}
            ${medCount > 0 ? `<span class="difficulty-pill diff-medium">${medCount} M</span>` : ''}
            ${hardCount > 0 ? `<span class="difficulty-pill diff-hard">${hardCount} H</span>` : ''}
          </div>
          <span class="topic-count">${solvedCount}/${totalCount} (${solvedPercent}%)</span>
        </div>
      </div>
      <div class="topic-body">
        <div class="problem-list">
          <!-- Rows will be injected here -->
        </div>
      </div>
    `;

    const listContainer = card.querySelector('.problem-list');
    topicProblems.forEach(p => {
      const isSolved = !!state.solvedProblems[p.id];
      const pRowWrapper = document.createElement('div');
      pRowWrapper.className = 'problem-wrapper';

      const diffClass = p.difficulty === 'Easy' ? 'diff-easy' : p.difficulty === 'Medium' ? 'diff-medium' : 'diff-hard';

      pRowWrapper.innerHTML = `
        <div class="problem-row ${isSolved ? 'solved' : ''}" id="problem-row-${p.id}">
          <div class="problem-left">
            <div class="problem-checkbox" onclick="toggleProblemCompletion(${p.id}, event)"></div>
            <a href="${p.leetcodeUrl}" target="_blank" class="problem-title">${p.title}</a>
          </div>
          <div class="problem-right">
            <span class="difficulty-pill ${diffClass}">${p.difficulty}</span>
            <button class="btn-leetcode-link" onclick="toggleProblemDetails(${p.id}, event)" title="View Description">
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
            </button>
          </div>
        </div>
        <div class="problem-row-details hidden" id="problem-details-${p.id}">
          <p class="problem-row-desc">${p.description}</p>
          <div class="problem-row-meta" id="problem-meta-container-${p.id}">
            <!-- Filled via JS if solved -->
          </div>
        </div>
      `;
      
      listContainer.appendChild(pRowWrapper);
      
      // If solved, render saved metadata inside details drawer
      if (isSolved) {
        updateProblemRowMeta(p.id);
      }
    });

    container.appendChild(card);
  });
}

window.toggleTopicAccordion = function(headerElement) {
  const card = headerElement.parentElement;
  card.classList.toggle('open');
};

window.toggleProblemDetails = function(problemId, event) {
  if (event) event.stopPropagation();
  const drawer = document.getElementById(`problem-details-${problemId}`);
  drawer.classList.toggle('hidden');
};

window.toggleProblemCompletion = function(problemId, event) {
  if (event) event.stopPropagation();
  
  const isSolved = !!state.solvedProblems[problemId];
  if (isSolved) {
    // Unmark solved
    delete state.solvedProblems[problemId];
    saveState();
    renderDSAProblems();
  } else {
    // Open modal to log completion metrics
    openDsaModal(problemId);
  }
};

function openDsaModal(problemId) {
  const prob = window.DSA_PROBLEMS.find(p => p.id === problemId);
  if (!prob) return;

  document.getElementById('dsa-modal-problem-id').value = problemId;
  document.getElementById('dsa-modal-time').value = "30";
  document.getElementById('dsa-modal-notes').value = "";
  document.getElementById('dsa-modal-title').textContent = `Log Solve: ${prob.title}`;
  
  // Set default interval active
  document.querySelectorAll('input[name="srs-interval"]').forEach(rad => {
    rad.checked = rad.value === "3";
  });
  document.querySelectorAll('.interval-card').forEach(card => {
    card.classList.remove('active');
  });
  document.querySelector('.interval-card:first-child').classList.add('active');

  // Trigger modal display
  document.getElementById('dsa-log-modal').classList.remove('hidden');
}

function closeDsaModal() {
  document.getElementById('dsa-log-modal').classList.add('hidden');
}

// Modal interval card clicks selector
document.querySelectorAll('.interval-card').forEach(card => {
  card.addEventListener('click', () => {
    document.querySelectorAll('.interval-card').forEach(c => c.classList.remove('active'));
    card.classList.add('active');
    card.querySelector('input[type="radio"]').checked = true;
  });
});

function submitDsaProgress() {
  const pId = parseInt(document.getElementById('dsa-modal-problem-id').value);
  const time = parseInt(document.getElementById('dsa-modal-time').value) || 30;
  const notes = document.getElementById('dsa-modal-notes').value.trim();
  const srsDays = parseInt(document.querySelector('input[name="srs-interval"]:checked').value);

  const nextReviewTimestamp = Date.now() + (srsDays * 24 * 60 * 60 * 1000);

  state.solvedProblems[pId] = {
    timeSpent: time,
    notes: notes,
    solvedDate: Date.now(),
    nextReview: nextReviewTimestamp
  };

  logActivity(1);
  closeDsaModal();
  renderDSAProblems();
  
  // Update timeline if generated
  updateTimelineProgress();

  // Complete milestone goal
  const goal = state.dailyGoals.find(g => g.id === 'g_dsa');
  if (goal && !goal.completed) {
    goal.completed = true;
    renderGoals();
  }
}

function updateProblemRowMeta(problemId) {
  const log = state.solvedProblems[problemId];
  if (!log) return;

  const container = document.getElementById(`problem-meta-container-${problemId}`);
  if (!container) return;

  const dateStr = new Date(log.solvedDate).toLocaleDateString();
  const nextDateStr = new Date(log.nextReview).toLocaleDateString();

  container.innerHTML = `
    <span>⏱️ ${log.timeSpent} mins</span>
    <span>📅 Logged: ${dateStr}</span>
    <span>🔄 SRS Review Due: ${nextDateStr}</span>
    ${log.notes ? `<div style="margin-top: 0.4rem; padding: 0.4rem; background: rgba(255,255,255,0.03); border-radius: 4px; font-family: var(--font-mono);">${log.notes}</div>` : ''}
  `;
}

// Spaced Repetition custom timeline build planner
function generateDSASchedule() {
  const duration = parseInt(document.getElementById('timeline-duration').value);
  const totalProblems = window.DSA_PROBLEMS.length;
  const targetPerDay = parseFloat((totalProblems / duration).toFixed(2));

  state.customTimeline = {
    duration: duration,
    startDate: Date.now(),
    targetPerDay: targetPerDay
  };

  saveState();
  updateTimelineView();
}

function updateTimelineView() {
  const output = document.getElementById('timeline-progress-output');
  if (!state.customTimeline) {
    output.classList.add('hidden');
    return;
  }

  output.classList.remove('hidden');
  updateTimelineProgress();
}

function updateTimelineProgress() {
  if (!state.customTimeline) return;

  const timeline = state.customTimeline;
  const daysElapsed = Math.max(1, Math.ceil((Date.now() - timeline.startDate) / (24 * 60 * 60 * 1000)));
  const currentDay = Math.min(daysElapsed, timeline.duration);

  const solvedCount = Object.keys(state.solvedProblems).length;
  const targetProblems = Math.ceil(currentDay * timeline.targetPerDay);
  const percent = Math.min(Math.round((solvedCount / targetProblems) * 100), 100);

  document.getElementById('timeline-day-tracker-label').textContent = `Day ${currentDay} of ${timeline.duration} Planner`;
  document.getElementById('timeline-day-target-label').textContent = `Target: ${targetProblems} Solved (Current: ${solvedCount} | Target Speed: ${timeline.targetPerDay}/day)`;
  document.getElementById('timeline-progress-bar-fill').style.width = `${percent}%`;
}


// --- MOCK INTERVIEW AGENT MODULE ---
let recognition = null;
let currentQuestionIndex = 0;
let activeInterviewSession = null; // { role, questions: [], answers: [], startTime, timerInterval }
let speechSynth = window.speechSynthesis;
let speechVoice = null;

// Select speaking voice once Web Speech API registers voices
if (speechSynth) {
  speechSynth.onvoiceschanged = () => {
    const voices = speechSynth.getVoices();
    // Prefer standard English neural or high quality voices
    speechVoice = voices.find(v => v.lang.includes('US') && v.name.includes('Google')) ||
                  voices.find(v => v.lang.includes('EN') || v.lang.includes('US')) ||
                  voices[0];
  };
}

// Init Voice Input Capture
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (SpeechRecognition) {
  recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = 'en-US';
}

function initMockModule() {
  const startBtn = document.getElementById('btn-start-interview');
  const sendBtn = document.getElementById('btn-send-message');
  const micBtn = document.getElementById('btn-mic-input');
  const termBtn = document.getElementById('btn-terminate-interview');
  const closeFeedbackBtn = document.getElementById('btn-close-feedback');
  const textInput = document.getElementById('chat-text-input');

  startBtn.onclick = startInterviewSession;
  sendBtn.onclick = handleUserChatMessage;
  termBtn.onclick = terminateSessionEarly;
  closeFeedbackBtn.onclick = closeFeedbackView;

  textInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleUserChatMessage();
  });

  if (recognition) {
    micBtn.onclick = toggleVoiceRecording;
    
    recognition.onstart = () => {
      document.getElementById('voice-transcription-status').classList.remove('hidden');
      micBtn.classList.add('recording');
    };

    recognition.onend = () => {
      document.getElementById('voice-transcription-status').classList.add('hidden');
      micBtn.classList.remove('recording');
    };

    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      textInput.value = transcript;
    };
  } else {
    micBtn.style.display = 'none'; // Speech recognition not supported
  }
}

function speakQuestion(text) {
  const isVoiceOn = document.getElementById('mock-toggle-voice').checked;
  if (!isVoiceOn || !speechSynth) return;

  speechSynth.cancel(); // Stop any pending vocalization
  const utterance = new SpeechSynthesisUtterance(text);
  if (speechVoice) utterance.voice = speechVoice;
  utterance.rate = 0.95;
  speechSynth.speak(utterance);
}

function toggleVoiceRecording() {
  if (!recognition) return;
  
  if (document.getElementById('btn-mic-input').classList.contains('recording')) {
    recognition.stop();
  } else {
    recognition.start();
  }
}

function startInterviewSession() {
  const role = document.getElementById('mock-role-select').value;
  const difficulty = document.getElementById('mock-difficulty-select').value;
  
  // Pull template questions
  const templates = window.INTERVIEW_TEMPLATES[role] || [];
  if (templates.length === 0) {
    alert("Templates for this target loop are empty.");
    return;
  }

  // Shuffle and pick 3 questions
  const selectedQuestions = [...templates].sort(() => 0.5 - Math.random()).slice(0, 3);
  
  // Create session object
  activeInterviewSession = {
    role: role,
    difficulty: difficulty,
    questions: selectedQuestions,
    answers: [],
    startTime: Date.now(),
    timerInterval: null
  };

  currentQuestionIndex = 0;

  // Toggle layout sections
  document.getElementById('mock-setup-panel').classList.add('hidden');
  document.getElementById('mock-chat-panel').classList.remove('hidden');
  document.getElementById('chat-messages-stream').innerHTML = '';
  document.getElementById('chat-session-status').textContent = `Interview ongoing (${difficulty} level)`;

  // Start timer
  startSessionTimer();

  // Ask first question
  triggerBotIntroduction();
}

function startSessionTimer() {
  const timerDisplay = document.getElementById('session-timer-display');
  let seconds = 0;

  activeInterviewSession.timerInterval = setInterval(() => {
    seconds++;
    const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    timerDisplay.textContent = `${mins}:${secs}`;
  }, 1000);
}

function stopSessionTimer() {
  if (activeInterviewSession && activeInterviewSession.timerInterval) {
    clearInterval(activeInterviewSession.timerInterval);
  }
}

function triggerBotIntroduction() {
  const introMsg = `Hello! Welcome to your Antigravity mock interview loop. I will evaluate your skills for the ${activeInterviewSession.role.replace('_', ' ')} domain. Let's begin with the first problem:`;
  appendChatBubble("bot", introMsg);
  speakQuestion(introMsg);

  setTimeout(() => {
    const q = activeInterviewSession.questions[0];
    appendChatBubble("bot", q.question);
    speakQuestion(q.question);
  }, 2500);
}

function appendChatBubble(sender, text) {
  const stream = document.getElementById('chat-messages-stream');
  
  // Remove temporary typing indicators if present
  const loading = stream.querySelector('.typing-indicator');
  if (loading) loading.remove();

  const bubble = document.createElement('div');
  bubble.className = `chat-bubble ${sender}`;
  bubble.textContent = text;
  
  stream.appendChild(bubble);
  stream.scrollTop = stream.scrollHeight;
}

function appendTypingIndicator() {
  const stream = document.getElementById('chat-messages-stream');
  const indicator = document.createElement('div');
  indicator.className = 'chat-bubble bot typing-indicator';
  indicator.innerHTML = `
    <div class="typing-dot"></div>
    <div class="typing-dot"></div>
    <div class="typing-dot"></div>
  `;
  stream.appendChild(indicator);
  stream.scrollTop = stream.scrollHeight;
}

function handleUserChatMessage() {
  const input = document.getElementById('chat-text-input');
  const answerText = input.value.trim();
  if (!answerText) return;

  // Clear input
  input.value = '';

  // Append user bubble
  appendChatBubble("user", answerText);
  
  // Stop speaking if speaking
  if (speechSynth) speechSynth.cancel();

  // Save answer
  activeInterviewSession.answers.push({
    questionId: activeInterviewSession.questions[currentQuestionIndex].id,
    questionText: activeInterviewSession.questions[currentQuestionIndex].question,
    userAnswer: answerText,
    expectedKeywords: activeInterviewSession.questions[currentQuestionIndex].expectedKeywords,
    eval: null
  });

  currentQuestionIndex++;

  // Flow control
  if (currentQuestionIndex < activeInterviewSession.questions.length) {
    // Show bot typing
    appendTypingIndicator();
    
    setTimeout(() => {
      const q = activeInterviewSession.questions[currentQuestionIndex];
      appendChatBubble("bot", q.question);
      speakQuestion(q.question);
    }, 1500);
  } else {
    // Interview completed
    appendTypingIndicator();
    setTimeout(completeInterviewSession, 2000);
  }
}

function terminateSessionEarly() {
  if (confirm("Are you sure you want to end this interview early? Progress will not be saved.")) {
    stopSessionTimer();
    document.getElementById('mock-chat-panel').classList.add('hidden');
    document.getElementById('mock-setup-panel').classList.remove('hidden');
    activeInterviewSession = null;
    if (speechSynth) speechSynth.cancel();
  }
}

function completeInterviewSession() {
  stopSessionTimer();
  if (speechSynth) speechSynth.cancel();

  const session = activeInterviewSession;
  activeInterviewSession = null;

  // 1. Evaluate responses dynamically
  let technicalSum = 0;
  let commSum = 0;
  let ambiguitySum = 0;

  session.answers.forEach(ans => {
    const qEval = evaluateAnswerMetric(ans.userAnswer, ans.expectedKeywords);
    ans.eval = qEval;
    
    technicalSum += qEval.technical;
    commSum += qEval.comm;
    ambiguitySum += qEval.ambiguity;
  });

  const numQuestions = session.answers.length;
  const finalTechnical = Math.round(technicalSum / numQuestions);
  const finalComm = Math.round(commSum / numQuestions);
  const finalAmbiguity = Math.round(ambiguitySum / numQuestions);
  const overallScore = Math.round((finalTechnical * 0.5) + (finalComm * 0.3) + (finalAmbiguity * 0.2));

  // Update states
  state.interviewStats.totalInterviews++;
  // Calculate rolling average
  const total = state.interviewStats.totalInterviews;
  state.interviewStats.avgScore = Math.round(((state.interviewStats.avgScore * (total - 1)) + overallScore) / total);
  
  // Push session to history
  state.interviewStats.history.push({
    timestamp: Date.now(),
    role: session.role,
    score: overallScore,
    breakdown: { technical: finalTechnical, comm: finalComm, ambiguity: finalAmbiguity },
    answers: session.answers
  });

  logActivity(4); // Multi-activity units for mock loop completion

  // Complete milestone goal
  const goal = state.dailyGoals.find(g => g.id === 'g_mock');
  if (goal && !goal.completed) {
    goal.completed = true;
    renderGoals();
  }

  // Render Evaluation Screen
  renderFeedbackScorecard(overallScore, finalTechnical, finalComm, finalAmbiguity, session.answers);
}

function evaluateAnswerMetric(answer, keywords) {
  const ansLower = answer.toLowerCase();
  let matched = [];
  keywords.forEach(word => {
    if (ansLower.includes(word.toLowerCase())) matched.push(word);
  });

  // TECHNICAL accuracy score (weighted by keywords found)
  const kwPercent = keywords.length > 0 ? (matched.length / keywords.length) : 1;
  let technicalScore = 40 + (kwPercent * 50); // Base of 40, up to 90
  if (answer.length > 250) technicalScore += 5; // Length depth reward
  if (answer.length < 50) technicalScore -= 15; // Penalty for short responses
  technicalScore = Math.max(10, Math.min(Math.round(technicalScore), 100));

  // COMMUNICATION: look for structured logical phrasing (star structure, transitions)
  let commScore = 55;
  const structuralTriggers = ["situation", "result", "action", "task", "impact", "because", "therefore", "firstly", "secondly", "however", "comparatively"];
  structuralTriggers.forEach(word => {
    if (ansLower.includes(word)) commScore += 4;
  });
  if (answer.length > 150) commScore += 5;
  commScore = Math.max(30, Math.min(Math.round(commScore), 100));

  // AMBIGUITY: Handling assumptions, clarifying queries, trade-offs
  let ambiguityScore = 50;
  const clarifyingTriggers = ["depend", "assume", "trade-off", "scalability", "alternative", "cost", "requirements", "clarify"];
  clarifyingTriggers.forEach(word => {
    if (ansLower.includes(word)) ambiguityScore += 6;
  });
  ambiguityScore = Math.max(30, Math.min(Math.round(ambiguityScore), 100));

  // Construct feedback bullet suggestions
  const advice = [];
  if (matched.length < keywords.length / 2) {
    advice.push(`Incorporate key domain patterns: focus on [${keywords.slice(0, 3).join(', ')}].`);
  }
  if (answer.length < 100) {
    advice.push("Elaborate on your architectural decisions or outline a step-by-step resolution path.");
  }
  if (commScore < 70) {
    advice.push("Leverage the STAR method (Situation, Task, Action, Result) to format scenario questions.");
  }
  if (advice.length === 0) {
    advice.push("Excellent structured, technical, and complete explanation.");
  }

  return {
    technical: technicalScore,
    comm: commScore,
    ambiguity: ambiguityScore,
    matchedKeywords: matched,
    missingKeywords: keywords.filter(w => !matched.includes(w)),
    feedback: advice
  };
}

function renderFeedbackScorecard(total, tech, comm, amb, answers) {
  document.getElementById('mock-chat-panel').classList.add('hidden');
  document.getElementById('mock-feedback-panel').classList.remove('hidden');

  // Fill text metrics
  document.getElementById('feedback-score-total').textContent = `${total}%`;
  
  let gradeComment = "Ready for Loops";
  if (total < 50) gradeComment = "More practice needed";
  else if (total < 75) gradeComment = "Competitive draft";
  document.getElementById('feedback-score-comment').textContent = gradeComment;

  // Set visual bars
  document.getElementById('feedback-metric-technical').textContent = `${tech}%`;
  document.getElementById('feedback-fill-technical').style.width = `${tech}%`;

  document.getElementById('feedback-metric-comm').textContent = `${comm}%`;
  document.getElementById('feedback-fill-comm').style.width = `${comm}%`;

  document.getElementById('feedback-metric-ambiguity').textContent = `${amb}%`;
  document.getElementById('feedback-fill-ambiguity').style.width = `${amb}%`;

  // Render QA detailed accordion breakdown
  const container = document.getElementById('feedback-breakdown-container');
  container.innerHTML = '';

  answers.forEach((ans, idx) => {
    const item = document.createElement('div');
    item.className = 'breakdown-item';
    
    const ansScore = Math.round((ans.eval.technical * 0.5) + (ans.eval.comm * 0.3) + (ans.eval.ambiguity * 0.2));

    item.innerHTML = `
      <div class="breakdown-header" onclick="toggleFeedbackAccordion(this)">
        <span class="breakdown-title">Q${idx + 1}: ${ans.questionText}</span>
        <span class="breakdown-score text-success">${ansScore}%</span>
      </div>
      <div class="breakdown-body">
        <div class="feedback-qa-box">
          <span class="feedback-qa-label">Answer Given</span>
          <p>${ans.userAnswer}</p>
        </div>
        <div class="feedback-qa-box">
          <span class="feedback-qa-label">Matched Keywords</span>
          <p class="text-success">${ans.eval.matchedKeywords.join(', ') || 'None'}</p>
        </div>
        <div class="feedback-qa-box">
          <span class="feedback-qa-label">Missing Target Focus Keywords</span>
          <p class="text-warning">${ans.eval.missingKeywords.join(', ') || 'None'}</p>
        </div>
        <div class="feedback-qa-box">
          <span class="feedback-qa-label">Critiques & Action Steps</span>
          <ul style="padding-left:1rem;">
            ${ans.eval.feedback.map(f => `<li>${f}</li>`).join('')}
          </ul>
        </div>
      </div>
    `;
    container.appendChild(item);
  });
}

window.toggleFeedbackAccordion = function(headerElement) {
  const item = headerElement.parentElement;
  item.classList.toggle('open');
};

function closeFeedbackView() {
  document.getElementById('mock-feedback-panel').classList.add('hidden');
  document.getElementById('mock-setup-panel').classList.remove('hidden');
  
  // Transition back to main dashboard
  document.querySelector('.nav-link[data-tab="dashboard"]').click();
}


// --- COMPANY SPECIFIC PREPARATION PLANNERS ---
function renderCompanyGrid() {
  const grid = document.getElementById('company-cards-grid');
  grid.innerHTML = '';

  window.COMPANY_DATA.forEach(comp => {
    const card = document.createElement('div');
    card.className = 'company-card';
    card.onclick = () => showCompanyDetail(comp.key);

    const logoInit = comp.name.charAt(0);
    // Find overall solved metrics specifically for company popular question subset
    const totalSet = comp.popularQuestions.length;
    const solvedSet = comp.popularQuestions.filter(qid => !!state.solvedProblems[qid]).length;
    const solvedPercent = totalSet > 0 ? Math.round((solvedSet / totalSet) * 100) : 0;

    card.innerHTML = `
      <div class="company-card-top">
        <div class="company-logo-circle" style="background: ${comp.color};">${logoInit}</div>
        <span class="badge" style="background: rgba(255,255,255,0.06); border: 1px solid var(--border-color); color: var(--text-secondary);">${totalSet} Practice Problems</span>
      </div>
      <div>
        <span class="company-name">${comp.name}</span>
        <span class="company-rounds-count">${comp.rounds.length} Interview Rounds</span>
      </div>
      <div class="company-card-footer">
        <span class="company-match-rate">Solved: ${solvedPercent}%</span>
        <span class="btn-view-prep">
          Prep Guide 
          <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2.5" fill="none"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
        </span>
      </div>
    `;

    grid.appendChild(card);
  });
}

function showCompanyDetail(companyKey) {
  const comp = window.COMPANY_DATA.find(c => c.key === companyKey);
  if (!comp) return;

  document.getElementById('company-cards-grid').classList.add('hidden');
  document.getElementById('company-detail-panel').classList.remove('hidden');

  document.getElementById('company-detail-name').textContent = `${comp.name} Target Preparation Guide`;
  
  // Bind start company mock button
  const mockBtn = document.getElementById('btn-company-start-mock');
  mockBtn.onclick = () => {
    // Auto configure mock setting for this company
    const mockTabLink = document.querySelector('.nav-link[data-tab="mock"]');
    mockTabLink.click();
    
    // Auto select behavioral round as it fits cultural matching or select customized
    document.getElementById('mock-role-select').value = "behavioral";
    alert(`Setting up customized mock round focusing heavily on ${comp.name}'s Core Principles! Click "Start Session" to initiate.`);
  };

  // Render loop rounds
  const roundsList = document.getElementById('company-rounds-list');
  roundsList.innerHTML = '';
  comp.rounds.forEach(rnd => {
    const node = document.createElement('div');
    node.className = 'timeline-node';
    node.innerHTML = `
      <span class="node-title">${rnd.name}</span>
      <span class="node-detail">${rnd.detail}</span>
    `;
    roundsList.appendChild(node);
  });

  // Render values checklist
  const valuesList = document.getElementById('company-values-list');
  valuesList.innerHTML = '';
  comp.values.forEach(val => {
    const li = document.createElement('li');
    li.textContent = val;
    valuesList.appendChild(li);
  });

  // Render topics distributions
  const topicsList = document.getElementById('company-topics-list');
  topicsList.innerHTML = '';
  comp.topics.forEach(top => {
    const row = document.createElement('div');
    row.className = 'weight-row';
    row.innerHTML = `
      <span class="weight-label">${top.name}</span>
      <div class="weight-gauge-bg">
        <div class="weight-gauge-fill" style="width: ${top.weight};"></div>
      </div>
      <span class="weight-value">${top.weight}</span>
    `;
    topicsList.appendChild(row);
  });

  // Render popular questions list
  const qsList = document.getElementById('company-questions-list');
  qsList.innerHTML = '';
  
  const problems = window.DSA_PROBLEMS.filter(p => comp.popularQuestions.includes(p.id));
  problems.forEach(p => {
    const isSolved = !!state.solvedProblems[p.id];
    const row = document.createElement('div');
    row.className = `problem-row ${isSolved ? 'solved' : ''}`;
    
    const diffClass = p.difficulty === 'Easy' ? 'diff-easy' : p.difficulty === 'Medium' ? 'diff-medium' : 'diff-hard';

    row.innerHTML = `
      <div class="problem-left">
        <div class="problem-checkbox" onclick="toggleProblemCompletion(${p.id}, event)"></div>
        <a href="${p.leetcodeUrl}" target="_blank" class="problem-title">${p.title}</a>
      </div>
      <div class="problem-right">
        <span class="difficulty-pill ${diffClass}">${p.difficulty}</span>
      </div>
    `;
    qsList.appendChild(row);
  });
}

// Back to grid button configuration
document.getElementById('btn-back-companies').onclick = () => {
  document.getElementById('company-detail-panel').classList.add('hidden');
  document.getElementById('company-cards-grid').classList.remove('hidden');
};


// --- INITIALIZATION ---
window.onload = function() {
  loadState();
  initRouting();
  initGoals();
  
  // Load dashboard on start
  renderHeatmap();
  renderGoals();
  updateDashboardMetrics();

  // Load modules details
  initResumeModule();
  initDSAModule();
  initMockModule();
};
