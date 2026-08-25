export type Priority = "high" | "medium" | "low";

export interface Task {
  id: string;
  name: string;
  description: string;
  priority: Priority;
  deadline: string; // yyyy-mm-dd or free text, may be ""
  duration: number; // minutes
  assignee: string;
  completed: boolean;
  createdAt: number;
  source?: "manual" | "meeting";
}

export interface SavedEmail {
  id: string;
  subject: string;
  body: string;
  createdAt: number;
}

export interface ActionItem {
  task: string;
  person: string;
  deadline: string;
  priority: Priority;
}

export interface MeetingSummary {
  id: string;
  title: string;
  createdAt: number;
  executiveSummary: string;
  keyPoints: string[];
  decisions: string[];
  actionItems: ActionItem[];
  importantDates: { date: string; description: string }[];
  followUps: string[];
}

export type BlockKind = "task" | "break" | "lunch" | "end";

export interface ScheduleBlock {
  start: string; // HH:mm
  end: string; // HH:mm
  title: string;
  kind: BlockKind;
  taskId?: string;
  priority?: Priority;
  note?: string;
}

export interface Schedule {
  date: string;
  generatedAt: number;
  blocks: ScheduleBlock[];
  deferred: { name: string; reason: string }[];
}

export interface Preferences {
  theme: "light" | "dark";
  scheduleType: "daily" | "weekly";
  workStart: string;
  workEnd: string;
  breakMinutes: number;
  lunchMinutes: number;
}

export interface EmailPrefill {
  prompt: string;
  recipient: string;
  tone: string;
  length: string;
  extra: string;
  autoGenerate: boolean;
}

export interface AppState {
  tasks: Task[];
  emails: SavedEmail[];
  meetings: MeetingSummary[];
  schedule: Schedule | null;
  prefs: Preferences;
  emailPrefill: EmailPrefill | null;
}
