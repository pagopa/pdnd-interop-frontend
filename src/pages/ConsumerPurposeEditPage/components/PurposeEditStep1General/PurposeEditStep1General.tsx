import React from 'react'
import { PurposeQueries } from '@/api/purpose'
import { useParams } from '@/router'
import { NotFoundError } from '@/utils/errors.utils'
import PurposeEditStep1GeneralForm, {
  PurposeEditStep1GeneralFormSkeleton,
  type PurposeEditStep1GeneralFormValues,
} from './PurposeEditStep1GeneralForm'
import type { ActiveStepProps } from '@/hooks/useActiveStep'

export const PurposeEditStep1General: React.FC<ActiveStepProps> = (props) => {
  const { purposeId } = useParams<'SUBSCRIBE_PURPOSE_EDIT'>()
  const { data: purpose, isLoading: isLoadingPurpose } = PurposeQueries.useGetSingle(purposeId, {
    suspense: false,
  })

  if (isLoadingPurpose) {
    return <PurposeEditStep1GeneralFormSkeleton />
  }

  if (!purpose) {
    throw new NotFoundError()
  }

  const defaultValues: PurposeEditStep1GeneralFormValues = {
    title: purpose.title,
    description: purpose.description,
    dailyCalls: purpose.versions[0]?.dailyCalls ?? 1,
    isFreeOfCharge: purpose.isFreeOfCharge ? 'SI' : 'NO',
    freeOfChargeReason: purpose.freeOfChargeReason,
    eserviceId: purpose.eservice.id,
  }

  return <PurposeEditStep1GeneralForm purpose={purpose} defaultValues={defaultValues} {...props} />
}
