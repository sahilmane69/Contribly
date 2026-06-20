import * as React from "react";
import { ChartNoAxesCombined, GitBranch, LayoutDashboard, MessageSquareText } from "lucide-react";

import { Dock, DockIcon } from "@/components/magicui/dock";
import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background/35">
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="min-w-0 flex-1">
          <Navbar />
          <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 pb-24 md:px-6">
            {children}
          </main>
        </div>
      </div>
      <Dock>
        <DockIcon label="Dashboard">
          <LayoutDashboard className="size-4" />
        </DockIcon>
        <DockIcon label="Branches">
          <GitBranch className="size-4" />
        </DockIcon>
        <DockIcon label="Insights">
          <ChartNoAxesCombined className="size-4" />
        </DockIcon>
        <DockIcon label="Messages">
          <MessageSquareText className="size-4" />
        </DockIcon>
      </Dock>
    </div>
  );
}
