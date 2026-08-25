const GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";
const MODEL = "google/gemini-3-flash";

export class AiError extends Error {
  status: number;
  constructor(message: string, status = 500) {
    super(message);
    this.status = status;
  }
}

export async function callAi(system: string, user: string): Promise<string> {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new AiError("AI is not configured on this deployment.", 401);

  let res: Response;
  try {
    res = await fetch(GATEWAY, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": key,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user.slice(0, 60000) },
        ],
      }),
    });
  } catch {
    throw new AiError("Could not reach the AI service. Check your connection and try again.", 503);
  }

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    if (res.status === 429)
      throw new AiError("Too many requests right now. Please wait a moment and try again.", 429);
    if (res.status === 402)
      throw new AiError("AI credits are exhausted. Add credits to continue using AI features.", 402);
    if (res.status === 403)
      throw new AiError("AI access is currently blocked for this workspace.", 403);
    throw new AiError(text.slice(0, 200) || "The AI service returned an error.", res.status);
  }

  const data = (await res.json().catch(() => null)) as
    | { choices?: { message?: { content?: string } }[] }
    | null;
  const content = data?.choices?.[0]?.message?.content;
  if (!content || !content.trim()) throw new AiError("The AI returned an empty response.", 502);
  return content.trim();
}

/** Extract and parse a JSON object from a model response, tolerating fences/prose. */
export function parseJson<T>(raw: string): T {
  const cleaned = raw
    .replace(/^\s*```(?:json)?/i, "")
    .replace(/```\s*$/, "")
    .trim();
  const candidates = [cleaned];
  const first = cleaned.indexOf("{");
  const last = cleaned.lastIndexOf("}");
  if (first !== -1 && last > first) candidates.push(cleaned.slice(first, last + 1));
  for (const c of candidates) {
    try {
      return JSON.parse(c) as T;
    } catch {
      /* try next */
    }
  }
  throw new AiError("The AI returned data we couldn't read. Please try again.", 502);
}

export const asString = (v: unknown, fallback = ""): string =>
  typeof v === "string" ? v.trim() : typeof v === "number" ? String(v) : fallback;

export const asStringArray = (v: unknown): string[] =>
  Array.isArray(v) ? v.map((x) => asString(x)).filter(Boolean) : [];

export const asPriority = (v: unknown): "high" | "medium" | "low" => {
  const s = asString(v).toLowerCase();
  return s === "high" || s === "low" ? s : "medium";
};
