---
applyTo: '**/*.test.{ts,tsx}'
---

# Test rules (vitest + React Testing Library + MSW 1.x)

## When tests are required

- New business logic, user flows, forms, and bug fixes need new or updated tests.
- Do NOT require tests for copy changes, styling, type-only changes, or trivial refactors.
- Missing tests are "SHOULD FIX"; escalate to CRITICAL only for new critical flows (e.g. permissions, agreement/purpose state transitions, voucher/keys).

## Conventions

- Use the helpers in `src/utils/testing.utils.tsx` (`renderWithApplicationContext`, `createMockFactory`, etc.) and the mocks in `__mocks__/data/`.
- Mock network calls with MSW handlers or the API layer, not by stubbing components.
- API layer tests live in `src/api/<domain>/__tests__`; page and component tests in the sibling `__tests__` folder.

## Queries and interactions (apply to new or modified lines only)

- Prefer accessible queries: `getByRole(..., { name })`, `getByLabelText`, `findByRole`. If an element cannot be queried that way, it is likely an accessibility defect in the component.
- `getByTestId`, CSS selectors and `querySelector` are discouraged: flag them in new tests, but do not ask for rewrites of untouched legacy tests.
- Prefer `userEvent` (`setup()`) over `fireEvent`. Add keyboard interactions (`tab`, `keyboard`) for new interactive components.
- Use `findBy*` / `waitFor` for async UI; avoid arbitrary timeouts.
- Assert user-visible behavior, not implementation details (internal state, call counts of internal helpers).
- Flag `.only`, `.skip` and commented-out tests.
