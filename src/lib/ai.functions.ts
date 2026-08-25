import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  aiEmail,
  aiMeeting,
  aiSchedule,
  composeEmailPrompt,
  refinePrompt,
} from "./ai-prompts.server";
import type { MeetingSummary, Priority, ScheduleBlock } from "./types";

const FRIENDLY = "We couldn't complete that request. Please try again.";

type Result<T> = { ok: true; data: T } | { ok: false; message: string };

const emailInput = z.object({
  prompt: z.string().min(1).max(20000),
  recipient: z.string().max(60).default("Other"),
  tone: z.string().max(60).default("Professional"),
  length: z.string().max(60).default("Medium"),
  extra: z.string().max(4000).default(""),
});

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => emailInput.parse(d))
  .handler(async ({ data }): Promise<Result<{ subject: string; body: string }>> => {
    try {
      return { ok: true, data: await aiEmail(composeEmailPrompt(data)) };
    } catch (e) {
      return { ok: false, message: e instanceof Error ? e.message : FRIENDLY };
    }
  });

export const refineEmail = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z
      .object({
        subject: z.string().max(500).default(""),
        body: z.string().min(1).max(30000),
        instruction: z.string().min(1).max(500),
      })
      .parse(d),
  )
  .handler(async ({ data }): Promise<Result<{ subject: string; body: string }>> => {
    try {
      return {
        ok: true,
        data: await aiEmail(refinePrompt(data.subject, data.body, data.instruction)),
      };
    } catch (e) {
      return { ok: false, message: e instanceof Error ? e.message : FRIENDLY };
    }
  });

export const summarizeMeeting = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ notes: z.string().min(20).max(60000) }).parse(d))
  .handler(async ({ data }): Promise<Result<Omit<MeetingSummary, "id" | "createdAt">>> => {
    try {
      return { ok: true, data: await aiMeeting(data.notes) };
    } catch (e) {
      return { ok: false, message: e instanceof Error ? e.message : FRIENDLY };
    }
  });

export const generateSchedule = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z
      .object({
        tasks: z
          .array(
            z.object({
              id: z.string(),
              name: z.string(),
              priority: z.enum(["high", "medium", "low"]),
              deadline: z.string().default(""),
              duration: z.number().int().positive().max(1440),
              description: z.string().default(""),
            }),
          )
          .min(1)
          .max(60),
        date: z.string(),
        workStart: z.string(),
        workEnd: z.string(),
        breakMinutes: z.number().int().min(0).max(120),
        lunchMinutes: z.number().int().min(0).max(180),
        scheduleType: z.string(),
      })
      .parse(d),
  )
  .handler(
    async ({
      data,
    }): Promise<Result<{ blocks: ScheduleBlock[]; deferred: { name: string; reason: string }[] }>> => {
      try {
        return { ok: true, data: await aiSchedule(data as Parameters<typeof aiSchedule>[0]) };
      } catch (e) {
        return { ok: false, message: e instanceof Error ? e.message : FRIENDLY };
      }
    },
  );

export type { Priority };
