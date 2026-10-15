import { LLMS_TXT } from "@/lib/llms";

// Markdown version of the home page. next.config.ts rewrites `/` here when the
// request sends Accept: text/markdown.
export function GET() {
  return new Response(LLMS_TXT, {
    headers: { "Content-Type": "text/markdown; charset=utf-8", Vary: "Accept" },
  });
}
