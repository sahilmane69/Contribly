import Image from "next/image";
import { redirect } from "next/navigation";

import { auth } from "../../../auth";
import { signOutUser } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function OnboardingPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  const avatar = session.user.avatar ?? session.user.image;

  return (
    <main className="min-h-screen bg-background px-4 py-24 text-foreground">
      <Card className="mx-auto max-w-2xl bg-card">
        <CardHeader>
          <CardTitle className="text-3xl">Welcome to Contribly</CardTitle>
          <CardDescription>
            Your GitHub profile is connected. Finish onboarding to personalize
            your open-source recommendations.
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
              <p className="font-medium">{session.user.name ?? session.user.username}</p>
              <p className="text-sm text-muted-foreground">
                @{session.user.username ?? "github-user"}
              </p>
              {session.user.bio ? (
                <p className="mt-2 text-sm text-muted-foreground">{session.user.bio}</p>
              ) : null}
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild>
              <a href="/dashboard">Continue to dashboard</a>
            </Button>
            <form action={signOutUser}>
              <Button type="submit" variant="outline">
                Sign out
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
