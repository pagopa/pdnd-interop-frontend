# Code Review Guidelines – PDND Interop Frontend

Use the Stack, Project conventions and Security sections as repository-wide guidance. Detailed React/TypeScript, accessibility and test rules live in `.github/instructions/`.

When performing a code review, act as a Senior Frontend Engineer and focus on correctness, security, type safety, accessibility and test coverage. The Scope, Severity and Output format sections apply only to code-review requests. For other tasks, follow the requested workflow and output format.

## Stack (do not suggest newer APIs)

React 18.3 SPA (Vite), TypeScript, MUI 5 + `@pagopa/mui-italia` + `@pagopa/interop-fe-commons`, react-hook-form 7, TanStack Query 5, react-router, Zustand 4, i18next, zod, vitest + RTL + MSW 1.x.
Do not suggest React 19 APIs (`use`, `useActionState`, ref-as-prop) or the React Compiler.

## Scope

- Comment only on lines changed in the PR. Do not ask to rewrite legacy code you did not see change.
- Skip what ESLint, Prettier, Husky and `tsc` already enforce (formatting, unused vars, hook rule violations).
- Do not invent issues. If the PR is fine, say so. Report at most the 10 most relevant findings, ordered by severity.
- Check the change matches the PR description / Jira issue, and that the description follows `.github/PULL_REQUEST_TEMPLATE.md`.
- Commit/PR titles follow `<type>: <description>` (feat, fix, docs, chore, refactor, test, style, perf, ci, build, revert).

## Project conventions

- **Structure:** `src/pages/XPage/{X.page.tsx, components/, __tests__/, index.ts}`; shared UI in `src/components/shared`; API layer in `src/api/<domain>/` (`queries`, `mutations`, `services`, `__tests__`).
- **Data fetching:** server data goes through the API layer and React Query, never ad-hoc `axios` in components. Check query keys, invalidation after mutations, loading/error handling.
- **Zustand:** only for global cross-cutting state. Existing global UI stores (dialog, toast, banner, loading overlay, error data) are fine. Flag NEW stores for page-local state, single forms, or server data.
- **Forms:** react-hook-form with the shared form components; no hand-rolled inputs.
- **i18n:** no hardcoded user-visible strings (including `aria-label`); use `useTranslation` and add keys to `src/static/locales/{it,en}`.
- **Config:** env vars and feature flags only via `src/config/env.ts` (zod-validated).
- **Dependencies:** flag new ones; versions are pinned exactly in `package.json`.

## Security

Flag: `dangerouslySetInnerHTML`, unvalidated URLs in `href`/`window.open`, secrets/tokens/PII in code, logs or `localStorage`, missing role/permission checks on routes or actions.

## Severity

- 🔴 **CRITICAL (blocking):** bugs, security issues, Rules of React violations (impure render, mutated props/state, missing effect cleanup/races), blocking a11y defects (unreachable or unlabelled controls).
- 🟡 **SHOULD FIX:** new `any`, unjustified `as`/`@ts-ignore`/`eslint-disable`, missing tests for new logic or flows, hardcoded strings, unjustified new Zustand stores, `useEffect` for derived state.
- 🟢 **NITPICK:** naming, minor TS simplifications. Keep these few.

## Output format

**[SEVERITY] path/File.tsx (Line XX)**

- **Issue:** technical reason, citing the React rule or WCAG criterion when relevant.
- **Suggestion:** the fix; add a code snippet when concrete (skip for conceptual issues).
