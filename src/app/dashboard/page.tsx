import Image from "next/image";
import { redirect } from "next/navigation";

import { auth } from "../../../auth";
import { signOutUser } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  const avatar = session.user.avatar ?? session.user.image;

  return (
    <main className="min-h-screen bg-background px-4 py-24 text-foreground">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Dashboard</p>
            <h1 className="text-4xl font-semibold tracking-normal">
              Welcome back, {session.user.name ?? session.user.username}
            </h1>
          </div>
          <form action={signOutUser}>
            <Button type="submit" variant="outline">
              Sign out
            </Button>
          </form>
        </div>

        <Card className="bg-card">
          <CardHeader>
            <CardTitle>GitHub profile</CardTitle>
            <CardDescription>
              This data is stored in Supabase when you authenticate with GitHub.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-4">
            {avatar ? (
              <Image
                src={avatar}
                alt={session.user.name ?? "GitHub avatar"}
                width={64}
                height={64}
                className="rounded-full"
              />
            ) : null}
            <div className="text-sm">
              <p className="font-medium">{session.user.name ?? "Unnamed user"}</p>
              <p className="text-muted-foreground">
                @{session.user.username ?? "github-user"}
              </p>
              <p className="text-muted-foreground">GitHub ID: {session.user.githubId}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
