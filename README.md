<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="public/brand/logo-dark.svg">
  <img src="public/brand/logo.svg" alt="Trace logo" width="96" height="96">
</picture>

# Trace

**Your day, retraced.**

The website for Trace, a private location timeline for iPhone.

[usetrace.app](https://usetrace.app) · [llms.txt](https://usetrace.app/llms.txt)

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38BDF8?logo=tailwindcss&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-7-3178C6?logo=typescript&logoColor=white)

</div>

## About

Trace records the places you go and the routes you take. Your journal stays encrypted on your iPhone. Trace has no account, no ads, no streaks and no scores.

This repository contains the marketing site only. It does not contain the iOS app.

## Tech stack

| Area | Tool |
| --- | --- |
| Framework | [Next.js](https://nextjs.org) 16 (App Router), React Compiler |
| Styles | [Tailwind CSS](https://tailwindcss.com) 4 |
| Content | MDX (`@next/mdx`) |
| Lint and format | [Biome](https://biomejs.dev) |
| Analytics | Vercel Analytics, Speed Insights |
| Hosting | [Vercel](https://vercel.com) |

## Get started

You must have [pnpm](https://pnpm.io). `devEngines` in `package.json` sets the pnpm and Node.js versions. pnpm downloads them if necessary.

```bash
pnpm install
pnpm dev
```

Open [https://trace.localhost](https://trace.localhost). The dev server runs through [Portless](https://portless.sh). Set `PORTLESS=0` to use a plain port.

## Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Start the development server through Portless. |
| `pnpm build` | Make a production build. |
| `pnpm start` | Start the production server. |
| `pnpm lint` | Check the code with Biome. |
| `pnpm format` | Format the code with Biome. |
| `pnpm typecheck` | Make route types and check types with `tsc`. |

## Project structure

```text
src/
├── app/            # Routes: home, about, privacy, support
│   ├── llms.txt/   # /llms.txt for AI agents
│   └── md/         # Markdown version of the home page
├── components/     # UI components
└── lib/            # Site constants, llms.txt text, sample data
public/
├── brand/          # Logos
└── images/         # App screenshots
```

## Content

- Write all copy in [ASD-STE100 Simplified Technical English](https://www.asd-ste100.org).
- Change the brand name, tagline and App Store data in `src/lib/site.ts`.
- When a client sends `Accept: text/markdown`, the site sends the Markdown version of the home page.

## Deployment

Vercel deploys the `main` branch to production.
