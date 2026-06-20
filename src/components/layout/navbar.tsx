import { Bell, Command, Menu, Search, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Navbar() {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b bg-background/70 px-4 backdrop-blur-xl md:px-6">
      <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
        <Menu className="size-4" />
      </Button>
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <div className="relative hidden w-full max-w-md md:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search contributors, issues, rewards..." />
        </div>
        <div className="flex items-center gap-2 lg:hidden">
          <div className="flex size-9 items-center justify-center rounded-lg border bg-secondary">
            <Sparkles className="size-4 text-accent" />
          </div>
          <span className="text-sm font-semibold">Contribly</span>
        </div>
      </div>
      <Button variant="outline" size="sm" className="hidden md:inline-flex">
        <Command className="size-4" />
        Command
      </Button>
      <Button variant="ghost" size="icon" aria-label="Notifications">
        <Bell className="size-4" />
      </Button>
      <div className="flex size-9 items-center justify-center rounded-md border bg-secondary text-sm font-semibold">
        SM
      </div>
    </header>
  );
}
