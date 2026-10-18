import { MARKDOWN } from "@/lib/google-maps-timeline";

// Markdown version of /google-maps-timeline-alternative. next.config.ts
// rewrites that path here when the request sends Accept: text/markdown.
export function GET() {
  return new Response(MARKDOWN, {
    headers: { "Content-Type": "text/markdown; charset=utf-8", Vary: "Accept" },
  });
}
