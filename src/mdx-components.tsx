import type { MDXComponents } from "mdx/types";

const components: MDXComponents = {
  h1: (props) => (
    <h1
      className="mb-6 wrap-break-word font-rounded font-semibold text-[clamp(2rem,1.6rem+2vw,2.75rem)] text-ink leading-tight tracking-tight"
      {...props}
    />
  ),
  h2: (props) => (
    <h2
      className="mt-12 mb-4 font-rounded font-semibold text-2xl text-ink leading-snug"
      {...props}
    />
  ),
  h3: (props) => (
    <h3
      className="mt-8 mb-3 font-rounded font-semibold text-ink text-lg leading-snug"
      {...props}
    />
  ),
  p: (props) => (
    <p className="my-4 text-base text-secondary leading-relaxed" {...props} />
  ),
  ul: (props) => (
    <ul
      className="my-4 list-disc space-y-2 pl-6 text-base text-secondary leading-relaxed marker:text-sun"
      {...props}
    />
  ),
  ol: (props) => (
    <ol
      className="my-4 list-decimal space-y-2 pl-6 text-base text-secondary leading-relaxed"
      {...props}
    />
  ),
  li: (props) => <li className="pl-1" {...props} />,
  a: (props) => (
    <a
      className="text-ink underline decoration-line underline-offset-4 hover:decoration-sun"
      {...props}
    />
  ),
  strong: (props) => <strong className="font-semibold text-ink" {...props} />,
  mark: (props) => (
    <mark
      className="rounded bg-sun/20 px-1 text-ink ring-1 ring-sun/50"
      {...props}
    />
  ),
  hr: (props) => <hr className="my-10 border-line" {...props} />,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
