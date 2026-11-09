import { NOT_FOUND_MD } from "@/lib/llms";
import { LIVE, MARKDOWN } from "@/lib/pricing";

// Markdown version of /pricing. next.config.ts rewrites that path here when the
// request sends Accept: text/markdown.
export function GET() {
  return new Response(LIVE ? MARKDOWN : NOT_FOUND_MD, {
    status: LIVE ? 200 : 404,
    headers: { "Content-Type": "text/markdown; charset=utf-8", Vary: "Accept" },
  });
}
