---
name: frontend-pr-review
description: >-
  Review a pull request in pagopa/pdnd-interop-frontend. Compare the changes with this
  repository's frontend conventions and available requirements, verify review candidates, and
  report findings in chat without posting to GitHub.
argument-hint: '<PR number or URL>'
user-invocable: true
---

# Frontend pull request review

Review a pull request on https://github.com/pagopa/pdnd-interop-frontend and write the review in
chat. This is a read-only review: do not modify the user's checkout, commit, push, approve, or
post comments or reviews to GitHub. The separate `review-pull-request` skill is the simpler
single-reviewer workflow; use this skill when the user requests this multi-pass review.

Use the repository's `.github/copilot-instructions.md` as the review baseline, together with
applicable `.github/instructions/*.instructions.md` files. Do not rely on `AGENTS.md` or
backend-specific reference repositories: this repository has no `AGENTS.md`, and its own
frontend rules and implementations are the source of truth.

## 1. Set up the review

The argument must identify a PR number or URL. Use `gh` to read it from
`pagopa/pdnd-interop-frontend`. If it cannot be identified, stop and report that. Get the
repository root with `git rev-parse --show-toplevel`. Create a uniquely named directory under
`$TMPDIR/pdnd-interop-frontend-pr-review/` (or `/tmp` if `$TMPDIR` is unset) for review
context and pass outputs.

Read the PR title, author, URL, body, base and head branches, head SHA, changed files, checks,
conversation comments, reviews, and review threads, including resolution and outdated status.
Use `gh` for GitHub reads. If a data source is unavailable, state the limitation; do not infer
its contents.

Fetch the PR head and base branch, then create a detached worktree at the exact PR head in the
review directory. Compute the merge base against the PR's base branch, not an assumed default
branch. Read changed files from that worktree, never from the user's checkout. Remove only the
worktree created for this review before returning the final response, including when a later
step fails.

Review the full diff and relevant file context. Include dependency manifest changes in scope;
do not spend time reviewing generated output or lockfile churn line by line. Do not exclude a
generated file if the PR changes its source or the generated output itself is the subject of the
change.

Write a `context.md` in the review directory with the PR metadata, description, changed-file
list, diff SHAs, check status, discussion and review threads, plus any requirements/design
evidence that was accessible. Include unresolved and resolved thread state. Keep unavailable
sources explicit; do not make up missing context.

## 2. Establish expected behavior

Use the PR description, branch name, and linked sources to identify the intended behavior.
Check the PR description against `.github/PULL_REQUEST_TEMPLATE.md` and the title against the
`<type>: <description>` convention in `.github/copilot-instructions.md`.

- If a Jira issue is linked or identifiable, use the `requirements-design-context` skill to
  inspect it when Atlassian access is available. If unavailable, continue with the evidence at
  hand and report the limitation; Jira access is not a prerequisite for reviewing.
- For visual changes, inspect the exact linked Figma node using the same skill when a link and
  authorized Figma integration are available. Do not assume a design exists or substitute a
  different frame.
- When a change depends on a backend API contract or generated API types, use the
  `bff-contract` skill to verify the contract and its frontend call sites.
- If no requirement or design source is available, use the PR description and codebase context
  as the baseline, and say which external sources were not available.

Read prior review threads and check whether open comments were addressed by the latest diff.
Avoid duplicating a valid open finding. If a resolved or outdated thread still identifies an
unfixed issue in changed code, verify it before reporting.

## 3. Start independent passes

Run these passes in parallel when agent dispatch is available. Give each the same literal
worktree path, base and head SHAs, the diff command `git diff <BASE_SHA> <HEAD_SHA>`, PR context
file, read-only constraint, and a short summary of the intended behavior. Agents must read the PR
version of files from the worktree and must not edit files or contact GitHub.

| Pass                 | Agent                                | Focus                                                                                            |
| -------------------- | ------------------------------------ | ------------------------------------------------------------------------------------------------ |
| Independent review   | `pr-review-independent`              | Requirements, correctness, data flow, contracts, async/state, accessibility, security, and tests |
| Written-rule check   | `pr-review-guidelines`               | Explicit rules in the repo instructions and PR template                                          |
| Cleanup review       | `pr-review-cleanup`                  | Safe reuse, simplification, and efficiency improvements only                                     |
| Independent bug pass | Built-in `code-review`, if available | Bugs in changed lines                                                                            |

If a pass or agent is unavailable, continue with the available passes and report what was
skipped. The main reviewer remains responsible for validating all candidates.
Wait for the available passes to finish, merge duplicate candidates, and independently verify
each surviving finding against the PR worktree before reporting it.

## 4. Verify candidate findings

Read the changed files in context and trace relevant callers, API services, React Query keys and
invalidations, forms, routes, permissions, i18n keys, and tests. Use frontend implementations in
this repository as prior art. Apply the relevant written rules:

- `.github/copilot-instructions.md` for project structure, data fetching, state, forms, i18n,
  configuration, security, review scope, and severity.
- `.github/instructions/react-typescript.instructions.md` for changed `src/**/*.ts(x)` files.
- `.github/instructions/tests.instructions.md` for changed test files.

Keep findings on changed lines. Skip formatting and issues already enforced by ESLint, Prettier,
Husky, or TypeScript. For each candidate, try to refute it by tracing validation, existing
patterns, paired changes, and actual types. Keep only confirmed issues with a concrete failure
scenario. A test gap must name the specific behavior or branch without coverage and why the
project's test rules require coverage. Do not request tests for copy, styling, type-only changes,
or trivial refactors.

Run only checks that can resolve a concrete question. The project uses pnpm; targeted tests can
be run with `pnpm test -- <test-file>`. Do not claim a check passed unless it was run. A fresh
worktree may need `pnpm install --frozen-lockfile` before tests. Do not rerun full CI checks just
to repeat their reported results.

Keep cleanups separate from defects and only include short, behavior-preserving changes that
clearly simplify changed code. Drop cleanups that alter behavior.

## 5. Report and clean up

Remove the review worktree before returning. Write the review in chat only; do not offer to post
it as a pending GitHub review. If the user separately asks to post comments, treat that as a
separate request and obtain any required confirmation before writing to GitHub.

Report up to the 10 most relevant findings, ordered by severity. Use the severity levels and
the exact per-finding format from `.github/copilot-instructions.md`. Separate confirmed defects
from concrete test gaps and limitations of the available evidence. Keep cleanups in their own
section.

Suggested structure:

```markdown
## Findings

### Defects

**[CRITICAL] path/File.tsx (Line XX)**

- **Issue:** <confirmed failure scenario, with evidence>
- **Suggestion:** <specific fix>

## Test gaps

**[SHOULD FIX] path/to/changed-file.tsx (Line XX)**

- **Issue:** <specific behavior or branch not covered, and why>
- **Suggestion:** <focused test to add, naming the expected test location>

## Limitations

- <source or check unavailable, and why>

## Cleanups

- <optional behavior-preserving improvement and changed line>

## Overall assessment

<brief summary of requirement coverage, relevant open discussions, and CI status>
```

If no findings or test gaps survive verification, say so plainly. Do not present missing
requirements, unavailable integrations, or unrun checks as defects.
