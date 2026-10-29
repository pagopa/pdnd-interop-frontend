---
name: review-pull-request
description: 'Use when asked to review a pull request or a branch diff. Compare the implementation with the requirements and existing review discussions, verify each candidate finding against the code before reporting it, and separate confirmed defects, concrete test gaps, and limitations of the available evidence.'
argument-hint: 'PR number or URL, or leave empty to review the current branch'
user-invocable: true
---

# Review Pull Request

Produce an evidence-based review. A finding is reported only after it has been checked against the code; anything that could not be checked is reported as a limitation, not as a defect.

Follow the scope, severity levels, and output format in [copilot-instructions.md](../../copilot-instructions.md) and the rules in [react-typescript.instructions.md](../../instructions/react-typescript.instructions.md) and [tests.instructions.md](../../instructions/tests.instructions.md). Do not restate them here.

## Procedure

1. **Gather the change.**
   - Identify the PR from the argument or the current branch. Use `gh` to read its title, description, base branch, changed files, diff, and CI check results.
   - Read changed files in their full context, not just the diff hunks. Ignore generated and noise files listed in `copilot-instructions.md`.
   - If an explicitly requested PR cannot be found, stop and say so. For a branch-diff review without an existing PR, compare against the user-specified base or the repository's configured default branch; ask for the base if neither can be established. Skip PR-only steps and mark PR metadata, discussion, and CI results as unavailable. Stop if the requested diff cannot be read.

2. **Establish the expected behavior.**
   - Collect requirements from the PR description, the linked Jira issue, and the Figma design when the change is UI. Use the [requirements-design-context](../requirements-design-context/SKILL.md) skill when those sources need to be inspected.
   - If the change depends on a backend contract, check it with the [bff-contract](../bff-contract/SKILL.md) skill rather than assuming the generated types are right.
   - Check that the PR description follows [PULL_REQUEST_TEMPLATE.md](../../PULL_REQUEST_TEMPLATE.md) and that its title follows the `<type>: <description>` convention.

3. **Read the existing discussion.**
   - Read review threads, comments, and prior review states with `gh`. Note which comments are resolved, outdated, or still open, and whether the latest commits actually addressed them.
   - Do not repeat a point that is already raised or already fixed. If an open thread is correct, reference it rather than duplicating it; if a "resolved" thread was not actually fixed, report that.

4. **Compare implementation to requirements.**
   - For each requirement, find where it is implemented and note whether it is fully, partially, or not covered. Include states, roles and permissions, error and empty cases, and visible copy.
   - Flag behavior in the diff that no requirement asks for only when it is risky or clearly out of scope.

5. **Draft candidate findings, then verify each one.**
   - For every candidate, open the relevant code and confirm it: trace callers and data flow, read the surrounding component or hook, check the API layer and types, and check whether existing code already handles the case.
   - Use the repo's checks where they help confirm a claim (for example a narrow type check or a targeted test run), and never claim a result you did not obtain.
   - Drop a candidate that cannot be reproduced from the code. Move it to limitations when it depends on something you could not inspect.
   - Do not invent issues. If the PR is fine, say so.

6. **Assess tests.**
   - Apply the "when tests are required" rules in `tests.instructions.md`. Report a test gap only when it names the concrete behavior, branch, state, or error path that has no coverage, and where the test should live.
   - Check that new or changed tests assert user-visible behavior, would fail without the change, and are not skipped or focused. Do not ask for tests on copy, styling, type-only, or trivial changes.

7. **Report.** Write the review in chat. Do not post comments, approve, or request changes on GitHub unless the user explicitly asks. Order by severity and report at most the 10 most relevant findings. Use the finding format from `copilot-instructions.md`, grouped into:
   - **Defects:** confirmed problems in the code (bugs, security, accessibility, rule violations), each with the evidence that confirms it.
   - **Test gaps:** specific, concrete missing coverage as defined above.
   - **Limitations of the evidence:** what you could not verify and why, such as an inaccessible Jira or Figma source, an unmerged backend contract, checks that were not run, or behavior that needs a manual check. These are not defects.
   - Close with a short overall assessment: requirements covered, open discussion still relevant, and CI status.

## Guardrails

- Comment only on lines changed in the PR; do not request rewrites of legacy code the PR did not touch.
- Skip what ESLint, Prettier, Husky, and `tsc` already enforce.
- Never present an unverified suspicion as a defect, and never infer the contents of a source you could not open.
- Keep the review tied to the requirements and the diff; avoid stylistic preferences beyond the repo's rules.
- Do not make code changes during a review unless the user also asks for them.
