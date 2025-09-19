import React from 'react'
import { useParams } from '@/router'
import type { ActiveStepProps } from '@/hooks/useActiveStep'
import { useQuery } from '@tanstack/react-query'
import { PurposeTemplateQueries } from '@/api/purposeTemplate/purposeTemplate.queries'
import type { PurposeTemplateEditStepGeneralFormValues } from './PurposeTemplateEditStepGeneralForm'
import PurposeTemplateEditStepGeneralForm, {
  PurposeTemplateEditStepGeneralFormSkeleton,
} from './PurposeTemplateEditStepGeneralForm'
import { useTranslation } from 'react-i18next'
import { NotFoundError } from '@/utils/errors.utils'

export const PurposeTemplateEditStepGeneral: React.FC<ActiveStepProps> = (props) => {
  const { t } = useTranslation('purposeTemplate', { keyPrefix: 'edit.defaultPurposeTemplate' })

  const { purposeTemplateId } = useParams<'SUBSCRIBE_PURPOSE_TEMPLATE_EDIT'>()
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
    title: (purposeTemplate && purposeTemplate.purposeTitle) ?? t('title'),
    description: (purposeTemplate && purposeTemplate.purposeDescription) ?? t('description'),
    dailyCalls: purposeTemplate?.purposeDailyCalls,
    isFreeOfCharge: purposeTemplate?.purposeIsFreeOfCharge ? 'YES' : 'NO',
    freeOfChargeReason:
      (purposeTemplate && purposeTemplate.purposeFreeOfChargeReason) ?? t('freeOfChargeReason'),
  }

  return (
    <PurposeTemplateEditStepGeneralForm
      purposeTemplate={purposeTemplate}
      defaultValues={defaultValues}
      {...props}
    />
  )
}
