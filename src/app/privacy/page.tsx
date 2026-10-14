import type { Metadata } from "next";
import { SHARE_IMAGE } from "@/lib/site";
import Policy from "./policy.mdx";

const title = "Privacy Policy";
const description =
  "Trace keeps your journal encrypted on your iPhone. Our servers never receive your journal.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/privacy" },
  openGraph: { url: "/privacy", title, description, images: SHARE_IMAGE },
  twitter: { title, description },
};

export default function Page() {
  return (
    // Literal JSX in MDX bypasses mdx-components, so placeholder <mark>s are
    // styled here. Top-level ones (the contact lines) stack one per line.
    <article className="mx-auto max-w-2xl px-4 py-12 sm:px-6 [&>mark]:my-1 [&>mark]:table [&_mark]:rounded [&_mark]:bg-sun/20 [&_mark]:px-1 [&_mark]:text-ink [&_mark]:ring-1 [&_mark]:ring-sun/50">
      <Policy />
    </article>
  );
}
