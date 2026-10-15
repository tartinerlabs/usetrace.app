import type { UserConfig } from "@commitlint/types";

export default {
  extends: ["@commitlint/config-conventional"],
  parserPreset: {
    name: "conventional-changelog-conventionalcommits",
    presetConfig: {
      types: [
        { type: "feat", section: "Features" },
        { type: "fix", section: "Bug Fixes" },
        { type: "perf", section: "Performance Improvements" },
        { type: "revert", section: "Reverts" },
        { type: "docs", section: "Documentation" },
        { type: "style", section: "Styles" },
        { type: "refactor", section: "Code Refactoring" },
        { type: "test", section: "Tests" },
        { type: "build", section: "Build System" },
        { type: "ci", section: "Continuous Integration" },
        { type: "chore", section: "Maintenance", hidden: true },
      ],
    },
  },
  rules: {
    // Type — explicitly set to @commitlint/config-conventional defaults
    "type-case": [2, "always", "lower-case"],
    "type-empty": [2, "never"],
    "type-enum": [
      2,
      "always",
      [
        "build",
        "chore",
        "ci",
        "docs",
        "feat",
        "fix",
        "perf",
        "refactor",
        "revert",
        "style",
        "test",
      ],
    ],
    // Scope — not a monorepo, scopes are forbidden
    "scope-empty": [2, "always"],
    // Subject
    "subject-case": [
      2,
      "never",
      ["sentence-case", "start-case", "pascal-case", "upper-case"],
    ],
    "subject-empty": [2, "never"],
    "subject-full-stop": [2, "never", "."],
    "subject-min-length": [2, "always", 10],
    "subject-max-length": [2, "always", 50],
    // Header / body
    "header-max-length": [2, "always", 72],
    "body-max-line-length": [0],
  },
} satisfies UserConfig;
