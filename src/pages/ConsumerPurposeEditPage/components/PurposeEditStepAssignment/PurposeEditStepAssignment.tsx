import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { useParams } from '@/router'
import { PurposeQueries } from '@/api/purpose'
import { TenantQueries } from '@/api/tenant'
import { AuthHooks } from '@/api/auth'
import { NotFoundError } from '@/utils/errors.utils'
import { SELFCARE_BASE_URL, SELFCARE_PRODUCT_ID } from '@/config/env'
import useCurrentLanguage from '@/hooks/useCurrentLanguage'
import type { ActiveStepProps } from '@/hooks/useActiveStep'
import type { Purpose } from '@/api/api.generatedTypes'
import PurposeEditStepAssignmentForm, {
  PurposeEditStepAssignmentFormSkeleton,
  type PurposeEditStepAssignmentFormValues,
} from './PurposeEditStepAssignmentForm'
import PurposeEditStepAssignmentReadOnly from './PurposeEditStepAssignmentReadOnly'

const getDefaultValues = (purpose: Purpose): PurposeEditStepAssignmentFormValues => ({
  // A purpose with no persisted review mode has never been assigned: the form starts on
  // self-compilation and self-approval.
  reviewMode: purpose.reviewMode ?? 'ADMIN_WRITES_ADMIN_SIGNS',
  reviewerIds: purpose.reviewerWorkflow?.reviewers?.map(({ userId }) => userId) ?? [],
})

export const PurposeEditStepAssignment: React.FC<ActiveStepProps> = (props) => {
  const { purposeId } = useParams<'SUBSCRIBE_PURPOSE_EDIT'>()
  const { jwt } = AuthHooks.useJwt()
  const lang = useCurrentLanguage()

  const { data: purpose, isLoading: isLoadingPurpose } = useQuery(
    PurposeQueries.getSingle(purposeId)
  )

  // The assignment can be changed until the risk analysis is approved, and only while the purpose
  // is still a draft. The reviewers list is only consumed by the editable branch, so only fetch it
  // when that branch will actually render (avoids a wasted call on the read-only step).
  const isPurposeDraft = purpose?.currentVersion?.state === 'DRAFT'
  const isRiskAnalysisSigned = purpose?.reviewerWorkflow?.signingState === 'SIGNED'
  const isEditable = Boolean(purpose) && isPurposeDraft && !isRiskAnalysisSigned

  const tenantId = jwt?.organizationId
  const { data: reviewers, isLoading: isLoadingReviewers } = useQuery({
    ...TenantQueries.getPartyUsersList({ tenantId: tenantId as string, roles: ['reviewer'] }),
    enabled: Boolean(tenantId) && isEditable,
  })

  if (isLoadingPurpose || isLoadingReviewers) {
    return <PurposeEditStepAssignmentFormSkeleton />
  }

  if (!purpose) {
    throw new NotFoundError()
  }

  if (!isEditable) {
    return <PurposeEditStepAssignmentReadOnly purpose={purpose} {...props} />
  }

  const isDelegate = Boolean(
    purpose.delegation && jwt && purpose.delegation.delegate.id === jwt.organizationId
  )

  const selfcareUsersPageUrl =
    jwt &&
    `${SELFCARE_BASE_URL}/dashboard/${jwt.selfcareId}/users?lang=${lang}#${SELFCARE_PRODUCT_ID}`

  const defaultValues = getDefaultValues(purpose)

  return (
    <PurposeEditStepAssignmentForm
      purpose={purpose}
      reviewers={reviewers ?? []}
      isDelegate={isDelegate}
      selfcareUsersPageUrl={selfcareUsersPageUrl}
      defaultValues={defaultValues}
      {...props}
    />
  )
}
