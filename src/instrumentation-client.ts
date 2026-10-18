import posthog from "posthog-js";

const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;

// Events go through the PostHog managed reverse proxy on our domain.
if (token) {
  posthog.init(token, {
    api_host: "https://t.usetrace.app",
    ui_host: "https://eu.posthog.com",
    defaults: "2026-08-30",
  });
}
