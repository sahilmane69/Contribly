import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Check,
  ChevronRight,
  GitPullRequest,
  Search,
  Sparkles,
} from "lucide-react";

import { AsciiBackground } from "@/components/ascii-background";
import { LandingNavbar } from "@/components/landing-navbar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const features = [
  {
    icon: Search,
    title: "Find better issues",
    description:
      "Discover active projects and beginner-friendly issues that actually match your skills.",
  },
  {
    icon: BookOpen,
    title: "Understand faster",
    description:
      "Get a simple explanation of the repo, setup steps, and what the maintainers expect.",
  },
  {
    icon: GitPullRequest,
    title: "Open cleaner PRs",
    description:
      "Move from idea to pull request with a focused plan and a calmer contribution flow.",
  },
];

const steps = ["Connect GitHub", "Pick a project", "Contribute with context"];

const faqs = [
  {
    question: "Is Contribly only for beginners?",
    answer:
      "No. Beginners can use it to find approachable issues, while experienced developers can use it to filter projects, understand codebases faster, and prepare cleaner pull requests.",
  },
  {
    question: "Does Contribly replace GitHub?",
    answer:
      "Contribly works beside GitHub. It helps with discovery, context, recommendations, and contribution prep, then sends you back to GitHub to review issues and open pull requests.",
  },
  {
    question: "What does the AI analyze?",
    answer:
      "It looks at your GitHub profile, public repositories, languages, pull request activity, followed repositories, and open issues to recommend work that fits your skills.",
  },
  {
    question: "Can I use it with any repository?",
    answer:
      "You can search and follow curated repositories today. The product is designed to expand toward broader GitHub repository discovery and deeper codebase understanding.",
  },
];

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-transparent text-foreground">
      <AsciiBackground />
      <LandingNavbar />
      <section className="relative z-10 mx-auto flex min-h-[92vh] w-full max-w-5xl flex-col items-center justify-center px-4 pb-20 pt-32 text-center md:px-6 md:pb-28 md:pt-40">
        <div className="flex flex-col items-center">
          <h1 className="max-w-4xl text-5xl font-semibold leading-none tracking-normal md:text-7xl">
            Find. Contribute. Merge.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            AI-powered Open Source Copilot that helps developers discover,
            understand and contribute to open-source projects faster.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild className="h-11 px-5">
              <a href="/sign-in/github">
                <GithubMark className="size-4" />
                Login with GitHub
              </a>
            </Button>
            <Button asChild variant="outline" className="h-11 px-5">
              <a href="#about">
                Explore features
                <ArrowRight className="size-4" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      <section id="about" className="relative z-10 mx-auto w-full max-w-7xl px-4 py-20 md:px-6">
        <SectionTitle
          title="Simple tools for your next contribution."
          description="Contribly keeps the experience small, useful, and friendly."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} className="bg-card">
              <CardHeader>
                <div className="mb-4 flex size-10 items-center justify-center rounded-md border bg-secondary">
                  <feature.icon className="size-5" />
                </div>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section id="docs" className="relative z-10 mx-auto w-full max-w-7xl px-4 py-20 md:px-6">
        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="text-3xl md:text-4xl">
              How Contribly works
            </CardTitle>
            <CardDescription>
              A short path from curiosity to contribution.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-3">
              {steps.map((step, index) => (
                <div key={step} className="rounded-md border bg-background/50 p-4">
                  <div className="mb-5 flex items-center justify-between">
                    <span className="font-mono text-sm text-muted-foreground">
                      0{index + 1}
                    </span>
                    <Check className="size-4 text-muted-foreground" />
                  </div>
                  <p className="font-medium">{step}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <section id="pricing" className="relative z-10 px-4 py-24 md:px-6">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-lg border bg-black/72 shadow-[0_30px_120px_rgba(0,0,0,0.42)] backdrop-blur">
          <div className="border-b px-4 py-3 font-mono text-xs text-white/35">
            {">"} contribly run --from-issue --to-merge
          </div>
          <div className="grid gap-8 p-6 md:grid-cols-[1.1fr_0.9fr] md:p-10">
            <div>
              <Sparkles className="size-7" />
              <h2 className="mt-6 max-w-3xl text-4xl font-semibold leading-tight tracking-normal md:text-6xl">
                Make open source feel welcoming again.
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground">
                Start with GitHub, find a real issue, understand the codebase,
                and contribute with confidence.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild className="h-11 px-5">
                  <a id="signin" href="/sign-in/github">
                    <GithubMark className="size-4" />
                    Login with GitHub
                  </a>
                </Button>
                <Button asChild variant="outline" className="h-11 px-5">
                  <Link href="/docs">
                    Read docs
                    <ChevronRight className="size-4" />
                  </Link>
                </Button>
              </div>
            </div>
            <AsciiPanel />
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto w-full max-w-7xl px-4 py-20 md:px-6">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="font-mono text-sm text-muted-foreground">FAQ</p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-normal md:text-5xl">
              Questions before your first contribution?
            </h2>
            <p className="mt-4 max-w-md text-sm leading-6 text-muted-foreground">
              A quick pass through how Contribly fits into your existing GitHub
              workflow.
            </p>
          </div>
          <div className="grid gap-3">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-lg border bg-card/72 p-5 backdrop-blur"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium [&::-webkit-details-marker]:hidden">
                  {faq.question}
                  <span className="text-muted-foreground transition group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-4 text-sm leading-6 text-muted-foreground">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function SectionTitle({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-2xl">
      <h2 className="text-3xl font-semibold leading-tight tracking-normal md:text-5xl">
        {title}
      </h2>
      <p className="mt-4 text-base leading-7 text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

function GithubMark({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
    >
      <path d="M12 0C5.37 0 0 5.5 0 12.28c0 5.43 3.44 10.03 8.21 11.66.6.11.82-.27.82-.59 0-.29-.01-1.06-.02-2.08-3.34.74-4.04-1.65-4.04-1.65-.55-1.42-1.33-1.8-1.33-1.8-1.09-.76.08-.74.08-.74 1.2.09 1.84 1.27 1.84 1.27 1.07 1.88 2.81 1.34 3.49 1.02.11-.79.42-1.34.76-1.65-2.67-.31-5.47-1.37-5.47-6.1 0-1.35.47-2.45 1.24-3.31-.12-.31-.54-1.57.12-3.27 0 0 1.01-.33 3.3 1.27A11.25 11.25 0 0 1 12 5.9c1.02 0 2.04.14 3 .41 2.29-1.6 3.3-1.27 3.3-1.27.66 1.7.24 2.96.12 3.27.77.86 1.24 1.96 1.24 3.31 0 4.75-2.81 5.78-5.49 6.09.43.38.81 1.13.81 2.28 0 1.65-.02 2.98-.02 3.38 0 .33.22.71.83.59A12.25 12.25 0 0 0 24 12.28C24 5.5 18.63 0 12 0Z" />
    </svg>
  );
}

function AsciiPanel() {
  return (
    <div className="relative min-h-[300px] overflow-hidden rounded-lg border bg-[#050505] p-5 font-mono text-xs leading-5 text-white/28">
      <pre aria-hidden="true" className="whitespace-pre-wrap">
{`....::::----====++++****####%%%%
:::----====++++****####%%%%@@@@
----====++++    contribly    ###
====++++****   skill -> issue  %%
+++****####    issue -> pr     @@
****####%%%%   pr -> merge     %%
####%%%%@@@@****++++====----::::
%%%%@@@@####****++++====----....
`}
      </pre>
      <div className="absolute inset-x-5 bottom-5 rounded-md border bg-black/80 p-4">
        <p className="text-white">AI contribution path</p>
        <div className="mt-3 grid gap-2 text-white/55">
          <p>01 analyze GitHub profile</p>
          <p>02 follow repositories</p>
          <p>03 match open issues</p>
          <p>04 ship a clearer pull request</p>
        </div>
      </div>
    </div>
  );
}

function Footer() {
  const columns = [
    {
      title: "Product",
      links: [
        ["Features", "#about"],
        ["How it works", "#docs"],
        ["Pricing", "/pricing"],
        ["Dashboard", "/dashboard"],
      ],
    },
    {
      title: "Docs",
      links: [
        ["Quick Start", "/docs/getting-started/quick-start"],
        ["AI Matching", "/docs/ai/how-ai-matching-works"],
        ["Security", "/docs/security"],
        ["Changelog", "/docs/changelog"],
      ],
    },
    {
      title: "Company",
      links: [
        ["Roadmap", "/docs/roadmap"],
        ["Privacy", "/docs/privacy"],
        ["Terms", "/docs/terms"],
        ["GitHub Login", "/sign-in/github"],
      ],
    },
  ];

  return (
    <footer className="relative z-10 border-t bg-black/55 px-4 py-10 md:px-6">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.15fr_1fr]">
        <div>
          <div className="overflow-hidden rounded-lg border bg-[#050505]">
            <div className="border-b px-4 py-3 font-mono text-xs text-white/35">
              {">"} footer.render(ascii=true)
            </div>
            <pre className="p-4 font-mono text-[11px] leading-4 text-white/22 md:text-xs md:leading-5">
{`   ______          __        _ __    __
  / ____/___  ____/ /_____  (_) /_  / /_  __
 / /   / __ \\/ __  / ___/ / / __ \\/ / / / /
/ /___/ /_/ / /_/ / /  / / / /_/ / / /_/ /
\\____/\\____/\\__,_/_/  /_/_/_.___/_/\\__, /
                                  /____/
find . contribute . merge`}
            </pre>
          </div>
          <p className="mt-5 max-w-xl text-sm leading-6 text-muted-foreground">
            Contribly helps developers move from curiosity to contribution with
            GitHub-powered skill analysis, repository discovery, AI issue
            matching, and contribution analytics.
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-3">
          {columns.map((column) => (
            <div key={column.title}>
              <p className="font-mono text-xs uppercase text-white/45">
                {column.title}
              </p>
              <div className="mt-4 grid gap-3 text-sm">
                {column.links.map(([label, href]) => (
                  <a
                    key={label}
                    href={href}
                    className="text-muted-foreground transition hover:text-foreground"
                  >
                    {label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mx-auto mt-10 flex max-w-7xl flex-col gap-3 border-t pt-6 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
        <p>© 2026 Contribly. Built for open-source builders.</p>
        <p className="font-mono">status: online · mode: dark · output: merge</p>
      </div>
    </footer>
  );
}
