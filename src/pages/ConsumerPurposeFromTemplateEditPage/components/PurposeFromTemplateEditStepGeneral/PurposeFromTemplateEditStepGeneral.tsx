import React from 'react'
import { useParams } from '@/router'
import { NotFoundError } from '@/utils/errors.utils'
import type { ActiveStepProps } from '@/hooks/useActiveStep'
import { useQuery } from '@tanstack/react-query'
import { PurposeTemplateQueries } from '@/api/purposeTemplate/purposeTemplate.queries'
import type { PurposeFromTemplateEditStepGeneralFormValues } from './PurposeFromTemplateEditStepGeneralForm'
import PurposeFromTemplateEditStepGeneralForm, {
  PurposeFromTemplateEditStepGeneralFormSkeleton,
} from './PurposeFromTemplateEditStepGeneralForm'
import { PurposeQueries } from '@/api/purpose/purpose.queries'

export const PurposeFromTemplateEditStepGeneral: React.FC<ActiveStepProps> = (props) => {
  const { purposeTemplateId, purposeId } = useParams<'SUBSCRIBE_PURPOSE_FROM_TEMPLATE_EDIT'>()

  const { data: purposeTemplate, isLoading: isLoadingPurposeTemplate } = useQuery(
    PurposeTemplateQueries.getSingle(purposeTemplateId)
  )
  const { data: purpose, isLoading: isLoadingPurpose } = useQuery(
    PurposeQueries.getSingle(purposeId)
  )
  if (isLoadingPurposeTemplate || isLoadingPurpose) {
    return <PurposeFromTemplateEditStepGeneralFormSkeleton />
  }

  if (!purposeTemplate || !purpose) {
    throw new NotFoundError()
  }

  const defaultValues: PurposeFromTemplateEditStepGeneralFormValues = {
    title: purposeTemplate.purposeTitle,
    description: purposeTemplate.purposeDescription,
    dailyCalls: purpose.dailyCallsPerConsumer,
    isFreeOfCharge: purposeTemplate.purposeIsFreeOfCharge === true ? 'YES' : 'NO',
    freeOfChargeReason: purposeTemplate.purposeFreeOfChargeReason ?? '',
    purposeTitle: purpose.title,
  }

  return (
    <PurposeFromTemplateEditStepGeneralForm
      purpose={purpose}
      purposeTemplate={purposeTemplate}
      defaultValues={defaultValues}
      {...props}
    />
  )
}
