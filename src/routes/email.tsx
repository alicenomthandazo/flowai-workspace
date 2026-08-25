import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useCallback, useEffect, useRef, useState } from "react";
import { Mail, Copy, RefreshCw, Save, Eraser, Sparkles, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmptyState, ErrorState, Loading } from "@/components/common";
import { generateEmail, refineEmail } from "@/lib/ai.functions";
import { useApp, saveEmail, deleteEmail, setEmailPrefill, getState } from "@/lib/store";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — AI Productivity Assistant" },
      {
        name: "description",
        content:
          "Describe what you want to say and generate a polished, editable email with the right tone and length.",
      },
      { property: "og:title", content: "Smart Email Generator" },
      {
        property: "og:description",
        content: "Generate professional emails in seconds, then refine tone and length with one click.",
      },
    ],
  }),
  component: EmailPage,
});

const recipients = ["Manager", "Client", "Customer", "Coworker", "Teacher", "Friend", "Other"];
const tones = ["Professional", "Formal", "Friendly", "Persuasive", "Casual", "Apologetic", "Concise"];
const lengths = ["Short", "Medium", "Detailed"];

function EmailPage() {
  const generate = useServerFn(generateEmail);
  const refine = useServerFn(refineEmail);
  const savedEmails = useApp((s) => s.emails);
  const prefill = useApp((s) => s.emailPrefill);

  const [prompt, setPrompt] = useState("");
  const [recipient, setRecipient] = useState("Manager");
  const [tone, setTone] = useState("Professional");
  const [length, setLength] = useState("Medium");
  const [extra, setExtra] = useState("");

  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const lastAction = useRef<(() => void) | null>(null);

  const run = useCallback(
    async (label: string, fn: () => Promise<{ ok: true; data: { subject: string; body: string } } | { ok: false; message: string }>) => {
      setError(null);
      setLoading(label);
      lastAction.current = () => void run(label, fn);
      try {
        const res = await fn();
        if (!res.ok) {
          setError(res.message);
          return;
        }
        setSubject(res.data.subject);
        setBody(res.data.body);
      } catch {
        setError("The request did not go through. Check your connection and try again.");
      } finally {
        setLoading(null);
      }
    },
    [],
  );

  const doGenerate = useCallback(
    (values?: { prompt: string; recipient: string; tone: string; length: string; extra: string }) => {
      const v = values ?? { prompt, recipient, tone, length, extra };
      if (!v.prompt.trim()) {
        toast.error("Tell the AI what the email should say first.");
        return;
      }
      void run("Writing your email…", () => generate({ data: v }));
    },
    [prompt, recipient, tone, length, extra, run, generate],
  );

  // Consume a prefill handed over from the meeting summarizer or task planner.
  useEffect(() => {
    if (!prefill) return;
    setPrompt(prefill.prompt);
    setRecipient(prefill.recipient);
    setTone(prefill.tone);
    setLength(prefill.length);
    setExtra(prefill.extra);
    setEmailPrefill(null);
    if (prefill.autoGenerate) doGenerate(prefill);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefill]);

  const doRefine = (instruction: string, label: string) => {
    if (!body.trim()) return;
    void run(label, () => refine({ data: { subject, body, instruction } }));
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`Subject: ${subject}\n\n${body}`);
      toast.success("Email copied to clipboard");
    } catch {
      toast.error("Copying isn't available in this browser. Select the text manually.");
    }
  };

  const busy = loading !== null;
  const hasResult = Boolean(body.trim());

  return (
    <AppShell title="Smart Email Generator" breadcrumb="Workspace / Email Generator">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <section className="surface p-6">
          <h2 className="text-base font-bold">What should the email say?</h2>
          <div className="mt-4 grid gap-4">
            <div className="grid gap-1.5">
              <Label htmlFor="prompt">Your request</Label>
              <Textarea
                id="prompt"
                rows={5}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value.slice(0, 20000))}
                placeholder="Describe what you want to communicate..."
              />
              <p className="text-xs text-muted-foreground">
                Example: &ldquo;Ask my manager if I can take Friday off.&rdquo;
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="grid gap-1.5">
                <Label htmlFor="recipient">Recipient type</Label>
                <Select value={recipient} onValueChange={setRecipient}>
                  <SelectTrigger id="recipient">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {recipients.map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="tone">Tone</Label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger id="tone">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {tones.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="length">Length</Label>
                <Select value={length} onValueChange={setLength}>
                  <SelectTrigger id="length">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {lengths.map((l) => (
                      <SelectItem key={l} value={l}>
                        {l}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="extra">Additional instructions (optional)</Label>
              <Textarea
                id="extra"
                rows={3}
                value={extra}
                onChange={(e) => setExtra(e.target.value.slice(0, 4000))}
                placeholder="Mention the project deadline, keep it under 5 sentences..."
              />
            </div>

            <Button size="lg" onClick={() => doGenerate()} disabled={busy}>
              <Sparkles className="size-4" aria-hidden />
              {loading ? "Generating…" : "Generate Email"}
            </Button>
          </div>
        </section>

        <section className="grid content-start gap-4">
          {loading && <Loading label={loading} />}
          {error && <ErrorState message={error} onRetry={() => lastAction.current?.()} />}

          {!hasResult && !loading && !error && (
            <EmptyState
              icon={<Mail className="size-6" aria-hidden />}
              title="No email yet"
              message="Describe what you want to say and AI will create your email."
            />
          )}

          {hasResult && (
            <div className="surface p-6">
              <div className="grid gap-1.5">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
              </div>
              <div className="mt-4 grid gap-1.5">
                <Label htmlFor="body">Email body</Label>
                <Textarea
                  id="body"
                  rows={14}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="font-sans leading-relaxed"
                />
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button size="sm" onClick={copy}>
                  <Copy className="size-4" aria-hidden /> Copy
                </Button>
                <Button size="sm" variant="outline" disabled={busy} onClick={() => doGenerate()}>
                  <RefreshCw className="size-4" aria-hidden /> Regenerate
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={busy}
                  onClick={() => doRefine("Make it noticeably shorter while keeping every key point.", "Shortening…")}
                >
                  Make Shorter
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={busy}
                  onClick={() => doRefine("Expand it with more helpful detail and context.", "Expanding…")}
                >
                  Make Longer
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={busy}
                  onClick={() => doRefine("Rewrite it in a more polished, professional business tone.", "Polishing…")}
                >
                  Make More Professional
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={busy}
                  onClick={() => doRefine("Rewrite it in a warmer, friendlier tone.", "Warming it up…")}
                >
                  Make Friendlier
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    saveEmail({ subject, body });
                    toast.success("Email saved to this browser");
                  }}
                >
                  <Save className="size-4" aria-hidden /> Save Email
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setSubject("");
                    setBody("");
                    setError(null);
                  }}
                >
                  <Eraser className="size-4" aria-hidden /> Clear
                </Button>
              </div>
            </div>
          )}

          {savedEmails.length > 0 && (
            <div className="surface p-6">
              <h2 className="text-base font-bold">Saved emails</h2>
              <ul className="mt-3 grid gap-2">
                {savedEmails.map((e) => (
                  <li
                    key={e.id}
                    className="flex items-center gap-2 rounded-lg border border-border p-3 text-sm"
                  >
                    <button
                      className="min-w-0 flex-1 text-left"
                      onClick={() => {
                        setSubject(e.subject);
                        setBody(e.body);
                      }}
                    >
                      <span className="block truncate font-medium">{e.subject}</span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {new Date(e.createdAt).toLocaleString()}
                      </span>
                    </button>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Delete saved email ${e.subject}`}
                      onClick={() => deleteEmail(e.id)}
                    >
                      <Trash2 className="size-4" aria-hidden />
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
}

export function currentTaskCount() {
  return getState().tasks.length;
}
