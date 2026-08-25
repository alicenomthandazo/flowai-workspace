import { callAi, parseJson, asString, asStringArray, asPriority, AiError } from "./ai.server";
import type { ActionItem, MeetingSummary, ScheduleBlock, Priority } from "./types";

const EMAIL_SYSTEM =
  "You are an expert business writing assistant. You write clear, natural, well-structured emails. " +
  'Always respond with ONLY a JSON object of shape {"subject": string, "body": string}. ' +
  "The body must be plain text with real line breaks, include a greeting and a sign-off, and must never contain placeholder brackets other than [Your Name].";

export async function aiEmail(prompt: string): Promise<{ subject: string; body: string }> {
  const raw = await callAi(EMAIL_SYSTEM, prompt);
  const parsed = parseJson<{ subject?: unknown; body?: unknown }>(raw);
  const subject = asString(parsed.subject);
  const body = asString(parsed.body);
  if (!body) throw new AiError("The AI returned an incomplete email. Please try again.", 502);
  return { subject: subject || "(no subject)", body };
}

export function composeEmailPrompt(input: {
  prompt: string;
  recipient: string;
  tone: string;
  length: string;
  extra: string;
}) {
  return [
    `Write an email based on this request: ${input.prompt}`,
    `Recipient type: ${input.recipient}`,
    `Tone: ${input.tone}`,
    `Length: ${input.length} (short = under 90 words, medium = 90-170 words, detailed = 170-320 words)`,
    input.extra ? `Additional instructions: ${input.extra}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

export function refinePrompt(subject: string, body: string, instruction: string) {
  return `Rewrite the following email. Instruction: ${instruction}\n\nSubject: ${subject}\n\nBody:\n${body}`;
}

export async function aiMeeting(notes: string): Promise<Omit<MeetingSummary, "id" | "createdAt">> {
  const system =
    "You analyse meeting notes and return structured data. Respond with ONLY a JSON object with keys: " +
    'title (short meeting title), executiveSummary (2-4 sentences), keyPoints (string[]), decisions (string[]), ' +
    'actionItems (array of {task, person, deadline, priority}) where priority is "high" | "medium" | "low" and ' +
    "person/deadline are \"Unassigned\"/\"No deadline\" when unknown, importantDates (array of {date, description}), " +
    "followUps (string[]). Never invent facts that are not supported by the notes.";
  const raw = await callAi(system, `Meeting notes:\n\n${notes}`);
  const p = parseJson<Record<string, unknown>>(raw);
  const actionItems: ActionItem[] = Array.isArray(p["actionItems"])
    ? (p["actionItems"] as unknown[])
        .map((x) => {
          const o = (x ?? {}) as Record<string, unknown>;
          return {
            task: asString(o["task"]),
            person: asString(o["person"], "Unassigned") || "Unassigned",
            deadline: asString(o["deadline"], "No deadline") || "No deadline",
            priority: asPriority(o["priority"]),
          };
        })
        .filter((a) => a.task)
    : [];
  const dates = Array.isArray(p["importantDates"])
    ? (p["importantDates"] as unknown[])
        .map((x) => {
          const o = (x ?? {}) as Record<string, unknown>;
          return { date: asString(o["date"]), description: asString(o["description"]) };
        })
        .filter((d) => d.date || d.description)
    : [];
  const summary = asString(p["executiveSummary"]);
  if (!summary && actionItems.length === 0)
    throw new AiError("The AI couldn't summarize those notes. Please try again.", 502);
  return {
    title: asString(p["title"], "Untitled meeting") || "Untitled meeting",
    executiveSummary: summary,
    keyPoints: asStringArray(p["keyPoints"]),
    decisions: asStringArray(p["decisions"]),
    actionItems,
    importantDates: dates,
    followUps: asStringArray(p["followUps"]),
  };
}

export interface SchedulePayload {
  blocks: ScheduleBlock[];
  deferred: { name: string; reason: string }[];
}

export async function aiSchedule(input: {
  tasks: { id: string; name: string; priority: Priority; deadline: string; duration: number; description: string }[];
  date: string;
  workStart: string;
  workEnd: string;
  breakMinutes: number;
  lunchMinutes: number;
  scheduleType: string;
}): Promise<SchedulePayload> {
  const system =
    "You are a scheduling engine. Build a realistic, non-overlapping schedule inside the working hours. " +
    'Respond with ONLY JSON: {"blocks":[{"start":"HH:mm","end":"HH:mm","title":string,"kind":"task"|"break"|"lunch"|"end","taskId":string|null,"priority":"high"|"medium"|"low"|null,"note":string}],"deferred":[{"name":string,"reason":string}]}. ' +
    "Rules: schedule high priority and near deadlines earlier; never overlap; never go outside working hours; " +
    "insert breaks of the given length roughly every 90 minutes and one lunch block near midday; " +
    "end with a single block of kind \"end\" at the end time titled \"End of workday\"; " +
    "every task that does not fit must appear in deferred with a reason — never drop a task silently. " +
    "Use the exact taskId values provided.";
  const user = JSON.stringify(input);
  const raw = await callAi(system, user);
  const p = parseJson<Record<string, unknown>>(raw);
  const validTime = (s: string) => /^\d{2}:\d{2}$/.test(s);
  const blocks: ScheduleBlock[] = Array.isArray(p["blocks"])
    ? (p["blocks"] as unknown[])
        .map((x) => {
          const o = (x ?? {}) as Record<string, unknown>;
          const kindRaw = asString(o["kind"]).toLowerCase();
          const kind = (["task", "break", "lunch", "end"].includes(kindRaw) ? kindRaw : "task") as ScheduleBlock["kind"];
          const taskId = asString(o["taskId"]);
          const block: ScheduleBlock = {
            start: asString(o["start"]),
            end: asString(o["end"]) || asString(o["start"]),
            title: asString(o["title"]),
            kind,
          };
          if (taskId) block.taskId = taskId;
          if (o["priority"]) block.priority = asPriority(o["priority"]);
          const note = asString(o["note"]);
          if (note) block.note = note;
          return block;
        })
        .filter((b) => b.title && validTime(b.start) && validTime(b.end))
        .sort((a, b) => a.start.localeCompare(b.start))
    : [];
  if (blocks.length === 0)
    throw new AiError("The AI returned an empty schedule. Please try again.", 502);
  const deferred = Array.isArray(p["deferred"])
    ? (p["deferred"] as unknown[])
        .map((x) => {
          const o = (x ?? {}) as Record<string, unknown>;
          return { name: asString(o["name"]), reason: asString(o["reason"], "Did not fit today") };
        })
        .filter((d) => d.name)
    : [];
  return { blocks, deferred };
}
