import posthog from "posthog-js";

const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;

// Cookieless and anonymous; `defaults` also tracks client-side navigations.
if (key) {
  posthog.init(key, {
    api_host: "https://eu.i.posthog.com",
    defaults: "2026-01-30",
    persistence: "memory",
    person_profiles: "never",
    disable_session_recording: true,
  });
}
