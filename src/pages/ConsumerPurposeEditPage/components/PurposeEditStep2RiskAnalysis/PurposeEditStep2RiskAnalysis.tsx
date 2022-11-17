import React from 'react'
import { ActiveStepProps } from '@/hooks/useActiveStep'
import { RiskAnalysisForm, RiskAnalysisFormSkeleton } from './RiskAnalysisForm'
import { useRouteParams } from '@/router'
import { PurposeQueries } from '@/api/purpose'
import { NotFoundError } from '@/utils/errors.utils'

export const PurposeEditStep2RiskAnalysis: React.FC<ActiveStepProps> = (props) => {
  const { purposeId } = useRouteParams<'SUBSCRIBE_PURPOSE_EDIT'>()
  const { data: purpose, isLoading: isLoadingPurpose } = PurposeQueries.useGetSingle(purposeId, {
    suspense: false,
  })

  if (isLoadingPurpose) {
    return <RiskAnalysisFormSkeleton />
  }

  if (!purpose) {
    throw new NotFoundError()
  }

  return <RiskAnalysisForm purpose={purpose} {...props} />
}
