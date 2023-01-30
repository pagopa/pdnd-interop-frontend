import React from 'react'
import { PurposeQueries } from '@/api/purpose'
import { useRouteParams } from '@/router'
import { NotFoundError } from '@/utils/errors.utils'
import PurposeEditStep1GeneralForm, {
  PurposeEditStep1GeneralFormSkeleton,
} from './PurposeEditStep1GeneralForm'
import { ActiveStepProps } from '@/hooks/useActiveStep'

export const PurposeEditStep1General: React.FC<ActiveStepProps> = (props) => {
  const { purposeId } = useRouteParams<'SUBSCRIBE_PURPOSE_EDIT'>()
  const { data: purpose, isLoading: isLoadingPurpose } = PurposeQueries.useGetSingle(purposeId, {
    suspense: false,
  })

  if (isLoadingPurpose) {
    return <PurposeEditStep1GeneralFormSkeleton />
  }

  if (!purpose) {
    throw new NotFoundError()
  }

  const defaultValues = {
    title: purpose.title,
    description: purpose.description,
    dailyCalls: purpose.versions[0]?.dailyCalls ?? 1,
  }

  return <PurposeEditStep1GeneralForm purpose={purpose} defaultValues={defaultValues} {...props} />
}
