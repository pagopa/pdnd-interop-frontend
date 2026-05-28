import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { useParams } from '@/router'
import { PurposeQueries } from '@/api/purpose'
import { SelfcareQueries } from '@/api/selfcare'
import { AuthHooks } from '@/api/auth'
import { NotFoundError } from '@/utils/errors.utils'
import { SELFCARE_BASE_URL, SELFCARE_PRODUCT_ID } from '@/config/env'
import useCurrentLanguage from '@/hooks/useCurrentLanguage'
import type { ActiveStepProps } from '@/hooks/useActiveStep'
import PurposeEditStepAssignmentForm, {
  PurposeEditStepAssignmentFormSkeleton,
} from './PurposeEditStepAssignmentForm'

export const PurposeEditStepAssignment: React.FC<ActiveStepProps> = (props) => {
  const { purposeId } = useParams<'SUBSCRIBE_PURPOSE_EDIT'>()
  const { jwt } = AuthHooks.useJwt()
  const lang = useCurrentLanguage()

  const { data: purpose, isLoading: isLoadingPurpose } = useQuery(
    PurposeQueries.getSingle(purposeId)
  )

  const tenantId = jwt?.organizationId
  const { data: reviewers, isLoading: isLoadingReviewers } = useQuery({
    ...SelfcareQueries.getUsersByRole({ tenantId: tenantId as string, role: 'reviewer' }),
    enabled: Boolean(tenantId),
  })

  if (isLoadingPurpose || isLoadingReviewers) {
    return <PurposeEditStepAssignmentFormSkeleton />
  }

  if (!purpose) {
    throw new NotFoundError()
  }

  const isDelegate = Boolean(
    purpose.delegation && jwt && purpose.delegation.delegate.id === jwt.organizationId
  )

  const selfcareUsersPageUrl =
    jwt &&
    `${SELFCARE_BASE_URL}/dashboard/${jwt.selfcareId}/users?lang=${lang}#${SELFCARE_PRODUCT_ID}`

  return (
    <PurposeEditStepAssignmentForm
      purpose={purpose}
      reviewers={reviewers ?? []}
      isDelegate={isDelegate}
      selfcareUsersPageUrl={selfcareUsersPageUrl}
      {...props}
    />
  )
}
