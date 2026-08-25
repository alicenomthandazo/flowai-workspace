import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Moon, Sun, Trash2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useApp, setPrefs, clearAllData } from "@/lib/store";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — AI Productivity Assistant" },
      {
        name: "description",
        content: "Set your appearance, default working hours, breaks and manage locally stored data.",
      },
      { property: "og:title", content: "Settings — AI Productivity Assistant" },
      {
        property: "og:description",
        content: "Appearance, scheduling defaults and local data controls for your AI workspace.",
      },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const prefs = useApp((s) => s.prefs);
  const counts = useApp((s) => ({
    tasks: s.tasks.length,
    emails: s.emails.length,
    meetings: s.meetings.length,
  }));
  const [confirm, setConfirm] = useState(false);

  return (
    <AppShell title="Settings" breadcrumb="Workspace / Settings">
      <div className="grid gap-6">
        <section className="surface p-6">
          <h2 className="text-base font-bold">Appearance</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Your theme preference is saved in this browser.
          </p>
          <div className="mt-4 flex gap-3">
            <Button
              variant={prefs.theme === "light" ? "default" : "outline"}
              onClick={() => setPrefs({ theme: "light" })}
              aria-pressed={prefs.theme === "light"}
            >
              <Sun className="size-4" aria-hidden /> Light mode
            </Button>
            <Button
              variant={prefs.theme === "dark" ? "default" : "outline"}
              onClick={() => setPrefs({ theme: "dark" })}
              aria-pressed={prefs.theme === "dark"}
            >
              <Moon className="size-4" aria-hidden /> Dark mode
            </Button>
          </div>
        </section>

        <section className="surface p-6">
          <h2 className="text-base font-bold">Scheduling defaults</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="grid gap-1.5">
              <Label htmlFor="start">Working hours start</Label>
              <Input
                id="start"
                type="time"
                value={prefs.workStart}
                onChange={(e) => setPrefs({ workStart: e.target.value })}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="end">Working hours end</Label>
              <Input
                id="end"
                type="time"
                value={prefs.workEnd}
                onChange={(e) => setPrefs({ workEnd: e.target.value })}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="brk">Break duration (minutes)</Label>
              <Input
                id="brk"
                type="number"
                min={0}
                max={120}
                value={prefs.breakMinutes}
                onChange={(e) => setPrefs({ breakMinutes: Number(e.target.value) || 0 })}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="lunch">Lunch duration (minutes)</Label>
              <Input
                id="lunch"
                type="number"
                min={0}
                max={180}
                value={prefs.lunchMinutes}
                onChange={(e) => setPrefs({ lunchMinutes: Number(e.target.value) || 0 })}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="stype">Default schedule type</Label>
              <Select
                value={prefs.scheduleType}
                onValueChange={(v) => setPrefs({ scheduleType: v as "daily" | "weekly" })}
              >
                <SelectTrigger id="stype">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        <section className="surface p-6">
          <h2 className="text-base font-bold">AI</h2>
          <div className="mt-3 flex items-center gap-2 rounded-lg bg-success/10 px-3 py-2 text-sm text-success">
            <ShieldCheck className="size-4" aria-hidden />
            AI is configured and ready. Requests run securely on the server — no API keys in your browser.
          </div>
        </section>

        <section className="surface p-6">
          <h2 className="text-base font-bold">Data</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {counts.tasks} tasks, {counts.meetings} meeting summaries and {counts.emails} saved emails are
            stored in this browser.
          </p>
          <Button variant="destructive" className="mt-4" onClick={() => setConfirm(true)}>
            <Trash2 className="size-4" aria-hidden /> Clear All Data
          </Button>
        </section>
      </div>

      <AlertDialog open={confirm} onOpenChange={setConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear all local data?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently deletes your tasks, schedule, meeting summaries and saved emails from this
              browser. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                clearAllData();
                toast.success("All local data cleared");
              }}
            >
              Clear everything
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppShell>
  );
}
