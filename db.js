// Database Seed for Placement & Interview Prep Agent

const DSA_PROBLEMS = [
  // Arrays & Hashing
  { id: 1, title: "Two Sum", difficulty: "Easy", topic: "Arrays", leetcodeUrl: "https://leetcode.com/problems/two-sum/", categories: ["Blind 75", "SDE Sheet"], description: "Find two numbers in an array that add up to a specific target." },
  { id: 2, title: "Best Time to Buy and Sell Stock", difficulty: "Easy", topic: "Arrays", leetcodeUrl: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/", categories: ["Blind 75", "SDE Sheet"], description: "Find the maximum profit you can achieve from buying and selling a stock." },
  { id: 3, title: "Contains Duplicate", difficulty: "Easy", topic: "Arrays", leetcodeUrl: "https://leetcode.com/problems/contains-duplicate/", categories: ["Blind 75"], description: "Check if any value appears at least twice in an array." },
  { id: 4, title: "Product of Array Except Self", difficulty: "Medium", topic: "Arrays", leetcodeUrl: "https://leetcode.com/problems/product-of-array-except-self/", categories: ["Blind 75", "SDE Sheet"], description: "Calculate the product of all elements of an array except the one at current index without using division." },
  { id: 5, title: "Maximum Subarray (Kadane's)", difficulty: "Medium", topic: "Arrays", leetcodeUrl: "https://leetcode.com/problems/maximum-subarray/", categories: ["Blind 75", "SDE Sheet"], description: "Find the contiguous subarray with the largest sum." },
  { id: 6, title: "Group Anagrams", difficulty: "Medium", topic: "Arrays", leetcodeUrl: "https://leetcode.com/problems/group-anagrams/", categories: ["Blind 75"], description: "Group strings that are anagrams of each other together." },
  { id: 7, title: "Top K Frequent Elements", difficulty: "Medium", topic: "Arrays", leetcodeUrl: "https://leetcode.com/problems/top-k-frequent-elements/", categories: ["Blind 75"], description: "Find the k most frequent elements in an array." },
  
  // Two Pointers & Sliding Window
  { id: 8, title: "Valid Palindrome", difficulty: "Easy", topic: "Two Pointers", leetcodeUrl: "https://leetcode.com/problems/valid-palindrome/", categories: ["Blind 75"], description: "Check if a string is a palindrome after converting all uppercase letters into lowercase and removing non-alphanumeric characters." },
  { id: 9, title: "3Sum", difficulty: "Medium", topic: "Two Pointers", leetcodeUrl: "https://leetcode.com/problems/3sum/", categories: ["Blind 75", "SDE Sheet"], description: "Find all unique triplets in the array that sum to zero." },
  { id: 10, title: "Container With Most Water", difficulty: "Medium", topic: "Two Pointers", leetcodeUrl: "https://leetcode.com/problems/container-with-most-water/", categories: ["Blind 75"], description: "Find two lines that together with the x-axis form a container, such that the container contains the most water." },
  { id: 11, title: "Longest Substring Without Repeating Characters", difficulty: "Medium", topic: "Sliding Window", leetcodeUrl: "https://leetcode.com/problems/longest-substring-without-repeating-characters/", categories: ["Blind 75", "SDE Sheet"], description: "Find the length of the longest substring without repeating characters." },
  { id: 12, title: "Longest Repeating Character Replacement", difficulty: "Medium", topic: "Sliding Window", leetcodeUrl: "https://leetcode.com/problems/longest-repeating-character-replacement/", categories: ["Blind 75"], description: "Find the length of the longest substring containing the same letter after replacing at most k characters." },
  { id: 13, title: "Minimum Window Substring", difficulty: "Hard", topic: "Sliding Window", leetcodeUrl: "https://leetcode.com/problems/minimum-window-substring/", categories: ["Blind 75", "SDE Sheet"], description: "Find the minimum window in s which will contain all the characters in t." },

  // Linked Lists
  { id: 14, title: "Reverse Linked List", difficulty: "Easy", topic: "Linked List", leetcodeUrl: "https://leetcode.com/problems/reverse-linked-list/", categories: ["Blind 75", "SDE Sheet"], description: "Reverse a singly linked list." },
  { id: 15, title: "Merge Two Sorted Lists", difficulty: "Easy", topic: "Linked List", leetcodeUrl: "https://leetcode.com/problems/merge-two-sorted-lists/", categories: ["Blind 75", "SDE Sheet"], description: "Merge two sorted linked lists and return it as a new sorted list." },
  { id: 16, title: "Linked List Cycle", difficulty: "Easy", topic: "Linked List", leetcodeUrl: "https://leetcode.com/problems/linked-list-cycle/", categories: ["Blind 75", "SDE Sheet"], description: "Determine if a linked list has a cycle in it." },
  { id: 17, title: "Remove Nth Node From End of List", difficulty: "Medium", topic: "Linked List", leetcodeUrl: "https://leetcode.com/problems/remove-nth-node-from-end-of-list/", categories: ["Blind 75", "SDE Sheet"], description: "Remove the nth node from the end of the list and return its head." },
  { id: 18, title: "Reorder List", difficulty: "Medium", topic: "Linked List", leetcodeUrl: "https://leetcode.com/problems/reorder-list/", categories: ["Blind 75"], description: "Reorder a linked list to be in the order: L0 → Ln → L1 → Ln-1 → L2 → Ln-2 → ..." },

  // Trees & Graphs
  { id: 19, title: "Invert Binary Tree", difficulty: "Easy", topic: "Trees", leetcodeUrl: "https://leetcode.com/problems/invert-binary-tree/", categories: ["Blind 75"], description: "Invert a binary tree (flip it horizontally)." },
  { id: 20, title: "Maximum Depth of Binary Tree", difficulty: "Easy", topic: "Trees", leetcodeUrl: "https://leetcode.com/problems/maximum-depth-of-binary-tree/", categories: ["Blind 75"], description: "Find the maximum depth (height) of a binary tree." },
  { id: 21, title: "Same Tree", difficulty: "Easy", topic: "Trees", leetcodeUrl: "https://leetcode.com/problems/same-tree/", categories: ["Blind 75"], description: "Check if two binary trees are structurally identical and have the same node values." },
  { id: 22, title: "Validate Binary Search Tree", difficulty: "Medium", topic: "Trees", leetcodeUrl: "https://leetcode.com/problems/validate-binary-search-tree/", categories: ["Blind 75", "SDE Sheet"], description: "Determine if a binary tree is a valid Binary Search Tree." },
  { id: 23, title: "Binary Tree Level Order Traversal", difficulty: "Medium", topic: "Trees", leetcodeUrl: "https://leetcode.com/problems/binary-tree-level-order-traversal/", categories: ["Blind 75", "SDE Sheet"], description: "Return the level order traversal of its nodes' values (BFS)." },
  { id: 24, title: "Number of Islands", difficulty: "Medium", topic: "Graphs", leetcodeUrl: "https://leetcode.com/problems/number-of-islands/", categories: ["Blind 75", "SDE Sheet"], description: "Given an m x n 2D binary grid which represents a map of '1's (land) and '0's (water), return the number of islands." },
  { id: 25, title: "Clone Graph", difficulty: "Medium", topic: "Graphs", leetcodeUrl: "https://leetcode.com/problems/clone-graph/", categories: ["Blind 75", "SDE Sheet"], description: "Deep copy a connected undirected graph." },
  { id: 26, title: "Course Schedule", difficulty: "Medium", topic: "Graphs", leetcodeUrl: "https://leetcode.com/problems/course-schedule/", categories: ["Blind 75", "SDE Sheet"], description: "Detect cycles in a directed graph to see if you can finish all courses given their prerequisites." },

  // Dynamic Programming
  { id: 27, title: "Climbing Stairs", difficulty: "Easy", topic: "Dynamic Programming", leetcodeUrl: "https://leetcode.com/problems/climbing-stairs/", categories: ["Blind 75"], description: "Find the number of distinct ways to climb n stairs if you can climb 1 or 2 steps at a time." },
  { id: 28, title: "Coin Change", difficulty: "Medium", topic: "Dynamic Programming", leetcodeUrl: "https://leetcode.com/problems/coin-change/", categories: ["Blind 75", "SDE Sheet"], description: "Find the fewest number of coins needed to make up a given amount." },
  { id: 29, title: "Longest Increasing Subsequence", difficulty: "Medium", topic: "Dynamic Programming", leetcodeUrl: "https://leetcode.com/problems/longest-increasing-subsequence/", categories: ["Blind 75", "SDE Sheet"], description: "Find the length of the longest strictly increasing subsequence." },
  { id: 30, title: "LCS (Longest Common Subsequence)", difficulty: "Medium", topic: "Dynamic Programming", leetcodeUrl: "https://leetcode.com/problems/longest-common-subsequence/", categories: ["Blind 75", "SDE Sheet"], description: "Find the length of the longest common subsequence between two strings." },
  { id: 31, title: "House Robber", difficulty: "Easy", topic: "Dynamic Programming", leetcodeUrl: "https://leetcode.com/problems/house-robber/", categories: ["Blind 75"], description: "Determine the maximum amount of money you can rob tonight without alerting the police (cannot rob adjacent houses)." },
];

const COMPANY_DATA = [
  {
    key: "google",
    name: "Google",
    theme: "google-theme",
    color: "#4285F4",
    rounds: [
      { name: "Online Assessment", detail: "1-2 Coding questions (typically focus on graph traversal or array manipulations, 90 mins)." },
      { name: "Technical Screen", detail: "1 phone coding interview focusing on algorithms and data structures (45 mins)." },
      { name: "Onsite Loop", detail: "3 Coding interviews (heavy graph, tree, heap/trie focus) + 1 Googlyness (behavioral/cultural) interview." }
    ],
    values: [
      "Googleyness (doing the right thing, intellectual humility, bias for action)",
      "Navigating ambiguity (solving problems with incomplete requirements)",
      "Strong algorithmic efficiency (constant focus on O(N) or O(log N) optimizations)"
    ],
    topics: [
      { name: "Graphs & DFS/BFS", weight: "35%" },
      { name: "Trees & Tries", weight: "25%" },
      { name: "Dynamic Programming", weight: "20%" },
      { name: "Arrays & Binary Search", weight: "20%" }
    ],
    popularQuestions: [24, 26, 23, 13]
  },
  {
    key: "meta",
    name: "Meta",
    theme: "meta-theme",
    color: "#0668E1",
    rounds: [
      { name: "Technical Screen", detail: "1-2 coding problems, highly optimized solution and bug-free code expected (45 mins)." },
      { name: "Coding Onsite", detail: "2 separate coding rounds. Speed and efficiency are extremely critical—often expecting 2 questions per round." },
      { name: "System Design", detail: "1 Architecture round (focus on scalability, APIs, data storage, database selection)." },
      { name: "Behavioral Round", detail: "1 Behavioral round evaluating collaboration, conflict resolution, and past execution." }
    ],
    values: [
      "Move Fast (ship quickly, iterate rapidly, minimal bureaucracy)",
      "Be Bold (take risks, solve high-impact problems)",
      "Focus on Impact (prioritize tasks that drive user value)"
    ],
    topics: [
      { name: "Arrays & Strings", weight: "40%" },
      { name: "Hash Maps & Two Pointers", weight: "30%" },
      { name: "Trees & Binary Search", weight: "15%" },
      { name: "Linked Lists", weight: "15%" }
    ],
    popularQuestions: [1, 6, 9, 11]
  },
  {
    key: "amazon",
    name: "Amazon",
    theme: "amazon-theme",
    color: "#FF9900",
    rounds: [
      { name: "Online Assessment", detail: "SDE simulation + coding challenges + work style assessment." },
      { name: "Technical Screen", detail: "1 coding question + 15 mins of Amazon Leadership Principles questions." },
      { name: "Loop", detail: "3 Technical interviews (coding + system design) + 1 Bar Raiser. Every round starts with 20 minutes of Leadership Principles." }
    ],
    values: [
      "Customer Obsession (start with customer and work backwards)",
      "Ownership (leaders are owners, think long term)",
      "Bias for Action (speed matters in business, value calculated risk)"
    ],
    topics: [
      { name: "Trees & Heaps", weight: "30%" },
      { name: "Dynamic Programming", weight: "25%" },
      { name: "Graphs & Arrays", weight: "25%" },
      { name: "System Design & OOD", weight: "20%" }
    ],
    popularQuestions: [2, 4, 10, 20]
  },
  {
    key: "microsoft",
    name: "Microsoft",
    theme: "microsoft-theme",
    color: "#F25022",
    rounds: [
      { name: "Screen", detail: "Codility online test or 45-minute technical screening." },
      { name: "Onsite Loop", detail: "4 Rounds total: 3 technical (coding, system/object-oriented design) and 1 behavioral/manager round." }
    ],
    values: [
      "Growth Mindset (learn from mistakes, keep curiosity alive)",
      "Customer Partners (empathize and build for everyone)",
      "Collaboration and Inclusion (driving progress through teamwork)"
    ],
    topics: [
      { name: "Linked Lists & Strings", weight: "30%" },
      { name: "Arrays & Trees", weight: "30%" },
      { name: "System & OOD Design", weight: "20%" },
      { name: "Stacks & Queues", weight: "20%" }
    ],
    popularQuestions: [14, 15, 17, 22]
  }
];

const INTERVIEW_TEMPLATES = {
  frontend: [
    {
      id: "fe_1",
      question: "Can you explain how the Virtual DOM works in React, and how it differs from the real DOM?",
      expectedKeywords: ["virtual dom", "reconciliation", "diffing", "fiber", "repaint", "reflow"],
      followUps: [
        "What are keys in React lists, and why are they important for diffing?",
        "How would you optimize a component that re-renders unnecessarily?"
      ],
      evaluationCriteria: "Strong candidates explain the performance cost of DOM manipulations, the diffing algorithm (O(N) assumptions), and reconciliation."
    },
    {
      id: "fe_2",
      question: "How do you optimize a web page for performance? What metrics do you focus on?",
      expectedKeywords: ["lighthouse", "lcp", "fid", "cls", "lazy loading", "bundling", "cdn", "code splitting"],
      followUps: [
        "What is the difference between Core Web Vitals and standard speed metrics?",
        "How would you approach optimizing massive heavy image loads dynamically?"
      ],
      evaluationCriteria: "Expects mentioning Core Web Vitals (LCP, FID/INP, CLS), minification, image compression, lazy loading, and asset caching techniques."
    },
    {
      id: "fe_3",
      question: "Explain the JavaScript event loop, and differentiate between microtasks and macrotasks.",
      expectedKeywords: ["call stack", "event loop", "callback queue", "microtask", "promise", "settimeout", "render queue"],
      followUps: [
        "What is the output order of a Promise resolve vs a setTimeout with 0ms delay?",
        "How does blocking the main thread affect browser rendering animations?"
      ],
      evaluationCriteria: "Must accurately explain Call Stack, Web APIs, Task Queue vs Microtask Queue (Promises have priority), and the infinite checking loop."
    }
  ],
  backend: [
    {
      id: "be_1",
      question: "How do you design a database schema to handle high-write scaling, and what are the trade-offs between SQL and NoSQL?",
      expectedKeywords: ["sql", "nosql", "sharding", "replication", "acid", "eventual consistency", "indexing", "throughput"],
      followUps: [
        "When would you explicitly choose eventual consistency over strong consistency?",
        "How do database indexes improve read speed, and what is their cost on write speeds?"
      ],
      evaluationCriteria: "Looks for structured evaluation of relational structure (ACID, complex joins) vs Document/Key-Value (horizontal scaling, schema-less, sharding)."
    },
    {
      id: "be_2",
      question: "Explain how REST, GraphQL, and gRPC compare. When would you use each?",
      expectedKeywords: ["rest", "graphql", "grpc", "protobuf", "over-fetching", "http/2", "payload", "streaming"],
      followUps: [
        "How does gRPC achieve much lower latency compared to standard JSON REST APIs?",
        "How does GraphQL solve the over-fetching and under-fetching problem?"
      ],
      evaluationCriteria: "Evaluates protocol understanding: HTTP/2 for gRPC binary communication, query flexibility for GraphQL, and standard, cacheable CRUD for REST."
    },
    {
      id: "be_3",
      question: "How do you handle authentication and authorization in a distributed microservices architecture?",
      expectedKeywords: ["jwt", "oauth", "api gateway", "session store", "redis", "stateless", "claims", "rbac"],
      followUps: [
        "Where should validation of a JWT occur? At the API Gateway or individual microservices?",
        "How do you handle JWT token revocation before expiration?"
      ],
      evaluationCriteria: "Focuses on security patterns, centralized gateway validation, token propagation, stateless JWT verification, and cache lookup for blacklisted tokens."
    }
  ],
  system_design: [
    {
      id: "sd_1",
      question: "Design a URL shortening service like TinyURL. How do you handle 10,000 requests per second?",
      expectedKeywords: ["base62", "hashing", "unique generator", "redis", "caching", "db sharding", "collisions", "api gateway"],
      followUps: [
        "How do you handle hash collision if two different URLs produce the same short token?",
        "What eviction policy would you use for your Redis cache layer?"
      ],
      evaluationCriteria: "Candidate should map high level flow (Write API, Redirect API), compute storage requirements (TB scale), define short-code generation (Base62), and index caching."
    },
    {
      id: "sd_2",
      question: "Design a notification system that supports Email, SMS, and Push notifications at scale.",
      expectedKeywords: ["message queue", "rabbitmq", "kafka", "rate limiter", "idempotency", "priority queue", "dead letter queue", "retry mechanism"],
      followUps: [
        "How do you prevent sending the same notification twice to a user?",
        "How would you ensure urgent notifications (OTP) are delivered faster than newsletters?"
      ],
      evaluationCriteria: "Focuses on loose coupling (queues), rate limiters to avoid provider spam, deduplication keys (idempotency), retry logic, and handling offline device delivery."
    }
  ],
  behavioral: [
    {
      id: "bh_1",
      question: "Describe a time when you had a conflict with a teammate or stakeholder. How did you resolve it?",
      expectedKeywords: ["conflict", "communication", "empathy", "compromise", "constructive", "alignment", "star method"],
      followUps: [
        "What did you learn from that experience that changed your way of working?",
        "If you could redo that interaction, what would you do differently?"
      ],
      evaluationCriteria: "Expects STAR method (Situation, Task, Action, Result). Looks for emotional intelligence, focus on constructive solutions, active listening, and positive team output."
    },
    {
      id: "bh_2",
      question: "Tell me about a time you failed or made a major technical mistake. What was the impact and what did you learn?",
      expectedKeywords: ["mistake", "failure", "ownership", "post-mortem", "remediation", "prevention", "learning"],
      followUps: [
        "How did you communicate the failure to your manager or team?",
        "What safeguards did you implement to ensure this mistake never happens again?"
      ],
      evaluationCriteria: "Evaluates accountability and ownership. The candidate must clearly explain the learning process, root-cause mitigation, and avoiding finger-pointing."
    }
  ]
};

const ATS_KEYWORDS = {
  sections: ["experience", "work history", "employment", "education", "projects", "skills", "technical skills", "certifications", "summary"],
  
  verbs: ["led", "developed", "optimized", "architected", "spearheaded", "implemented", "designed", "engineered", "increased", "reduced", "delivered", "managed", "built", "created", "automated", "refactored", "migrated", "maximized", "saved", "launched"],
  
  roles: {
    software_engineer: ["algorithms", "data structures", "git", "ci/cd", "rest api", "unit testing", "system design", "agile", "debugging", "clean code", "object-oriented programming", "problem-solving"],
    frontend: ["html5", "css3", "javascript", "typescript", "react", "vue", "angular", "webpack", "responsive design", "accessibility", "aria", "sass", "flexbox", "grid", "performance optimization", "redox", "state management", "browser storage"],
    backend: ["node.js", "python", "java", "go", "c#", "express", "django", "spring boot", "postgresql", "mongodb", "mysql", "redis", "docker", "kubernetes", "microservices", "orm", "restful api", "graphql", "grpc", "message queues", "caching", "scalability"],
    fullstack: ["javascript", "typescript", "react", "node.js", "database", "api design", "html5", "css3", "git", "cloud computing", "aws", "docker", "ci/cd", "system architecture", "state management", "sql", "nosql"]
  }
};

// Export to make it accessible if modules are used, but also bind globally for ease of use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { DSA_PROBLEMS, COMPANY_DATA, INTERVIEW_TEMPLATES, ATS_KEYWORDS };
} else {
  window.DSA_PROBLEMS = DSA_PROBLEMS;
  window.COMPANY_DATA = COMPANY_DATA;
  window.INTERVIEW_TEMPLATES = INTERVIEW_TEMPLATES;
  window.ATS_KEYWORDS = ATS_KEYWORDS;
}
