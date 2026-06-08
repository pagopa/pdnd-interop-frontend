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
  beEnumToReviewModeOption,
  type PurposeEditStepAssignmentFormValues,
} from './PurposeEditStepAssignmentForm'
import PurposeEditStepAssignmentReadOnly from './PurposeEditStepAssignmentReadOnly'

const getDefaultValues = (purpose: Purpose): PurposeEditStepAssignmentFormValues => ({
  reviewMode: beEnumToReviewModeOption(purpose.reviewerWorkflow?.reviewMode),
  reviewerId: purpose.reviewerWorkflow?.reviewerIds[0],
})

export const PurposeEditStepAssignment: React.FC<ActiveStepProps> = (props) => {
  const { purposeId } = useParams<'SUBSCRIBE_PURPOSE_EDIT'>()
  const { jwt } = AuthHooks.useJwt()
  const lang = useCurrentLanguage()

  const { data: purpose, isLoading: isLoadingPurpose } = useQuery(
    PurposeQueries.getSingle(purposeId)
  )

  const tenantId = jwt?.organizationId
  const { data: reviewers, isLoading: isLoadingReviewers } = useQuery({
    ...TenantQueries.getPartyUsersList({ tenantId: tenantId as string, roles: ['reviewer'] }),
    enabled: Boolean(tenantId),
  })

  if (isLoadingPurpose || isLoadingReviewers) {
    return <PurposeEditStepAssignmentFormSkeleton />
  }

  if (!purpose) {
    throw new NotFoundError()
  }

  const isEditableDraft = purpose.currentVersion?.state === 'DRAFT'
  if (purpose.reviewerWorkflow || !isEditableDraft) {
    return (
      <PurposeEditStepAssignmentReadOnly purpose={purpose} reviewers={reviewers ?? []} {...props} />
    )
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
