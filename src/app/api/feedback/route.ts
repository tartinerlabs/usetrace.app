// Receives feedback from the Trace app and files it as an issue in the
// private app repository. The token lives only here, never in the app.
const REPO = "tartinerlabs/Trace";
const FEELINGS = ["Love it", "It's okay", "Not for me"];
const MAX_BODY_BYTES = 16_000;
const MAX_MESSAGE = 4_000;

type Feedback = {
  feeling?: string;
  message: string;
  replyTo?: string;
  app?: string;
  os?: string;
  device?: string;
};

function optionalString(value: unknown, max: number): string | undefined {
  if (value === undefined || value === null) return undefined;
  if (typeof value !== "string" || value.length > max) throw new Error();
  return value.trim() || undefined;
}

function parse(raw: string): Feedback | null {
  try {
    const input = JSON.parse(raw);
    if (typeof input !== "object" || input === null) return null;
    const feeling = optionalString(input.feeling, 20);
    if (feeling && !FEELINGS.includes(feeling)) return null;
    const message = optionalString(input.message, MAX_MESSAGE) ?? "";
    const replyTo = optionalString(input.replyTo, 254);
    if (replyTo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(replyTo)) return null;
    if (!feeling && !message) return null;
    return {
      feeling,
      message,
      replyTo,
      app: optionalString(input.app, 40),
      os: optionalString(input.os, 40),
      device: optionalString(input.device, 40),
    };
  } catch {
    return null;
  }
}

// A fence longer than any backtick run keeps the message as plain text, so
// it can't render markdown or @-mention anyone.
function fenced(text: string): string {
  const longest = Math.max(
    0,
    ...(text.match(/`+/g) ?? []).map((run) => run.length),
  );
  const fence = "`".repeat(Math.max(3, longest + 1));
  return `${fence}text\n${text}\n${fence}`;
}

function issue(feedback: Feedback) {
  const firstLine = feedback.message.split("\n")[0].slice(0, 70);
  const title = firstLine
    ? `${feedback.feeling ?? "Feedback"}: ${firstLine}`
    : `Feedback: ${feedback.feeling}`;
  const details = [
    feedback.feeling && `**So far:** ${feedback.feeling}`,
    feedback.replyTo && `**Reply to:** ${feedback.replyTo}`,
    feedback.app && `**App:** ${feedback.app}`,
    feedback.os && `**OS:** ${feedback.os}`,
    feedback.device && `**Device:** ${feedback.device}`,
  ].filter(Boolean);
  const body = [
    feedback.message && fenced(feedback.message),
    details.join("\n"),
  ]
    .filter(Boolean)
    .join("\n\n");
  return { title, body, labels: ["feedback"] };
}

export async function POST(request: Request) {
  const token = process.env.GITHUB_FEEDBACK_TOKEN;
  if (!token) {
    return Response.json({ error: "unavailable" }, { status: 503 });
  }

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) {
    return Response.json({ error: "too_large" }, { status: 413 });
  }
  const feedback = parse(raw);
  if (!feedback) {
    return Response.json({ error: "invalid" }, { status: 400 });
  }

  const response = await fetch(`https://api.github.com/repos/${REPO}/issues`, {
    method: "POST",
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "User-Agent": "usetrace.app-feedback",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    body: JSON.stringify(issue(feedback)),
  });
  if (!response.ok) {
    console.error(
      "GitHub issue creation failed",
      response.status,
      await response.text(),
    );
    return Response.json({ error: "upstream" }, { status: 502 });
  }
  return Response.json({ ok: true }, { status: 201 });
}
