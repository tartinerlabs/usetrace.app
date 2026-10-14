import posthog from "posthog-js";

const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;

// Cookieless: in-memory persistence, anonymous events only, no extras loaded.
if (key) {
  posthog.init(key, {
    api_host: "https://eu.i.posthog.com",
    defaults: "2026-01-30",
    persistence: "memory",
    person_profiles: "never",
    capture_pageview: "history_change",
    autocapture: false,
    capture_dead_clicks: false,
    capture_exceptions: false,
    capture_heatmaps: false,
    disable_session_recording: true,
    disable_surveys: true,
    disable_product_tours: true,
    disable_conversations: true,
    disable_web_experiments: true,
    disable_external_dependency_loading: true,
    advanced_disable_flags: true,
  });
}
