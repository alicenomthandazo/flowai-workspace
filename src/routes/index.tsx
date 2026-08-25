import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, FileText, CalendarCheck, CheckCircle2, Clock, ArrowRight } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — AI Productivity Assistant" },
      {
        name: "description",
        content:
          "One AI workspace to write emails, summarize meetings, extract action items and build your daily schedule.",
      },
      { property: "og:title", content: "Dashboard — AI Productivity Assistant" },
      {
        property: "og:description",
        content: "Write smarter. Summarize meetings. Plan your day — in one AI workspace.",
      },
    ],
  }),
  component: Dashboard,
});

const features = [
  {
    to: "/email" as const,
    icon: Mail,
    title: "Smart Email Generator",
    description: "Generate professional emails in seconds using AI.",
    cta: "Open Email Generator",
  },
  {
    to: "/meetings" as const,
    icon: FileText,
    title: "Meeting Notes Summarizer",
    description:
      "Turn long meeting notes into summaries, decisions, action items and deadlines.",
    cta: "Summarize Meeting",
  },
  {
    to: "/tasks" as const,
    icon: CalendarCheck,
    title: "AI Task Planner",
    description: "Turn your tasks into an intelligent daily or weekly schedule.",
    cta: "Plan My Tasks",
  },
];

function Dashboard() {
  const tasks = useApp((s) => s.tasks);
  const emails = useApp((s) => s.emails);
  const meetings = useApp((s) => s.meetings);
  const schedule = useApp((s) => s.schedule);
  const open = tasks.filter((t) => !t.completed);

  const stats = [
    { label: "Open tasks", value: open.length, icon: CheckCircle2 },
    { label: "Meetings summarized", value: meetings.length, icon: FileText },
    { label: "Saved emails", value: emails.length, icon: Mail },
    {
      label: "Scheduled blocks",
      value: schedule?.blocks.filter((b) => b.kind === "task").length ?? 0,
      icon: Clock,
    },
  ];

  return (
    <AppShell title="Dashboard" breadcrumb="Workspace">
      <section className="surface brand-gradient mb-8 overflow-hidden p-7 text-primary-foreground md:p-10">
        <h2 className="font-display text-2xl font-extrabold md:text-4xl">AI Productivity Assistant</h2>
        <p className="mt-2 max-w-xl text-sm opacity-90 md:text-base">
          Write smarter. Summarize meetings. Plan your day.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild variant="secondary">
            <Link to="/meetings">Start with meeting notes</Link>
          </Button>
          <Button asChild variant="outline" className="border-primary-foreground/40 bg-transparent hover:bg-primary-foreground/10">
            <Link to="/tasks">Plan my day</Link>
          </Button>
        </div>
      </section>

      <div className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="surface p-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Icon className="size-4" aria-hidden />
              <span className="text-xs font-medium">{label}</span>
            </div>
            <p className="mt-2 font-display text-2xl font-bold">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {features.map(({ to, icon: Icon, title, description, cta }) => (
          <article key={to} className="surface flex flex-col p-6 transition-shadow hover:shadow-lift">
            <span className="mb-4 flex size-11 items-center justify-center rounded-xl bg-accent text-accent-foreground">
              <Icon className="size-5.5" aria-hidden />
            </span>
            <h3 className="text-base font-bold">{title}</h3>
            <p className="mt-2 flex-1 text-sm text-muted-foreground">{description}</p>
            <Button asChild className="mt-5 w-full">
              <Link to={to}>
                {cta} <ArrowRight className="size-4" aria-hidden />
              </Link>
            </Button>
          </article>
        ))}
      </div>

      <section className="surface mt-8 p-6">
        <h3 className="text-base font-bold">How the tools work together</h3>
        <ol className="mt-4 grid gap-3 text-sm text-muted-foreground md:grid-cols-3">
          <li className="rounded-lg bg-muted/60 p-4">
            <span className="font-semibold text-foreground">1. Meeting notes → tasks</span>
            <p className="mt-1">Summarize a meeting and push every action item into the planner.</p>
          </li>
          <li className="rounded-lg bg-muted/60 p-4">
            <span className="font-semibold text-foreground">2. Tasks → schedule</span>
            <p className="mt-1">AI arranges tasks around your working hours, breaks and deadlines.</p>
          </li>
          <li className="rounded-lg bg-muted/60 p-4">
            <span className="font-semibold text-foreground">3. Anything → email</span>
            <p className="mt-1">Draft follow-ups from a meeting or an email from any single task.</p>
          </li>
        </ol>
      </section>
    </AppShell>
  );
}
