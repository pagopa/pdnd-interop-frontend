import React from 'react'
import type { ActiveStepProps } from '@/hooks/useActiveStep'
import { RiskAnalysisForm, RiskAnalysisFormSkeleton } from './RiskAnalysisForm'
import { useParams } from '@/router'
import { PurposeQueries } from '@/api/purpose'
import { NotFoundError } from '@/utils/errors.utils'

export const PurposeEditStep2RiskAnalysis: React.FC<ActiveStepProps> = (props) => {
  const { purposeId } = useParams<'SUBSCRIBE_PURPOSE_EDIT'>()
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
