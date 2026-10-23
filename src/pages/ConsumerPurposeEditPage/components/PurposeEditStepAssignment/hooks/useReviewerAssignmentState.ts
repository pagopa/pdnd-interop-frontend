import type { Purpose, User } from '@/api/api.generatedTypes'

export const useReviewerAssignmentState = (
  purpose: Purpose,
  reviewers: Array<User>,
  isDelegate: boolean
) => {
  const assignedReviewers = purpose.reviewerWorkflow?.reviewers ?? []
  const assignedReviewerIds = assignedReviewers.map(({ userId }) => userId)
  const availableReviewerIds = reviewers.map(({ userId }) => userId)

  const removedReviewers = assignedReviewers.filter(
    (assigned) => !reviewers.some((user) => user.userId === assigned.userId)
  )
  const removedReviewerIds = removedReviewers.map(({ userId }) => userId)

  const hasRemovedReviewers = removedReviewers.length > 0
  const hasNoReviewers = reviewers.length === 0

  const hasAvailableAssignedReviewers = assignedReviewers.some(({ userId }) =>
    availableReviewerIds.includes(userId)
  )

  const hasLostItsOnlyReviewers = !isDelegate && hasNoReviewers && hasRemovedReviewers

  const isFormHidden = isDelegate || hasNoReviewers

  return {
    assignedReviewers,
    assignedReviewerIds,
    removedReviewers,
    removedReviewerIds,
    hasRemovedReviewers,
    hasNoReviewers,
    hasAvailableAssignedReviewers,
    hasLostItsOnlyReviewers,
    isFormHidden,
  }
}
