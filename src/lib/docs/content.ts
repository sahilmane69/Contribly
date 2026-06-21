import {
  BookOpen,
  Bot,
  CreditCard,
  GitBranch,
  HelpCircle,
  Rocket,
  ShieldCheck,
  UserCircle,
} from "lucide-react";

export type DocsBlock =
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "steps"; items: string[] }
  | { type: "code"; language: string; value: string }
  | { type: "callout"; title: string; text: string }
  | { type: "cards"; cards: Array<{ title: string; text: string; href: string }> };

export type DocsSection = {
  id: string;
  title: string;
  blocks: DocsBlock[];
};

export type DocsPage = {
  slug: string;
  title: string;
  description: string;
  category: string;
  sections: DocsSection[];
};

export type DocsNavItem = {
  title: string;
  slug: string;
};

export const docsNavigation = [
  {
    title: "Getting Started",
    icon: Rocket,
    items: [
      { title: "What is Contribly", slug: "getting-started/what-is-contribly" },
      { title: "Quick Start", slug: "getting-started/quick-start" },
      { title: "GitHub Login", slug: "getting-started/github-login" },
      {
        title: "Repository Discovery",
        slug: "getting-started/repository-discovery",
      },
    ],
  },
  {
    title: "Features",
    icon: Bot,
    items: [
      { title: "AI Skill Analysis", slug: "features/ai-skill-analysis" },
      {
        title: "AI Issue Recommendations",
        slug: "features/ai-issue-recommendations",
      },
      { title: "Contribution Copilot", slug: "features/contribution-copilot" },
      { title: "Solution Review", slug: "features/solution-review" },
      { title: "Pull Request Assistant", slug: "features/pull-request-assistant" },
      { title: "Analytics Dashboard", slug: "features/analytics-dashboard" },
    ],
  },
  {
    title: "Repository Management",
    icon: GitBranch,
    items: [
      {
        title: "Searching GitHub Repositories",
        slug: "repository-management/searching-github-repositories",
      },
      {
        title: "Following Repositories",
        slug: "repository-management/following-repositories",
      },
      {
        title: "Monitoring Issues",
        slug: "repository-management/monitoring-issues",
      },
    ],
  },
  {
    title: "AI Features",
    icon: BookOpen,
    items: [
      { title: "How AI Matching Works", slug: "ai/how-ai-matching-works" },
      { title: "Understanding Issues", slug: "ai/understanding-issues" },
      { title: "Codebase Analysis", slug: "ai/codebase-analysis" },
      { title: "Solution Verification", slug: "ai/solution-verification" },
      { title: "Pull Request Generation", slug: "ai/pull-request-generation" },
    ],
  },
  {
    title: "Pricing",
    icon: CreditCard,
    items: [
      { title: "Free Plan", slug: "pricing/free-plan" },
      { title: "Pro Plan", slug: "pricing/pro-plan" },
      { title: "Team Plan", slug: "pricing/team-plan" },
    ],
  },
  {
    title: "Account",
    icon: UserCircle,
    items: [
      { title: "Profile Settings", slug: "account/profile-settings" },
      { title: "Notifications", slug: "account/notifications" },
      { title: "Billing", slug: "account/billing" },
      {
        title: "Subscription Management",
        slug: "account/subscription-management",
      },
    ],
  },
  {
    title: "FAQ",
    icon: HelpCircle,
    items: [
      { title: "Common Questions", slug: "faq/common-questions" },
      { title: "Troubleshooting", slug: "faq/troubleshooting" },
    ],
  },
  {
    title: "Company",
    icon: ShieldCheck,
    items: [
      { title: "Roadmap", slug: "roadmap" },
      { title: "Changelog", slug: "changelog" },
      { title: "Security", slug: "security" },
      { title: "Privacy", slug: "privacy" },
      { title: "Terms", slug: "terms" },
    ],
  },
] as const;

const journey = [
  "Sign in with GitHub and grant Contribly access to read profile and public contribution context.",
  "Contribly analyzes languages, repositories, pull requests, and contribution history.",
  "Search curated repositories or follow projects you already care about.",
  "AI recommends open issues that match your skills, interests, and available difficulty level.",
  "Open an issue, review the summary, and understand what maintainers are asking for.",
  "Use AI explanations to map the issue to the relevant codebase areas.",
  "Work on the solution locally using the implementation plan as a guide.",
  "Ask Contribly to review the implementation before you submit.",
  "Generate a clear pull request description with context, tests, and linked issue references.",
  "Track contribution progress from the dashboard and analytics views.",
];

export const docsPages: DocsPage[] = [
  {
    slug: "",
    title: "Contribly Documentation",
    description:
      "Learn how Contribly helps developers find, understand, and contribute to open-source projects with AI-assisted workflows.",
    category: "Home",
    sections: [
      {
        id: "overview",
        title: "Build your open-source workflow",
        blocks: [
          {
            type: "p",
            text: "Contribly is an AI-powered open-source copilot for developers who want to contribute faster without losing context. It connects to GitHub, analyzes your contribution profile, helps you discover repositories, recommends matching issues, and supports the journey from issue understanding to pull request creation.",
          },
          {
            type: "cards",
            cards: [
              {
                title: "Start contributing",
                text: "Connect GitHub, generate your skill profile, and follow your first repositories.",
                href: "/docs/getting-started/quick-start",
              },
              {
                title: "Explore AI recommendations",
                text: "Learn how Contribly ranks issues by skill match, difficulty, and project context.",
                href: "/docs/features/ai-issue-recommendations",
              },
              {
                title: "Understand pricing",
                text: "Compare Free, Pro, and Team plans for individual contributors and teams.",
                href: "/docs/pricing/free-plan",
              },
            ],
          },
        ],
      },
      {
        id: "user-journey",
        title: "Complete user journey",
        blocks: [{ type: "steps", items: journey }],
      },
      {
        id: "quick-start",
        title: "Quick start",
        blocks: [
          {
            type: "code",
            language: "text",
            value:
              "1. Sign in with GitHub\n2. Generate your AI Skill Profile\n3. Follow repositories\n4. Open AI Issue Recommendations\n5. Pick an issue and start contributing",
          },
        ],
      },
    ],
  },
  page(
    "getting-started/what-is-contribly",
    "What is Contribly",
    "Getting Started",
    "Contribly is an AI-assisted contribution workspace for open-source developers.",
    [
      section("Contribly in one sentence", [
        p("Contribly helps developers discover repositories, understand issues, and create higher-quality pull requests by combining GitHub activity, repository signals, and AI guidance."),
        ul([
          "For new contributors, it reduces the blank-page feeling of choosing where to start.",
          "For experienced developers, it filters noise and points attention toward high-fit issues.",
          "For teams and maintainers, it creates a foundation for matching contributors to repository needs.",
        ]),
      ]),
      section("Where Contribly fits", [
        p("Contribly sits between GitHub and your local development workflow. It does not replace GitHub, your editor, or maintainers. Instead, it gives you context before you open a codebase and structure before you open a pull request."),
      ]),
      section("Core workflow", [{ type: "steps", items: journey }]),
    ],
  ),
  page("getting-started/quick-start", "Quick Start", "Getting Started", "Set up Contribly and reach your first recommended issue.", [
    section("Before you begin", [
      p("You need a GitHub account and at least a small public contribution or repository history for the best recommendations. Contribly can still create a starter profile with limited data."),
      ul(["A GitHub account", "A browser session", "Repositories you are interested in following"]),
    ]),
    section("Start in five minutes", [
      { type: "steps", items: ["Open Contribly.", "Click Login with GitHub.", "Generate your AI Skill Profile from onboarding.", "Open Repository Explorer and follow repositories.", "Visit AI Issue Recommendations and pick a match."] },
    ]),
    section("Recommended first path", [
      p("If you are new to open source, start with repositories marked Beginner and issues with labels such as good first issue, documentation, or help wanted. If you are experienced, follow repositories that match your strongest technologies and scan Pro recommendations for higher-leverage work."),
    ]),
  ]),
  page("getting-started/github-login", "GitHub Login", "Getting Started", "Understand how GitHub authentication powers Contribly.", [
    section("Why GitHub login is required", [
      p("Contribly uses GitHub authentication to identify your profile, read contribution signals, and personalize repository and issue recommendations. Your GitHub account becomes the anchor for your skill profile and billing state."),
    ]),
    section("What Contribly stores", [
      ul(["GitHub ID", "Username", "Avatar", "Name", "Bio", "Derived skill profile", "Followed repositories", "Subscription status"]),
    ]),
    section("Authentication flow", [
      { type: "code", language: "text", value: "Login with GitHub -> Auth.js session -> Supabase profile -> Onboarding -> Dashboard" },
    ]),
  ]),
  page("getting-started/repository-discovery", "Repository Discovery", "Getting Started", "Find projects that fit your skills and contribution goals.", [
    section("Discovery overview", [
      p("Repository Discovery gives you a curated starting point for open-source work. You can search by project name, language, category, and difficulty, then follow repositories to feed your recommendation engine."),
    ]),
    section("Good repository signals", [
      ul(["Recent activity", "Clear contribution guidelines", "Open issues with labels", "Readable codebase structure", "Technology fit with your skills"]),
    ]),
  ]),
  page("features/ai-skill-analysis", "AI Skill Analysis", "Features", "How Contribly turns GitHub activity into an actionable skill profile.", [
    section("What gets analyzed", [
      p("Contribly reviews repositories, languages, pull requests, and public contribution events. The result is a concise skill profile with skills, expertise score, technologies, and interest categories."),
    ]),
    section("Outputs", [
      ul(["Skills with evidence", "Expertise score", "Top technologies", "Interest categories", "Contribution summary"]),
    ]),
  ]),
  page("features/ai-issue-recommendations", "AI Issue Recommendations", "Features", "AI-generated issue matches based on your profile and followed repositories.", [
    section("Recommendation inputs", [
      ul(["Your AI Skill Profile", "Followed repositories", "Live open issues", "Repository language and difficulty", "Issue titles and labels"]),
    ]),
    section("Recommendation outputs", [
      ul(["Match score", "Difficulty tag", "Estimated completion time", "AI reasoning", "View issue link"]),
    ]),
  ]),
  page("features/contribution-copilot", "Contribution Copilot", "Features", "A guided workflow from issue selection to implementation plan.", [
    section("Purpose", [
      p("The Contribution Copilot is designed to turn a vague issue into a practical set of next steps. It explains the task, identifies likely code areas, and helps you avoid starting with the wrong assumption."),
    ]),
    section("Typical copilot prompts", [
      ul(["Explain this issue in plain English.", "What files should I inspect first?", "What edge cases should I test?", "Draft a plan before I code."]),
    ]),
  ]),
  page("features/solution-review", "Solution Review", "Features", "Use AI to review your contribution before opening a pull request.", [
    section("Review goals", [
      p("Solution Review helps you check whether your implementation addresses the issue, includes reasonable tests, and avoids obvious regressions. It is not a replacement for maintainer review, but it helps you submit more confidently."),
    ]),
    section("Review checklist", [
      ul(["Does the implementation solve the stated problem?", "Are tests or validation steps included?", "Is the change scoped?", "Is the pull request description clear?"]),
    ]),
  ]),
  page("features/pull-request-assistant", "Pull Request Assistant", "Features", "Generate clearer pull request descriptions and review-ready context.", [
    section("What it creates", [
      p("The Pull Request Assistant helps produce a structured pull request description with summary, motivation, test plan, screenshots when relevant, and linked issue references."),
      code("markdown", "## Summary\n- Fixes edge case in parser\n\n## Test plan\n- pnpm test\n- Manual validation with whitespace input\n\nCloses #123"),
    ]),
  ]),
  page("features/analytics-dashboard", "Analytics Dashboard", "Features", "Track contribution progress and repository activity.", [
    section("Metrics", [
      ul(["Issues solved", "Pull requests opened", "Pull requests merged", "Current streak", "Top technologies", "Repository activity"]),
    ]),
    section("How to use it", [
      p("Use Analytics to see where your contribution time is going. Free users see a basic dashboard, while Pro and Team users unlock advanced analytics and future maintainer insights."),
    ]),
  ]),
  page("repository-management/searching-github-repositories", "Searching GitHub Repositories", "Repository Management", "Find repositories by language, category, and difficulty.", [
    section("Search behavior", [
      p("Repository Explorer supports keyword search across names, owners, descriptions, and languages. Filters help narrow the list when you know what kind of contribution you want."),
    ]),
    section("Recommended filters", [
      ul(["Beginner for first contributions", "TypeScript for frontend/full-stack work", "Backend for API or database work", "Developer Tools for CLI, SDK, or testing projects"]),
    ]),
  ]),
  page("repository-management/following-repositories", "Following Repositories", "Repository Management", "Save repositories as inputs for personalized recommendations.", [
    section("Why follow repositories", [
      p("Following a repository tells Contribly that you want issue recommendations from that project. Followed repositories are stored in Supabase and used to fetch open issues."),
    ]),
    section("Favorites", [
      p("Favorites are a stronger signal than a regular follow. Use favorites for repositories you actively want to contribute to soon."),
    ]),
  ]),
  page("repository-management/monitoring-issues", "Monitoring Issues", "Repository Management", "Understand how Contribly scans open issues.", [
    section("Issue monitoring", [
      p("Contribly reads open issues from followed repositories and filters out pull requests. It then prepares issue metadata for AI matching, including labels, title, repository, comments, and URL."),
    ]),
    section("Best issue labels", [
      ul(["good first issue", "help wanted", "bug", "documentation", "performance", "tests"]),
    ]),
  ]),
  page("ai/how-ai-matching-works", "How AI Matching Works", "AI Features", "Learn how Contribly ranks issues for your profile.", [
    section("Matching model", [
      p("AI matching compares your skill profile against repository metadata and issue data. It considers language fit, difficulty, labels, contribution history, and project category."),
    ]),
    section("Match score", [
      p("The match score is a recommendation signal, not a guarantee. A 95% match means the issue appears highly aligned with your skills and followed repositories based on available context."),
    ]),
  ]),
  page("ai/understanding-issues", "Understanding Issues", "AI Features", "Turn issue text into clear implementation context.", [
    section("Issue explanation", [
      p("Contribly can explain what an issue is asking for, why it matters, and what a successful fix likely includes. This helps you avoid misreading maintainer intent."),
    ]),
    section("What to verify", [
      ul(["Reproduction steps", "Expected behavior", "Affected files", "Existing tests", "Maintainer comments"]),
    ]),
  ]),
  page("ai/codebase-analysis", "Codebase Analysis", "AI Features", "Use AI to map issues to repository structure.", [
    section("Codebase context", [
      p("Codebase Analysis helps identify where to start reading. It can suggest likely directories, naming patterns, and test locations when enough repository context is available."),
    ]),
    section("Recommended approach", [
      { type: "steps", items: ["Read the issue.", "Open linked files or stack traces.", "Search for related tests.", "Make the smallest useful change.", "Run validation before creating a pull request."] },
    ]),
  ]),
  page("ai/solution-verification", "Solution Verification", "AI Features", "Check your implementation before review.", [
    section("Verification flow", [
      p("Solution Verification compares the original issue, your implementation summary, and validation steps. It highlights missing tests, scope creep, and unclear assumptions."),
    ]),
  ]),
  page("ai/pull-request-generation", "Pull Request Generation", "AI Features", "Create pull request descriptions that maintainers can review quickly.", [
    section("Generated structure", [
      ul(["Summary", "Why this change is needed", "Implementation notes", "Test plan", "Linked issue", "Risks or follow-ups"]),
    ]),
  ]),
  page("pricing/free-plan", "Free Plan", "Pricing", "Start with GitHub login, skill analysis, and basic recommendations.", [
    section("Included", [
      ul(["GitHub Login", "Skill Analysis", "Follow 5 Repositories", "Issue Discovery", "Basic Contribution Dashboard", "20 AI Recommendations per month"]),
    ]),
    section("Best for", [p("The Free Plan is best for new users exploring Contribly, students, and developers making occasional open-source contributions.")]),
  ]),
  page("pricing/pro-plan", "Pro Plan", "Pricing", "Unlock unlimited recommendations and advanced AI contribution workflows.", [
    section("Included", [
      ul(["Unlimited AI Recommendations", "AI Contribution Copilot", "AI Issue Explanations", "Codebase Understanding", "AI Solution Review", "PR Description Generator", "Discord Notifications", "Advanced Analytics"]),
    ]),
    section("Best for", [p("Pro is best for active contributors who want faster issue understanding, stronger pull requests, and deeper analytics.")]),
  ]),
  page("pricing/team-plan", "Team Plan", "Pricing", "For maintainers and teams coordinating contribution workflows.", [
    section("Included", [
      ul(["Everything in Pro", "Contributor Matching", "Repository Analytics", "Contributor Insights", "Team Dashboard", "Maintainer Tools"]),
    ]),
    section("Best for", [p("Team is designed for maintainers, open-source programs, and engineering teams that want visibility into contributor activity and repository health.")]),
  ]),
  page("account/profile-settings", "Profile Settings", "Account", "Manage profile data shown in Contribly.", [
    section("Profile source", [
      p("Profile information comes from GitHub during login. Contribly stores your GitHub ID, username, avatar, name, and bio in Supabase."),
    ]),
    section("Refreshing your profile", [p("Sign out and sign back in with GitHub to refresh profile fields. Future account settings will add manual refresh controls.")]),
  ]),
  page("account/notifications", "Notifications", "Account", "Understand planned notification workflows.", [
    section("Notification types", [
      ul(["New matching issue", "Repository activity", "Pull request reminders", "Discord notifications for Pro users", "Team contributor insights"]),
    ]),
  ]),
  page("account/billing", "Billing", "Account", "Manage plan and billing status.", [
    section("Billing system", [
      p("Contribly uses Stripe Checkout for subscriptions and stores subscription state in Supabase. The app reads your plan from the profile table to show Upgrade, Pro, or Team badges."),
    ]),
    section("Webhook updates", [
      code("text", "Stripe Checkout -> Stripe subscription -> Webhook -> Supabase subscriptions -> Profile plan update"),
    ]),
  ]),
  page("account/subscription-management", "Subscription Management", "Account", "Upgrade, downgrade, or manage subscription state.", [
    section("Upgrade path", [
      { type: "steps", items: ["Click Upgrade.", "Choose Pro or Team.", "Complete Stripe Checkout.", "Stripe sends a webhook.", "Supabase updates your plan.", "The dashboard shows your new plan badge."] },
    ]),
  ]),
  page("faq/common-questions", "Common Questions", "FAQ", "Answers to common Contribly questions.", [
    section("Does Contribly write code for me?", [p("Contribly helps you understand issues, plan work, review solutions, and draft pull request descriptions. You remain responsible for the implementation and final submission.")]),
    section("Does Contribly replace maintainers?", [p("No. Maintainers still define project direction, review contributions, and decide what gets merged.")]),
    section("Can beginners use Contribly?", [p("Yes. Start with Beginner repositories and issue labels like good first issue or documentation.")]),
  ]),
  page("faq/troubleshooting", "Troubleshooting", "FAQ", "Common setup and runtime issues.", [
    section("GitHub login fails", [
      ul(["Confirm the GitHub OAuth callback URL is configured.", "Check AUTH_SECRET and GitHub client credentials.", "Make sure production AUTH_URL matches your deployed domain."]),
    ]),
    section("No recommendations appear", [
      ul(["Generate your AI Skill Profile.", "Follow at least one repository.", "Confirm the followed repository has open issues.", "Check GitHub API rate limits."]),
    ]),
    section("Billing does not update", [
      ul(["Confirm Stripe webhook signing secret.", "Check webhook endpoint URL.", "Apply Supabase billing migrations.", "Verify Stripe price IDs are configured."]),
    ]),
  ]),
  page("roadmap", "Roadmap", "Company", "Planned improvements for Contribly.", [
    section("Near term", [ul(["Issue detail pages", "AI issue explanation workspace", "Codebase indexing", "Stripe customer portal", "Discord notifications"])]),
    section("Later", [ul(["Maintainer dashboard", "Contributor matching", "Team analytics", "Repository health scoring", "Organization workspaces"])]),
  ]),
  page("changelog", "Changelog", "Company", "Product updates and release notes.", [
    section("June 2026", [
      ul(["Launched GitHub authentication with Auth.js.", "Added Supabase-backed skill profiles.", "Added Repository Explorer.", "Added AI Issue Recommendations.", "Added contribution analytics.", "Added pricing and billing foundation.", "Added documentation center."]),
    ]),
  ]),
  page("security", "Security", "Company", "How Contribly approaches product and data security.", [
    section("Data access", [
      p("Contribly requests GitHub access for authentication and contribution analysis. Service-role Supabase access is only used server-side. Secrets must never be exposed to browser code."),
    ]),
    section("Security practices", [
      ul(["Server-side Auth.js session checks", "Protected dashboard routes", "Supabase row-level security enabled on public tables", "Stripe webhook signature verification", "No service role key in client components"]),
    ]),
  ]),
  page("privacy", "Privacy", "Company", "What Contribly stores and why.", [
    section("Stored data", [
      ul(["GitHub profile basics", "Skill profile outputs", "Followed repositories", "Billing status", "Subscription events", "Contribution analytics derived from GitHub activity"]),
    ]),
    section("Use of AI", [
      p("Contribly sends selected GitHub and repository context to AI providers to generate skill profiles and recommendations. Do not paste private secrets into AI workflows."),
    ]),
  ]),
  page("terms", "Terms", "Company", "Terms for using Contribly.", [
    section("Product terms", [
      p("Contribly is provided as an AI-assisted productivity tool. Recommendations, explanations, and generated text should be reviewed before use. You are responsible for code you submit to repositories."),
    ]),
    section("Acceptable use", [
      ul(["Do not use Contribly to spam maintainers.", "Do not submit generated code you do not understand.", "Respect repository licenses and contribution guidelines.", "Do not upload secrets or private source code without authorization."]),
    ]),
  ]),
];

export const docsPageMap = new Map(docsPages.map((page) => [page.slug, page]));
export const flattenedDocsNav: DocsNavItem[] = docsNavigation.flatMap((group) =>
  group.items.map((item) => ({ title: item.title, slug: item.slug })),
);

export function getDocsPage(slug: string) {
  return docsPageMap.get(slug);
}

export function getDocsNeighbors(slug: string) {
  const ordered: DocsNavItem[] = [
    { title: "Docs Home", slug: "" },
    ...flattenedDocsNav,
  ];
  const index = ordered.findIndex((item) => item.slug === slug);

  return {
    previous: index > 0 ? ordered[index - 1] : null,
    next: index >= 0 && index < ordered.length - 1 ? ordered[index + 1] : null,
  };
}

function page(
  slug: string,
  title: string,
  category: string,
  description: string,
  sections: DocsSection[],
): DocsPage {
  return { slug, title, category, description, sections };
}

function section(title: string, blocks: DocsBlock[]): DocsSection {
  return {
    id: slugify(title),
    title,
    blocks,
  };
}

function p(text: string): DocsBlock {
  return { type: "p", text };
}

function ul(items: string[]): DocsBlock {
  return { type: "ul", items };
}

function code(language: string, value: string): DocsBlock {
  return { type: "code", language, value };
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
