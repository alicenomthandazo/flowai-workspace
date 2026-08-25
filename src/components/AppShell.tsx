import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Mail,
  FileText,
  CalendarCheck,
  Settings as SettingsIcon,
  Menu,
  Moon,
  Sun,
  Sparkles,
  X,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useApp, setPrefs } from "@/lib/store";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/email", label: "Email Generator", icon: Mail },
  { to: "/meetings", label: "Meeting Notes", icon: FileText },
  { to: "/tasks", label: "Task Planner", icon: CalendarCheck },
  { to: "/settings", label: "Settings", icon: SettingsIcon },
] as const;

function ThemeToggle() {
  const theme = useApp((s) => s.prefs.theme);
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      onClick={() => setPrefs({ theme: theme === "dark" ? "light" : "dark" })}
    >
      {theme === "dark" ? <Sun className="size-5" /> : <Moon className="size-5" />}
    </Button>
  );
}

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav aria-label="Main" className="flex flex-col gap-1">
      {nav.map(({ to, label, icon: Icon }) => {
        const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
        return (
          <Link
            key={to}
            to={to}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground",
            )}
          >
            <Icon className="size-4.5 shrink-0" aria-hidden />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

function Brand() {
  return (
    <Link to="/" className="flex items-center gap-2.5 px-1 py-1">
      <span className="brand-gradient flex size-9 items-center justify-center rounded-xl text-primary-foreground shadow-soft">
        <Sparkles className="size-5" aria-hidden />
      </span>
      <span className="font-display text-[15px] leading-tight font-bold">
        AI Productivity
        <span className="block text-xs font-medium text-muted-foreground">Assistant workspace</span>
      </span>
    </Link>
  );
}

export function AppShell({
  title,
  description,
  breadcrumb,
  actions,
  children,
}: {
  title: string;
  description?: string;
  breadcrumb?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background lg:flex">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col gap-6 border-r border-sidebar-border bg-sidebar p-4 lg:flex">
        <Brand />
        <NavLinks />
        <div className="mt-auto rounded-xl bg-muted/70 p-3 text-xs text-muted-foreground">
          Everything you create is stored privately in this browser. No account needed.
        </div>
      </aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label="Close navigation"
            className="absolute inset-0 bg-foreground/40"
            onClick={() => setOpen(false)}
          />
          <div className="relative flex h-full w-72 max-w-[85vw] flex-col gap-6 border-r border-sidebar-border bg-sidebar p-4">
            <div className="flex items-center justify-between">
              <Brand />
              <Button variant="ghost" size="icon" aria-label="Close navigation" onClick={() => setOpen(false)}>
                <X className="size-5" />
              </Button>
            </div>
            <NavLinks onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 flex items-center gap-3 border-b border-border bg-background/85 px-4 py-3 backdrop-blur md:px-8">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label="Open navigation"
            onClick={() => setOpen(true)}
          >
            <Menu className="size-5" />
          </Button>
          <div className="min-w-0 flex-1">
            {breadcrumb && (
              <p className="truncate text-xs font-medium text-muted-foreground">{breadcrumb}</p>
            )}
            <h1 className="truncate text-lg font-bold md:text-xl">{title}</h1>
          </div>
          <div className="flex items-center gap-2">
            {actions}
            <ThemeToggle />
          </div>
        </header>
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 md:px-8 md:py-8">
          {description && <p className="mb-6 max-w-2xl text-sm text-muted-foreground">{description}</p>}
          {children}
        </main>
      </div>
    </div>
  );
}
