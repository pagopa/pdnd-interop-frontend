import React from 'react'
import { useParams } from '@/router'
import { NotFoundError } from '@/utils/errors.utils'
import type { ActiveStepProps } from '@/hooks/useActiveStep'
import { useQuery } from '@tanstack/react-query'
import { PurposeTemplateQueries } from '@/api/purposeTemplate/purposeTemplate.queries'
import type { PurposeTemplateEditStepGeneralFormValues } from './PurposeTemplateEditStepGeneralForm'
import PurposeTemplateEditStepGeneralForm, {
  PurposeTemplateEditStepGeneralFormSkeleton,
} from './PurposeTemplateEditStepGeneralForm'

export const PurposeTemplateEditStepGeneral: React.FC<ActiveStepProps> = (props) => {
  const { purposeTemplateId } = useParams<'SUBCRIBE_PURPOSE_TEMPLATE_EDIT'>()
  const { data: purposeTemplate, isLoading: isLoadingPurpose } = useQuery(
    PurposeTemplateQueries.getSingle(purposeTemplateId)
  )

  if (isLoadingPurpose) {
    return <PurposeTemplateEditStepGeneralFormSkeleton />
  }

  if (!purposeTemplate) {
    throw new NotFoundError()
  }

  const defaultValues: PurposeTemplateEditStepGeneralFormValues = {
    title: purposeTemplate.purposeTitle,
    description: purposeTemplate.purposeDescription,
    dailyCalls: purposeTemplate.purposeDailyCalls,
    isFreeOfCharge: purposeTemplate.purposeIsFreeOfCharge ? 'YES' : 'NO',
    freeOfChargeReason: purposeTemplate.purposeFreeOfChargeReason,
  }

  return (
    <PurposeTemplateEditStepGeneralForm
      purposeTemplate={purposeTemplate}
      defaultValues={defaultValues}
      {...props}
    />
  )
}
