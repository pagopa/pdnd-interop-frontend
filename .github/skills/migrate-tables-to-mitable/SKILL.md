---
name: migrate-tables-to-mitable
description: 'Use when replacing an application table component with MITable in pdnd-interop-frontend. Trigger for requests to migrate, convert, or replace tables imported from @pagopa/interop-fe-commons or @mui/material (including files named *Table.tsx).'
argument-hint: 'Name the table component or feature to migrate'
---

# Migrate Tables to MITable

Replace the requested table implementation with the design-system `MITable` while preserving the feature's observable behavior. Keep the migration scoped to the requested table and its directly related tests or row components.

## Procedure

1. **Find the target and its behavior.**
   - Start from the named component or feature. If the request is repository-wide, search `src/` for imports of `Table` or `TableRow` from `@pagopa/interop-fe-commons`, and for `Table`, `TableContainer`, `TableHead`, `TableBody`, `TableCell`, or `TableRow` from `@mui/material` or its subpaths.
   - Inspect the complete table component, row and skeleton components, callers, and nearby tests. Record columns, row identity, pagination, selection, row actions, loading and empty states, links, and permissions before changing code. Sorting is out of scope: do not investigate, preserve, or implement it as part of this migration.
   - Do not migrate unrelated HTML tables, MUI DataGrid usages, or tables whose semantic structure is not an ordinary row-and-column data table.

2. **Verify the installed `MITable` contract.**
   - Confirm that the installed `@pagopa/mui-italia` version exports `MITable` and `MITableColumn` from its public entry point. Read the installed types or package source; do not assume the API from another version or repository.
   - The expected API is data-driven: `columns` provide `id`, `header`, and `renderCell(row)`; `rows` provide the row data. `getRowId`, `isLoading`, `pagination`, table/container props, alignment, and minimum width are optional capabilities when supported by the installed version.
   - If the package version lacks the required export or a needed capability, stop before changing dependencies or extending the design system. Explain the blocker and ask how the user wants to proceed.

3. **Map the existing table to `MITable`.**
   - Import `MITable` and its column type from `@pagopa/mui-italia`; remove obsolete table imports only after their remaining use is checked.
   - Model the existing records as `rows` and define typed columns with stable, unique `id` values. Keep formatting, localization, links, and domain rendering in `renderCell` or existing small row-level helpers.
   - Use `getRowId` with the domain entity's stable identifier where available; do not use array indexes when rows can change order or content.
   - Do not migrate existing row action buttons, menus, or mutation controls; these will not be available in the migrated table. The only row-level affordance is a `>` navigation control that opens that row's details page. Wire it to the existing details route and give it an appropriate localized accessible name. Sorting is not available and must not be added or treated as a migration requirement.
   - Keep pagination in its existing owner and pass the supported pagination contract only when the old table has pagination. Do not introduce duplicate pagination.
   - Replace custom loading rows with `isLoading` only when the built-in skeleton is an acceptable equivalent. When the table has no results and is not loading, render the shared `NoItemResults` component (`@/components/shared/NoItemResults/NoItemResults`) with the existing localized empty-state content. Do not assume `MITable` renders an empty state, and do not show the no-results state while loading.

4. **Check behavior and accessibility changes.**
   - `MITable` presents a table on desktop and a definition-list style layout on mobile. Check both layouts for useful column labels, readable cell content, working links, and the `>` details-navigation control.
   - Provide appropriate accessible names through the supported desktop and mobile table props where required. Keep visible and accessible text localized using the existing i18next conventions.
   - Do not silently drop behaviors requiring unsupported structure, such as row/column spans, grouped headers, expandable nested rows, or editable grid interactions. Stop and report the gap rather than approximating it with inaccessible markup.

5. **Update and validate.**
   - Before replacing the existing table, add or update a focused test that verifies every current column is available to users: assert all column headings and representative cell content for each column using user-facing queries rather than a structural snapshot. Run this test against the existing table first to establish the baseline, then replace the table and run the same test again to confirm no columns or content were lost.
   - Update focused tests to assert other user-observable behavior the migration could affect, especially that `>` opens the correct details page, pagination when present, loading and `NoItemResults` empty states, and accessible names. Verify removed row action buttons or menus are not rendered. Sorting is out of scope and must not be tested or implemented. Follow the repository's Vitest and Testing Library conventions.
   - Run the focused test file(s), then the narrowest applicable lint and TypeScript checks. Review the final diff to ensure only the requested table and necessary related files changed.
   - Report the migrated component(s), preserved behavior, checks run, and any limitation that prevented a migration.

## Guardrails

- Follow `.github/copilot-instructions.md` and the applicable React/TypeScript and test instructions.
- Preserve existing API calls, permission checks, translations, and behavior for features that remain; removing row actions is an intentional exception.
- Do not carry over row action buttons, menus, or mutation controls; only the `>` details-navigation affordance remains available.
- Do not add sorting controls or sorting behavior.
- Do not migrate every table in the repository unless the user explicitly requests a repository-wide migration. For broad requests, inventory candidates first and report tables that need an API decision before editing them.