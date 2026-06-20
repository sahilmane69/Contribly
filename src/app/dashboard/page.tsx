import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "../../../auth";
import { signOutUser } from "@/app/actions/auth";
import { BentoCard, BentoGrid } from "@/components/magicui/bento-grid";
import { NumberTicker } from "@/components/magicui/number-ticker";
import { AnimatedProgress } from "@/components/ui/animated-progress";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getSkillProfile } from "@/lib/supabase-admin";

type StoredSkill = {
  name: string;
  level: number;
  evidence: string;
};

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.githubId) {
    redirect("/");
  }

  const avatar = session.user.avatar ?? session.user.image;
  const profile = await getSkillProfile(session.user.githubId);

  if (!profile) {
    return (
      <main className="min-h-screen bg-background px-4 py-24 text-foreground">
        <Card className="mx-auto max-w-2xl bg-card">
          <CardHeader>
            <CardTitle>Your AI profile is not ready yet</CardTitle>
            <CardDescription>
              Generate your profile from onboarding to see skills, expertise,
              technologies, and interest categories.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/onboarding">Go to onboarding</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  const skills = (profile.skills ?? []) as StoredSkill[];
  const technologies = (profile.technologies ?? []) as string[];
  const interestCategories = (profile.interest_categories ?? []) as string[];

  return (
    <main className="min-h-screen bg-background px-4 py-20 text-foreground">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            {avatar ? (
              <Image
                src={avatar}
                alt={session.user.name ?? "GitHub avatar"}
                width={56}
                height={56}
                className="rounded-full"
              />
            ) : null}
            <div>
              <p className="text-sm text-muted-foreground">AI Skill Profile</p>
              <h1 className="text-4xl font-semibold tracking-normal">
                {session.user.name ?? session.user.username}
              </h1>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild>
              <Link href="/repositories">Explore repositories</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/recommendations">AI issue matches</Link>
            </Button>
            <form action={signOutUser}>
              <Button type="submit" variant="outline">
                Sign out
              </Button>
            </form>
          </div>
        </div>

        <BentoGrid>
          <BentoCard className="lg:col-span-2">
            <p className="text-sm text-muted-foreground">Expertise score</p>
            <div className="mt-3 flex items-end gap-2">
              <span className="font-mono text-6xl font-semibold">
                <NumberTicker value={profile.expertise_score ?? 0} />
              </span>
              <span className="pb-2 text-muted-foreground">/100</span>
            </div>
            <AnimatedProgress value={profile.expertise_score ?? 0} className="mt-6" />
          </BentoCard>

          <BentoCard className="lg:col-span-4">
            <p className="text-sm text-muted-foreground">Summary</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-normal">
              Contribution profile
            </h2>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-muted-foreground">
              {profile.summary}
            </p>
          </BentoCard>

          <BentoCard className="lg:col-span-3">
            <h2 className="text-xl font-semibold tracking-normal">Skills</h2>
            <div className="mt-5 flex flex-col gap-4">
              {skills.map((skill) => (
                <div key={skill.name}>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <p className="font-medium">{skill.name}</p>
                    <span className="font-mono text-sm text-muted-foreground">
                      {skill.level}
                    </span>
                  </div>
                  <AnimatedProgress value={skill.level} />
                  <p className="mt-2 text-xs leading-5 text-muted-foreground">
                    {skill.evidence}
                  </p>
                </div>
              ))}
            </div>
          </BentoCard>

          <BentoCard className="lg:col-span-3">
            <h2 className="text-xl font-semibold tracking-normal">Technologies</h2>
            <div className="mt-5 flex flex-wrap gap-2">
              {technologies.map((technology) => (
                <span
                  key={technology}
                  className="rounded-md border bg-background/50 px-3 py-2 text-sm"
                >
                  {technology}
                </span>
              ))}
            </div>
            <h2 className="mt-8 text-xl font-semibold tracking-normal">
              Interest categories
            </h2>
            <div className="mt-5 flex flex-wrap gap-2">
              {interestCategories.map((category) => (
                <span
                  key={category}
                  className="rounded-md border bg-secondary px-3 py-2 text-sm"
                >
                  {category}
                </span>
              ))}
            </div>
          </BentoCard>
        </BentoGrid>
      </div>
    </main>
  );
}
