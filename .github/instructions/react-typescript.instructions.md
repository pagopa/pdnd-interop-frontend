---
applyTo: 'src/**/*.{ts,tsx}'
---

# React & TypeScript rules

## Typing

- Flag new `any`: require a specific type, `unknown` + narrowing, or generics. Ignore `src/api/api.generatedTypes.ts`.
- Flag `as Type` unless justified in a comment; prefer type guards (`value is Type`) or zod validation. Allowed: `as const`, `satisfies`, and mocks in tests.
- Flag new `@ts-ignore`, `@ts-expect-error` without explanation, and `eslint-disable` additions.
- Model async or polymorphic state with discriminated unions rather than scattered optional flags.
- Use exact DOM event types (`React.ChangeEvent<HTMLInputElement>`).

## Rules of React (what lint cannot catch)

- Render must be pure: no mutation of props, state, hook arguments or objects created before render; no `Math.random()` / `Date.now()` during render.
- Never call components as functions (`MyComponent()`); always use JSX.
- `useEffect` must not compute derived state or sync state from props: compute inline during render.
- Effects with subscriptions, timers or async calls need cleanup or cancellation (`AbortController`, ignore-flag) to avoid leaks and races.
- Do not suggest `useMemo`/`useCallback`/`React.memo` without evidence of a real performance problem (e.g. heavy list, expensive computation).

## Accessibility (WCAG 2.1/2.2 AA)

- Use native semantics (`button`, `a`, `nav`, `main`). Reject `div`/`span` with `onClick`, and `<a href="#">` used as a button.
- Icon-only buttons and links need an accessible name (`aria-label` from i18n, or `aria-labelledby`).
- Form inputs need a programmatic label (`label` + `htmlFor`/`id`, or MUI `label`); link errors with `aria-describedby` / `aria-invalid`.
- Never remove focus outlines (`outline: none`) without a `:focus-visible` replacement.
- MUI `Dialog`/`Drawer` already handle focus trap and `Escape`; only check custom overlays or popovers.
- Toasts, inline errors and async status updates should be announced (`role="alert"` / `aria-live`).
- `<img>` needs `alt`; decorative images use `alt=""` or `aria-hidden`.
- Check color contrast on custom colors, and heading order.
- Do not add redundant ARIA on native elements.
