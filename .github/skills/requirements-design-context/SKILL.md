---
name: requirements-design-context
description: 'Use when starting or reviewing a UI change that depends on a Jira ticket, issue discussion, product requirements, or Figma design. Gather the relevant requirements and exact linked design context, capture behavior and copy, and report conflicts or unavailable sources before assumptions are made.'
argument-hint: 'Optional Jira issue, PR, or Figma node URL'
user-invocable: true
---

# Requirements and Design Context

Build an evidence-based summary of the requested behavior and design before implementation or review. Do not invent missing requirements or silently choose between conflicting sources.

## Procedure

1. **Identify the change and its sources.**
   - Start with the user's request and any supplied Jira issue, PR, branch, or Figma URL.
   - If an issue or design link is discoverable from the PR, branch, or conversation, use that exact reference.
   - If an important reference is missing and cannot be found, ask the user for it when it is necessary to establish expected behavior. Otherwise continue with the available evidence and state the limitation.

2. **Inspect the issue and discussion.**
   - When configured and authorized, use the Atlassian MCP integration to read the relevant Jira ticket description, acceptance criteria, and comments that affect the requested change. Otherwise use another available issue integration.
   - Distinguish agreed requirements from questions, proposals, obsolete comments, and unresolved discussion. Do not treat every comment as an approved requirement.
   - If the issue or its discussion cannot be accessed, say which source was unavailable; do not infer its contents from the issue key or title.

3. **Inspect the exact Figma design when relevant.**
   - Follow the provided or linked Figma URL to the exact file and node/frame. When configured and authorized, use the Figma MCP integration to inspect that node's context and, when useful, its screenshot. Otherwise use another available Figma integration.
   - Do not substitute a nearby frame, a whole-page guess, or a different design version for an unavailable or ambiguous node. Report when access is denied, the link is incomplete, or the target cannot be identified.
   - Capture behavior and visible copy relevant to the requested change. Preserve exact wording and language when it is visible; do not transcribe unrelated content.
   - For a non-visual change, or when no Figma design is relevant, say that Figma review was not applicable rather than implying it was completed.

4. **Compare evidence and surface uncertainty.**
   - Compare the user's request, ticket requirements and discussion, and the exact design node. Record which source supports each important behavior or copy requirement.
   - Call out contradictions, missing states, unclear role or permission behavior, and differences between ticket copy and design copy. Do not decide which source takes precedence unless the user or project explicitly established that rule.
   - Ask the user to resolve a conflict if it changes implementation or user-visible behavior. For minor uncertainty, proceed only with a clearly stated, low-risk assumption.

5. **Return a concise context summary.**
   - Include the requested outcome, confirmed behavior and states, relevant roles/permissions, and exact user-visible copy where applicable.
   - Link the issue and exact Figma node when available.
   - Separate confirmed requirements, unresolved questions or conflicts, and inaccessible or unreviewed sources.
   - For a review, use this summary as the expected behavior baseline; do not report a mismatch unless the implementation and evidence support it.

## Guardrails

- MCP integration should be used when available and authorized for inspecting Figma designs.
- Use only integrations and sources actually available and authorized in the current Copilot client. Atlassian and Figma MCP are optional; never assume they are configured. Never claim to have opened a ticket or design if the integration was unavailable or the operation failed.
- Do not request, expose, or store credentials or access tokens. If authentication or permissions prevent access, report the limitation and ask the user to provide the relevant context or configure access through their approved setup.
- Keep the inspection scoped to the relevant ticket discussion and exact design node.
- Do not make code changes as part of context gathering unless the user also asks for implementation.
