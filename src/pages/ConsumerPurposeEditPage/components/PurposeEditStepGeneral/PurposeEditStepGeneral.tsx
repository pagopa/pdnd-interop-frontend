import React from 'react'
import { PurposeQueries } from '@/api/purpose'
import { useParams } from '@/router'
import { NotFoundError } from '@/utils/errors.utils'
import PurposeEditStepGeneralForm, {
  PurposeEditStepGeneralFormSkeleton,
  type PurposeEditStepGeneralFormValues,
} from './PurposeEditStepGeneralForm'
import type { ActiveStepProps } from '@/hooks/useActiveStep'
import { useQuery } from '@tanstack/react-query'

export const PurposeEditStepGeneral: React.FC<ActiveStepProps> = (props) => {
  const { purposeId } = useParams<'SUBSCRIBE_PURPOSE_EDIT'>()
  const { data: purpose, isLoading: isLoadingPurpose } = useQuery(
    PurposeQueries.getSingle(purposeId)
  )

  if (isLoadingPurpose) {
    return <PurposeEditStepGeneralFormSkeleton />
  }

  if (!purpose) {
    throw new NotFoundError()
  }

  const defaultValues: PurposeEditStepGeneralFormValues = {
    title: purpose.title,
    description: purpose.description,
    dailyCalls: purpose.versions[0]?.dailyCalls ?? 1,
    isFreeOfCharge: purpose.isFreeOfCharge ? 'YES' : 'NO',
    freeOfChargeReason: purpose.freeOfChargeReason,
  }

  return <PurposeEditStepGeneralForm purpose={purpose} defaultValues={defaultValues} {...props} />
}
