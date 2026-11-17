---
name: create-pull-request-description
description: "Create a ready-to-paste pull request description using this repository's .github/PULL_REQUEST_TEMPLATE.md. Use when asked to write, draft, generate, or prepare a PR description or pull request body."
argument-hint: 'Optional Jira ticket or target branch'
user-invocable: true
---

# Pull Request Description

Create an accurate, ready-to-paste pull request description that follows this repository's template.

## Procedure

1. Read `.github/PULL_REQUEST_TEMPLATE.md` before drafting. Preserve its headings, emojis, ordering, comments, and checklist items exactly. Replace placeholders with accurate content; do not substitute a generic format.
2. Inspect the current branch, working tree, and changes relevant to the request. Review staged and unstaged diffs and account for relevant untracked files. If the pull request or target branch is known, use it as the comparison. Otherwise use the repository's configured default branch if available. Do not include unrelated changes.
3. Summarize what changed and why, based on the actual diff and user-provided context. Do not claim an issue is fixed unless the evidence supports that. Use the Jira key or link when provided or discoverable from the branch name or conversation.
4. If the Jira issue is not available, ask the user for it before finalizing the description. Do not invent an issue, silently omit the template's issue section, or replace it with `N/A` without the user's confirmation.
5. Do not run tests, builds, or other validation commands automatically. Use validation evidence already available from the conversation or, when the relevant pull request is known and CI results are accessible, report those results with the exact check names and outcomes. Never claim a check passed without evidence. If no validation results are available, say so clearly in the testing section. Run validation only if the user explicitly asks.
6. Return only the completed description in a Markdown code block so it can be copied directly into the pull request. Preserve the template's exact section headings and order:
   - `## 🔗 Issue`
   - `## 📝 Description / Context`
   - `## 🛠 List of changes`
   - `## 🧪 How to test`

## Accuracy and scope

- Do not create or publish a pull request unless the user separately asks for that.
- Do not include unrelated worktree changes as part of the description.
- Use concise bullet points for the list of changes and reproducible instructions for testing.
- If required information is still unavailable after clarification, state that clearly rather than fabricating details.
