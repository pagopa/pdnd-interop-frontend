---
name: migrate-to-nuqs-filters
description: 'Use when replacing the legacy Filters or useFilters from @pagopa/interop-fe-commons on a page with the local nuqs-based useFilters hook and FiltersSection. Trigger on requests such as "replace the old Filters in page X". Require regression tests to pass before and after migration.'
argument-hint: 'Page name, route, or source file to migrate'
---

# Migrate a page to nuqs filters

Replace a page's legacy `Filters` integration from `@pagopa/interop-fe-commons` with the local `useFilters` hook and `FiltersSection`, while preserving how users interact with filters and how they affect the page's results. Replacing legacy pagination with `MIPagination` is optional and requires the user's explicit request.

## Scope

- Change only the requested page's filter component and hook integration, including page-local field and payload mapping, and the tests needed to verify it.
- Treat shared implementations such as [useFilters.ts](../../../src/hooks/useFilters.ts) and [FiltersSection.tsx](../../../src/components/shared/Filters/FiltersSection.tsx) as read-only. Do not modify shared hooks, components, or unrelated pages.
- Do not replace or otherwise change pagination as part of the filter migration unless the user explicitly requests replacing the page's pagination with `MIPagination`.
- If the page uses legacy pagination and the skill invocation does not explicitly request its replacement, ask the user whether to include the `MIPagination` migration before making changes to pagination. Proceed with the filter migration if the user declines.
- If a behavior needed for the filter migration cannot be preserved within this scope, explain the conflict and ask the user before expanding it; do not silently change behavior or shared code.

## Procedure

1. **Trace the current page behavior.**
   - Before editing, identify and follow the applicable repository instructions (for example, `.github/copilot-instructions.md`, matching files under `.github/instructions/`, and any applicable `AGENTS.md`). Use them for implementation style, accessibility, typing, and test conventions; do not duplicate their general rules in this skill.
   - Find the page and identify its legacy `Filters`/`useFilters` imports, filter field definitions, query parameter construction, pagination component/hook, sorting, and conditional rendering.
   - Record the behavior users depend on: filter types and option values, when changes are applied, clear/reset behavior, query payload mapping, sorting, and any dynamic autocomplete options. Note existing URL parameter names and parsing as implementation details, but do not treat the legacy URL encoding as a compatibility requirement.
   - Treat returning to the initial pagination offset after applying filters or resetting them as the expected behavior, consistent with `useFilters` and [ConsumerEServiceCatalog.page.tsx](../../../src/pages/ConsumerEServiceCatalogPage/ConsumerEServiceCatalog.page.tsx). Do not preserve a legacy behavior that keeps the current offset on reset.
   - If the page uses legacy pagination and the user has not explicitly requested replacing it with `MIPagination`, ask whether to include that additional migration. Do not interpret invoking this filter-migration skill as consent to change pagination.
   - Use [ConsumerEServiceCatalog.page.tsx](../../../src/pages/ConsumerEServiceCatalogPage/ConsumerEServiceCatalog.page.tsx) as the implementation reference, not as a source to copy domain-specific fields or payload mappings.

2. **Write regression tests before changing the implementation.**
   - Add or extend tests at the page boundary to exercise the existing implementation. Prefer accessible UI interactions and assertions on URL-derived values or the page's API/query payload over assertions about component internals.
   - Cover the behaviors relevant to this page, including pre-populated filter state, applying filters, reset/clear, conversion or omission of values in the API payload, and returning pagination to its initial offset after applying filters and resetting them. Cover sorting or dynamic options when supported. If the user requests pagination replacement, also verify page navigation and page-size changes, preserving the existing defaults and choices.
   - Use the test setup appropriate to the existing implementation. After migration, the local hook can be exercised with `NuqsTestingAdapter`; see the [catalog page tests](../../../src/pages/ConsumerEServiceCatalogPage/__test__/ConsumerEServiceCatalog.page.test.tsx) for page-level examples.
   - Run the focused test file against the legacy implementation and resolve failures before proceeding. Keep assertions behavior-focused so the same regression cases can run against the replacement. If an accessible selector must change because of an intentional UI difference, preserve an equivalent interaction/assertion and explain why.

3. **Replace the legacy integration.**
   - Define the page's fields using the types in [filters.types.ts](../../../src/types/filters.types.ts), then use the local [useFilters](../../../src/hooks/useFilters.ts) and pass its values and handlers to [FiltersSection](../../../src/components/shared/Filters/FiltersSection.tsx).
   - Keep query-string keys where practical and preserve the API behavior, but the new filters do not need to read or emit the legacy filters' URL serialization. Do not add a page-specific compatibility layer for old bookmarked URLs unless the user explicitly requests it. Tests after migration should initialize URL state using the new hook's format while preserving the behavior-focused assertions and expected API payload.
   - Add page-specific mapping where UI values differ from API values (for example, an `ALL` option that should not be sent); do not copy the catalog's mapping blindly.
   - Preserve special handling for `false`, empty strings, empty arrays, `null`, dates, and multi-value fields according to the existing page/API contract. In particular, do not omit `false` unless the old behavior and API contract treat it as empty.
   - Only when explicitly requested by the user, replace the legacy `Pagination` component with `MIPagination` and use the local `usePagination` hook. Follow [ConsumerEServiceCatalog.page.tsx](../../../src/pages/ConsumerEServiceCatalogPage/ConsumerEServiceCatalog.page.tsx) for wiring: pass its `page`, `itemsPerPageOptions`, total page `count`, and route `onChange` to `paginationProps.onPageChange`. Preserve pagination defaults, available page-size options, and conditional display behavior.
   - Do not otherwise change pagination, sorting, dynamic autocomplete input, or conditional display behavior. Use the `useFilters` offset-reset behavior directly for both filter changes and reset; do not add page-specific logic to restore the previous offset after reset, even if the legacy page did so.

4. **Run the same regression tests against the replacement.**
   - Re-run the focused page test and confirm the same user-visible filter behavior and API results are covered and pass with the local hook and section. Update only URL setup/expectations that depended on the old serialization; do not weaken behavior assertions.
   - Run any directly affected hook/component tests and the project's type check if the migration changes types or page wiring. Project commands are defined in [package.json](../../../package.json); the focused test runner is `pnpm exec vitest run <test-file>`.
   - Report the files migrated, the behaviors covered before and after, and exact checks run. State that legacy URL serialization is not preserved; call out any other intentional behavior change instead of silently changing the regression expectations.

## Reference implementation

- [ConsumerEServiceCatalog.page.tsx](../../../src/pages/ConsumerEServiceCatalogPage/ConsumerEServiceCatalog.page.tsx)
- [ConsumerEServiceCatalog.page.test.tsx](../../../src/pages/ConsumerEServiceCatalogPage/__test__/ConsumerEServiceCatalog.page.test.tsx)
- [useFilters.ts](../../../src/hooks/useFilters.ts)
- [FiltersSection.tsx](../../../src/components/shared/Filters/FiltersSection.tsx)
