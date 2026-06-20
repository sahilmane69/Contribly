export type RepositoryDifficulty = "Beginner" | "Intermediate" | "Advanced";

export type CuratedRepository = {
  id: string;
  name: string;
  owner: string;
  fullName: string;
  logo: string;
  description: string;
  category: string;
  stars: number;
  language: string;
  difficulty: RepositoryDifficulty;
  openIssues: number;
  url: string;
};

export const curatedRepositories: CuratedRepository[] = [
  {
    id: "nextjs",
    name: "Next.js",
    owner: "vercel",
    fullName: "vercel/next.js",
    logo: "N",
    description:
      "The React framework for production apps, routing, rendering, and full-stack web experiences.",
    category: "Web Frameworks",
    stars: 131000,
    language: "TypeScript",
    difficulty: "Advanced",
    openIssues: 2700,
    url: "https://github.com/vercel/next.js",
  },
  {
    id: "supabase",
    name: "Supabase",
    owner: "supabase",
    fullName: "supabase/supabase",
    logo: "S",
    description:
      "Open-source Firebase alternative with Postgres, Auth, Storage, Realtime, and Edge Functions.",
    category: "Backend",
    stars: 89000,
    language: "TypeScript",
    difficulty: "Intermediate",
    openIssues: 520,
    url: "https://github.com/supabase/supabase",
  },
  {
    id: "shadcn-ui",
    name: "shadcn/ui",
    owner: "shadcn-ui",
    fullName: "shadcn-ui/ui",
    logo: "S",
    description:
      "Beautifully designed components that you can copy and customize for modern React apps.",
    category: "Design Systems",
    stars: 96000,
    language: "TypeScript",
    difficulty: "Beginner",
    openIssues: 760,
    url: "https://github.com/shadcn-ui/ui",
  },
  {
    id: "tailwindcss",
    name: "Tailwind CSS",
    owner: "tailwindlabs",
    fullName: "tailwindlabs/tailwindcss",
    logo: "T",
    description:
      "Utility-first CSS framework for rapidly building custom user interfaces.",
    category: "Design Systems",
    stars: 88000,
    language: "JavaScript",
    difficulty: "Intermediate",
    openIssues: 420,
    url: "https://github.com/tailwindlabs/tailwindcss",
  },
  {
    id: "astro",
    name: "Astro",
    owner: "withastro",
    fullName: "withastro/astro",
    logo: "A",
    description:
      "Content-driven web framework for fast sites, islands architecture, and flexible integrations.",
    category: "Web Frameworks",
    stars: 53000,
    language: "TypeScript",
    difficulty: "Intermediate",
    openIssues: 340,
    url: "https://github.com/withastro/astro",
  },
  {
    id: "storybook",
    name: "Storybook",
    owner: "storybookjs",
    fullName: "storybookjs/storybook",
    logo: "B",
    description:
      "Frontend workshop for building, testing, and documenting UI components in isolation.",
    category: "Developer Tools",
    stars: 87000,
    language: "TypeScript",
    difficulty: "Intermediate",
    openIssues: 2100,
    url: "https://github.com/storybookjs/storybook",
  },
  {
    id: "rustlings",
    name: "Rustlings",
    owner: "rust-lang",
    fullName: "rust-lang/rustlings",
    logo: "R",
    description:
      "Small exercises to get you used to reading and writing Rust code.",
    category: "Education",
    stars: 59000,
    language: "Rust",
    difficulty: "Beginner",
    openIssues: 180,
    url: "https://github.com/rust-lang/rustlings",
  },
  {
    id: "fastapi",
    name: "FastAPI",
    owner: "fastapi",
    fullName: "fastapi/fastapi",
    logo: "F",
    description:
      "High performance Python web framework for building APIs with type hints.",
    category: "Backend",
    stars: 84000,
    language: "Python",
    difficulty: "Intermediate",
    openIssues: 260,
    url: "https://github.com/fastapi/fastapi",
  },
  {
    id: "zod",
    name: "Zod",
    owner: "colinhacks",
    fullName: "colinhacks/zod",
    logo: "Z",
    description:
      "TypeScript-first schema validation with static type inference.",
    category: "Developer Tools",
    stars: 38000,
    language: "TypeScript",
    difficulty: "Beginner",
    openIssues: 480,
    url: "https://github.com/colinhacks/zod",
  },
];

export const repositoryCategories = Array.from(
  new Set(curatedRepositories.map((repo) => repo.category)),
);

export const repositoryLanguages = Array.from(
  new Set(curatedRepositories.map((repo) => repo.language)),
);

export const repositoryDifficulties: RepositoryDifficulty[] = [
  "Beginner",
  "Intermediate",
  "Advanced",
];
