---
name: bff-contract
description: 'Use when a change depends on a backend API contract: a new or changed BFF endpoint, request or response shape, enum, or schema, or when src/api/api.generatedTypes.ts may be outdated. Identify the source contract, regenerate types only when necessary, and follow the change through services, queries, mutations, callers, request/response handling, mocks, and tests.'
argument-hint: 'Optional endpoint, schema name, Jira issue, or interop-be-monorepo PR/branch'
user-invocable: true
---

# bff-contract

Establish what the backend contract actually is, then trace every place in the frontend affected by it. Do not guess contract details from the UI, a ticket title, or the existing generated types alone.

## Procedure

1. **Identify the source contract.**
   - The contract is the BFF OpenAPI file `bffApi.yml` in `pagopa/interop-be-monorepo` (`packages/api-clients/open-api/`), as referenced by [open-api-type-generator.js](../../../scripts/open-api-type-generator.js). The generator reads it from the `develop` branch.
   - If the change depends on an unmerged backend change, ask the user for the PR or branch that holds the contract. Do not assume `develop` already contains it.
   - Record the endpoints, parameters, request bodies, response schemas, enums, and error responses that matter to the task. If the contract cannot be accessed, say so rather than inferring it.

2. **Decide whether to regenerate types.**
   - Compare the source contract with [api.generatedTypes.ts](../../../src/api/api.generatedTypes.ts) for the schemas and operations involved.
   - If the generated file already matches, do not regenerate.
   - If it is outdated, run `pnpm generate-types` and review the diff. This file is generated: never edit it by hand and do not hand-write replacement types for contract schemas.
   - The generator targets `develop`. If the needed contract lives elsewhere, or the diff contains unrelated contract changes, tell the user before keeping the regenerated file instead of silently including the noise.
   - Treat removed, renamed, or newly required fields and changed enums as breaking, and call them out.

3. **Follow the change through the API layer.**
   - Work in `src/api/<domain>/`: `*.services.ts` (axios calls and the generated types they use), `*.queries.ts` (query keys, options, `select`), `*.mutations.ts` (invalidation and cache updates after the mutation), and `index.ts` exports.
   - Server data goes through this layer and React Query. Do not add ad-hoc `axios` calls in components.
   - Check URL paths, params, request bodies, response types, error handling (including domain error mapping in [errors.utils.ts](../../../src/utils/errors.utils.ts)), and query keys that depend on changed params.
   - Use `src/api/api.types.ts` only for frontend-specific API types, not to restate contract schemas.

4. **Find affected callers.**
   - Search for usages of every changed type, service, query, mutation, and enum value across `src/` (hooks, pages, components, dialogs, utils). Use symbol usages or LSP references where available, plus text search for string literals such as enum values.
   - Run `pnpm exec tsc --noEmit -p tsconfig.app.json` to surface type breaks, but still inspect runtime-only uses that types do not catch (string comparisons, switch statements, i18n keys keyed on enums, form default values).
   - Check forms, validation schemas, and mapping code for added, removed, or optional fields. Add i18n keys in `src/static/locales/{it,en}` for new user-visible enum values or states.

5. **Update mocks and tests.**
   - Update the factories in `__mocks__/data/*.mocks.ts` (built with `createMockFactory`) so they stay valid against the new types and cover the new shape. Prefer adjusting the shared factory over per-test overrides when the contract itself changed.
   - Update or add tests next to the changed code: `src/api/<domain>/__tests__/` for services and mutations, and the hook, component, or page tests for affected callers. Cover new fields, new states, and error paths.
   - Follow [tests.instructions.md](../../instructions/tests.instructions.md) and [react-typescript.instructions.md](../../instructions/react-typescript.instructions.md).

6. **Verify and report.**
   - Run the narrowest relevant checks: type check, lint on changed files, and the tests for the touched areas. Escalate to the full suite only if the targeted results require it.
   - Report: the contract source used, whether types were regenerated and why, breaking changes found, files updated by layer (services, queries/mutations, callers, mocks, tests), and any gap you could not verify, such as an inaccessible contract or tests not run.

## Guardrails

- Never edit `src/api/api.generatedTypes.ts` manually.
- Do not regenerate "just in case"; regenerate only when the contract diff requires it.
- Do not invent endpoints or fields the contract does not define; if the frontend needs something the contract lacks, flag it for the backend team.
- Keep changes scoped to the contract change; avoid unrelated refactoring of API code.
- Never claim a check passed without having run it.
