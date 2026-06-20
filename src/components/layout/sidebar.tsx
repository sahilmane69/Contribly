import {
  BarChart3,
  Blocks,
  Bot,
  CircleDollarSign,
  GitPullRequest,
  Home,
  Settings,
  Sparkles,
  Users,
} from "lucide-react";

import { cn } from "@/lib/utils";

const navItems = [
  { label: "Overview", icon: Home, active: true },
  { label: "Contributions", icon: GitPullRequest },
  { label: "AI Review", icon: Bot },
  { label: "Rewards", icon: CircleDollarSign },
  { label: "Community", icon: Users },
  { label: "Analytics", icon: BarChart3 },
  { label: "Integrations", icon: Blocks },
  { label: "Settings", icon: Settings },
];

export function Sidebar() {
  return (
    <aside className="hidden h-screen w-64 shrink-0 border-r bg-background/58 backdrop-blur-xl lg:sticky lg:top-0 lg:flex lg:flex-col">
      <div className="flex h-16 items-center gap-3 px-4">
        <div className="flex size-9 items-center justify-center rounded-lg border bg-secondary">
          <Sparkles className="size-4 text-accent" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold leading-5">Contribly</p>
          <p className="text-xs text-muted-foreground">AI contribution OS</p>
        </div>
      </div>
      <nav className="flex flex-1 flex-col gap-1 px-3 py-3">
        {navItems.map((item) => (
          <a
            key={item.label}
            href="#"
            className={cn(
              "flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium text-muted-foreground transition hover:bg-secondary hover:text-foreground",
              item.active && "bg-secondary text-foreground shadow-sm",
            )}
          >
            <item.icon className="size-4" />
            {item.label}
          </a>
        ))}
      </nav>
      <div className="m-3 rounded-lg border bg-card/70 p-3">
        <p className="text-sm font-medium">Launch readiness</p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          UI foundation prepared for auth, data, and billing modules.
        </p>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-secondary">
          <div className="h-full w-2/3 rounded-full bg-accent" />
        </div>
      </div>
    </aside>
  );
}
