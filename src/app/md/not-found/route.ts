import { NOT_FOUND_MD } from "@/lib/llms";

// next.config.ts rewrites unknown paths here when the request sends
// Accept: text/markdown.
export function GET() {
  return new Response(NOT_FOUND_MD, {
    status: 404,
    headers: { "Content-Type": "text/markdown; charset=utf-8", Vary: "Accept" },
  });
}
