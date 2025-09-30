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
import { useTranslation } from 'react-i18next'

export const PurposeFromTemplateEditStepGeneral: React.FC<ActiveStepProps> = (props) => {
  const { purposeTemplateId } = useParams<'SUBSCRIBE_PURPOSE_FROM_TEMPLATE_EDIT'>()
  const { t } = useTranslation('purpose', {
    keyPrefix: 'edit.purposeFromTemplate.technicalInformationsSection',
  })
  const { data: purposeTemplate, isLoading: isLoadingPurposeTemplate } = useQuery(
    PurposeTemplateQueries.getSingle(purposeTemplateId)
  )

  if (isLoadingPurposeTemplate) {
    return <PurposeFromTemplateEditStepGeneralFormSkeleton />
  }

  if (!purposeTemplate) {
    throw new NotFoundError()
  }

  const currentDateString = new Intl.DateTimeFormat('it', {
    dateStyle: 'short',
    timeStyle: 'short',
  })
    .format()
    .replace(',', '')

  const instanceName = `${t('instanceNameField.defaultPurposeInstanceName')} - ${currentDateString}`

  const defaultValues: PurposeFromTemplateEditStepGeneralFormValues = {
    title: purposeTemplate.purposeTitle,
    description: purposeTemplate.description,
    dailyCalls: purposeTemplate.purposeDailyCalls ?? '',
    isFreeOfCharge: purposeTemplate.purposeIsFreeOfCharge === true ? 'YES' : 'NO',
    freeOfChargeReason: purposeTemplate.purposeFreeOfChargeReason,
    instanceName: instanceName,
  }

  return (
    <PurposeFromTemplateEditStepGeneralForm
      purposeTemplate={purposeTemplate}
      defaultValues={defaultValues}
      {...props}
    />
  )
}
