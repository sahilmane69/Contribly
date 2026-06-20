import Image from "next/image";
import { redirect } from "next/navigation";
import { BarChart3, Code2, GitPullRequest, Sparkles } from "lucide-react";

import { auth } from "../../../auth";
import { generateOnboardingProfile } from "@/app/actions/onboarding";
import { signOutUser } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const fetchItems = [
  { icon: Code2, label: "Repositories" },
  { icon: BarChart3, label: "Languages" },
  { icon: GitPullRequest, label: "Pull Requests" },
  { icon: Sparkles, label: "Contributions" },
];

export default async function OnboardingPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  const avatar = session.user.avatar ?? session.user.image;

  return (
    <main className="min-h-screen bg-background px-4 py-24 text-foreground">
      <div className="mx-auto grid max-w-5xl gap-5 lg:grid-cols-[0.85fr_1.15fr]">
        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="text-3xl">Welcome to Contribly</CardTitle>
            <CardDescription>
              We will analyze your public GitHub activity and create your AI
              open-source skill profile.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <div className="flex items-center gap-4 rounded-md border bg-background/50 p-4">
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
                <p className="font-medium">
                  {session.user.name ?? session.user.username}
                </p>
                <p className="text-sm text-muted-foreground">
                  @{session.user.username ?? "github-user"}
                </p>
                {session.user.bio ? (
                  <p className="mt-2 text-sm text-muted-foreground">
                    {session.user.bio}
                  </p>
                ) : null}
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <form action={generateOnboardingProfile}>
                <Button type="submit">Generate AI profile</Button>
              </form>
              <form action={signOutUser}>
                <Button type="submit" variant="outline">
                  Sign out
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 sm:grid-cols-2">
          {fetchItems.map((item) => (
            <Card key={item.label} className="bg-card">
              <CardHeader>
                <div className="mb-4 flex size-10 items-center justify-center rounded-md border bg-secondary">
                  <item.icon className="size-5" />
                </div>
                <CardTitle>{item.label}</CardTitle>
                <CardDescription>
                  Used to infer your skills, technologies, and contribution
                  interests.
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
