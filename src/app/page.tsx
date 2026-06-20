import {
  ArrowRight,
  BookOpen,
  Check,
  GitPullRequest,
  Search,
  Sparkles,
} from "lucide-react";

import { AsciiBackground } from "@/components/ascii-background";
import { LandingNavbar } from "@/components/landing-navbar";
import { signInWithGitHub } from "@/app/actions/auth";
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
            <form action={signInWithGitHub}>
              <Button type="submit" className="h-11 px-5">
                <GithubMark className="size-4" />
                Login with GitHub
              </Button>
            </form>
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

      <section id="pricing" className="relative z-10 mx-auto w-full max-w-4xl px-4 py-24 text-center md:px-6">
        <Sparkles className="mx-auto size-7" />
        <h2 className="mt-6 text-4xl font-semibold leading-tight tracking-normal md:text-6xl">
          Make open source feel welcoming again.
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-muted-foreground">
          Start with GitHub, find a real issue, and contribute with confidence.
        </p>
        <form id="signin" action={signInWithGitHub} className="mt-8">
          <Button type="submit" className="h-11 px-5">
            <GithubMark className="size-4" />
            Login with GitHub
          </Button>
        </form>
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

function Footer() {
  return (
    <footer className="relative z-10 border-t px-4 py-8 md:px-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
        <p className="font-medium text-foreground">Contribly</p>
        <p>Find. Contribute. Merge.</p>
        <p>Made for open-source builders.</p>
      </div>
    </footer>
  );
}
