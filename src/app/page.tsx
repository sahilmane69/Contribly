import {
  ArrowUpRight,
  Bot,
  CheckCircle2,
  CircleDollarSign,
  GitPullRequest,
  ShieldCheck,
  Sparkles,
  Timer,
  Users,
} from "lucide-react";

import { DashboardShell } from "@/components/layout/dashboard-shell";
import { AnimatedGradientText } from "@/components/magicui/animated-gradient-text";
import { BentoCard, BentoGrid } from "@/components/magicui/bento-grid";
import { BlurFade } from "@/components/magicui/blur-fade";
import { BorderBeam } from "@/components/magicui/border-beam";
import { Marquee } from "@/components/magicui/marquee";
import { NumberTicker } from "@/components/magicui/number-ticker";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const stats = [
  { label: "Merged contributions", value: 1284, icon: GitPullRequest },
  { label: "Active contributors", value: 428, icon: Users },
  { label: "Reward pool", value: 84600, icon: CircleDollarSign },
  { label: "AI reviews", value: 912, icon: Bot },
];

const activity = [
  "Priya merged oauth cleanup",
  "Mateo earned 420 points",
  "AI review flagged flaky tests",
  "Design system task funded",
  "Nora joined frontend guild",
];

export default function Home() {
  return (
    <DashboardShell>
      <BlurFade>
        <section className="relative overflow-hidden rounded-lg border bg-card/60 p-5 shadow-2xl backdrop-blur-xl md:p-7">
          <BorderBeam />
          <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
                <Sparkles className="size-4 text-accent" />
                AI-native contributor operations
              </div>
              <h1 className="text-4xl font-semibold leading-tight tracking-normal md:text-6xl">
                Build, reward, and scale open collaboration with{" "}
                <AnimatedGradientText>Contribly</AnimatedGradientText>.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
                A premium SaaS foundation for contribution tracking, AI review
                assistance, reward workflows, and community intelligence.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button>
                Configure workspace
                <ArrowUpRight className="size-4" />
              </Button>
              <Button variant="outline">View roadmap</Button>
            </div>
          </div>
        </section>
      </BlurFade>

      <BlurFade delay={90}>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardHeader className="flex-row items-center justify-between gap-3 pb-2">
                <CardTitle className="text-sm text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <stat.icon className="size-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="font-mono text-3xl font-semibold tracking-normal">
                  <NumberTicker value={stat.value} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </BlurFade>

      <BlurFade delay={140}>
        <BentoGrid>
          <BentoCard className="lg:col-span-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Contribution flow</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-normal">
                  Review velocity without losing quality.
                </h2>
              </div>
              <Badge variant="outline">Live preview</Badge>
            </div>
            <div className="mt-6 grid gap-3 md:grid-cols-3">
              {["Intake", "AI signal", "Reward"].map((item, index) => (
                <div key={item} className="rounded-lg border bg-background/35 p-4">
                  <div className="mb-4 flex size-9 items-center justify-center rounded-md bg-secondary">
                    {index === 0 ? (
                      <GitPullRequest className="size-4 text-accent" />
                    ) : index === 1 ? (
                      <Bot className="size-4 text-accent" />
                    ) : (
                      <CircleDollarSign className="size-4 text-accent" />
                    )}
                  </div>
                  <p className="font-medium">{item}</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Structured UI states ready for future product logic.
                  </p>
                </div>
              ))}
            </div>
          </BentoCard>

          <BentoCard className="lg:col-span-2">
            <p className="text-sm text-muted-foreground">Health score</p>
            <div className="mt-3 flex items-end gap-2">
              <span className="font-mono text-5xl font-semibold">94</span>
              <span className="pb-2 text-sm text-muted-foreground">/100</span>
            </div>
            <div className="mt-6 flex flex-col gap-3">
              {[
                [ShieldCheck, "Security review ready"],
                [Timer, "Median review time 2.4h"],
                [CheckCircle2, "Reward policy aligned"],
              ].map(([Icon, label]) => (
                <div key={String(label)} className="flex items-center gap-3 text-sm">
                  <Icon className="size-4 text-accent" />
                  <span>{label as string}</span>
                </div>
              ))}
            </div>
          </BentoCard>

          <BentoCard className="lg:col-span-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm text-muted-foreground">Community pulse</p>
                <h2 className="mt-1 text-xl font-semibold tracking-normal">
                  Recent workspace activity
                </h2>
              </div>
              <Badge>Synced</Badge>
            </div>
            <Marquee>
              {activity.map((item) => (
                <div
                  key={item}
                  className="flex min-w-64 items-center gap-3 rounded-lg border bg-background/35 px-4 py-3 text-sm"
                >
                  <span className="size-2 rounded-full bg-accent" />
                  {item}
                </div>
              ))}
            </Marquee>
          </BentoCard>
        </BentoGrid>
      </BlurFade>
    </DashboardShell>
  );
}
