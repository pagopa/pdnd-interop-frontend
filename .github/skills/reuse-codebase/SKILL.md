---
name: reuse-codebase
description: 'Use before implementing a new feature or introducing a component, hook, utility, factory, test helper, or similar abstraction. Search this repository for comparable implementations and tests, then recommend reuse, extension, or a justified new implementation.'
argument-hint: 'Describe the feature or the component, hook, utility, factory, or helper you plan to add'
user-invocable: true
---

# Reuse Codebase

Find and evaluate existing implementations before introducing a new one. The goal is to reuse or extend the right code where it fits, not to force reuse when requirements differ.

## When to Use

- Before implementing a feature that may overlap existing behavior.
- Before adding a component, hook, utility, factory, mock, fixture, or test helper.
- When deciding whether existing code should be generalized or a new abstraction is warranted.

## Procedure

1. **Understand what the change needs.**
   - Summarize the feature and identify the behavior, data shape, UI states, and tests it requires.
   - List likely reusable elements: components, hooks, utilities, factories, API patterns, fixtures, mocks, and test helpers.
   - If a key requirement is ambiguous and it affects whether existing code is suitable, ask for clarification before choosing.

2. **Search the relevant parts of the repository.**
   - Use code intelligence or symbol lookup when available. Otherwise search with focused terms for the behavior and its domain concepts, not only the proposed name.
   - Inspect likely locations based on the need: `src/components/shared/`, `src/hooks/`, `src/utils/`, the relevant `src/api/<domain>/` area, and nearby page or feature directories.
   - For test support, inspect nearby `__tests__/` directories and existing mocks or fixtures, including `__mocks__/`.
   - Search for call sites and tests of promising candidates. Read enough surrounding code to understand their contracts and constraints.
   - Keep searches scoped; broaden them only when the initial results do not reveal comparable patterns.

3. **Compare candidates against the requirements.**
   - Check behavior, inputs and outputs, loading/error states, accessibility, localization, permissions, and testability where relevant.
   - Distinguish an exact match from a partial match. Note meaningful gaps, coupling, or domain-specific assumptions that make a candidate unsuitable.
   - Prefer an existing shared implementation when it satisfies the need. Extend it only when the added behavior belongs at that abstraction level and preserves existing callers.
   - Avoid creating a generic abstraction solely to eliminate a small amount of duplication; also avoid reusing code that obscures distinct behavior.

4. **Report the evidence and proceed.**
   - Give the user a concise recommendation: reuse, extend, or create new.
   - Link to the most relevant implementation and tests, and explain briefly why each is or is not a fit.
   - If creating something new, state what you searched and the requirement that existing candidates do not meet.
   - Continue with the requested implementation after this check. Do not stop at a catalog of files unless the user asked only for investigation.

## Guardrails

- Base recommendations on inspected code and tests; do not infer behavior from file names alone.
- Follow the repository's existing structure and conventions, and avoid unrelated refactoring.
- Do not report that a repository-wide search was exhaustive unless it was.
- If a relevant file or source is inaccessible, state the limitation rather than guessing.
