import { useSyncExternalStore } from "react";
import type { AppState, Preferences, Task, SavedEmail, MeetingSummary, Schedule, EmailPrefill } from "./types";

const KEY = "ai-productivity-workspace-v1";

export const defaultPrefs: Preferences = {
  theme: "light",
  scheduleType: "daily",
  workStart: "09:00",
  workEnd: "17:00",
  breakMinutes: 15,
  lunchMinutes: 60,
};

const initialState: AppState = {
  tasks: [],
  emails: [],
  meetings: [],
  schedule: null,
  prefs: defaultPrefs,
  emailPrefill: null,
};

let state: AppState = initialState;
let loaded = false;
const listeners = new Set<() => void>();

function persist() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify({ ...state, emailPrefill: null }));
  } catch {
    /* storage full or unavailable — keep working in memory */
  }
}

export function loadState() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<AppState>;
      state = {
        ...initialState,
        ...parsed,
        prefs: { ...defaultPrefs, ...(parsed.prefs ?? {}) },
        tasks: Array.isArray(parsed.tasks) ? parsed.tasks : [],
        emails: Array.isArray(parsed.emails) ? parsed.emails : [],
        meetings: Array.isArray(parsed.meetings) ? parsed.meetings : [],
        emailPrefill: null,
      };
    }
  } catch {
    state = initialState;
  }
  applyTheme(state.prefs.theme);
  emit();
}

function emit() {
  listeners.forEach((l) => l());
}

function set(updater: (s: AppState) => AppState) {
  state = updater(state);
  persist();
  emit();
}

export function applyTheme(theme: "light" | "dark") {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", theme === "dark");
}

export function useApp<T>(selector: (s: AppState) => T): T {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => selector(state),
    () => selector(initialState),
  );
}

export function getState() {
  return state;
}

export const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

/* ---- actions ---- */

export function addTask(input: Partial<Task> & { name: string }) {
  const task: Task = {
    id: uid(),
    name: input.name.trim(),
    description: input.description ?? "",
    priority: input.priority ?? "medium",
    deadline: input.deadline ?? "",
    duration: input.duration && input.duration > 0 ? input.duration : 60,
    assignee: input.assignee ?? "",
    completed: false,
    createdAt: Date.now(),
    source: input.source ?? "manual",
  };
  const duplicate = state.tasks.find(
    (t) => t.name.toLowerCase() === task.name.toLowerCase() && !t.completed,
  );
  if (duplicate) return { task: duplicate, duplicate: true };
  set((s) => ({ ...s, tasks: [task, ...s.tasks] }));
  return { task, duplicate: false };
}

export function updateTask(id: string, patch: Partial<Task>) {
  set((s) => ({ ...s, tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)) }));
}

export function deleteTask(id: string) {
  set((s) => ({
    ...s,
    tasks: s.tasks.filter((t) => t.id !== id),
    schedule: s.schedule
      ? { ...s.schedule, blocks: s.schedule.blocks.filter((b) => b.taskId !== id) }
      : null,
  }));
}

export function saveEmail(email: Omit<SavedEmail, "id" | "createdAt">) {
  const item: SavedEmail = { ...email, id: uid(), createdAt: Date.now() };
  set((s) => ({ ...s, emails: [item, ...s.emails] }));
  return item;
}

export function deleteEmail(id: string) {
  set((s) => ({ ...s, emails: s.emails.filter((e) => e.id !== id) }));
}

export function saveMeeting(meeting: MeetingSummary) {
  set((s) => ({ ...s, meetings: [meeting, ...s.meetings.filter((m) => m.id !== meeting.id)] }));
}

export function deleteMeeting(id: string) {
  set((s) => ({ ...s, meetings: s.meetings.filter((m) => m.id !== id) }));
}

export function setSchedule(schedule: Schedule | null) {
  set((s) => ({ ...s, schedule }));
}

export function updateScheduleBlocks(blocks: Schedule["blocks"]) {
  set((s) => (s.schedule ? { ...s, schedule: { ...s.schedule, blocks } } : s));
}

export function setPrefs(patch: Partial<Preferences>) {
  set((s) => ({ ...s, prefs: { ...s.prefs, ...patch } }));
  if (patch.theme) applyTheme(patch.theme);
}

export function setEmailPrefill(prefill: EmailPrefill | null) {
  set((s) => ({ ...s, emailPrefill: prefill }));
}

export function clearAllData() {
  if (typeof window !== "undefined") {
    try {
      window.localStorage.removeItem(KEY);
    } catch {
      /* ignore */
    }
  }
  state = { ...initialState, prefs: { ...defaultPrefs, theme: state.prefs.theme } };
  persist();
  emit();
}
