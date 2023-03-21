import React from 'react'
import { ClientQueries } from '@/api/client'
import {
  InformationContainer,
  SectionContainer,
  SectionContainerSkeleton,
} from '@/components/layout/containers'
import { StatusChip } from '@/components/shared/StatusChip'
import { Stack } from '@mui/material'
import { useTranslation } from 'react-i18next'

interface OperatorGeneralInfoSectionProps {
  operatorId: string
}

export const OperatorGeneralInfoSection: React.FC<OperatorGeneralInfoSectionProps> = ({
  operatorId,
}) => {
  const { t } = useTranslation('user', { keyPrefix: 'edit' })
  const { t: tCommon } = useTranslation('common')

  const { data: operator } = ClientQueries.useGetSingleOperator(operatorId)

  if (!operator) {
    return null
  }

  return (
    <SectionContainer title={t('generalInformations')}>
      <Stack spacing={2}>
        <InformationContainer label={t('taxCodeField.label')} sx={{ mt: 0 }}>
          {operator.taxCode}
        </InformationContainer>

        <InformationContainer label={t('roleField.label')}>
          {tCommon(`userRole.${operator.role}`)}
        </InformationContainer>

        <InformationContainer label={t('productRoleField.label')}>
          {tCommon(`userProductRole.${operator.product.role}`)}
        </InformationContainer>

        <InformationContainer label={t('statusField.label')} sx={{ mb: 0 }}>
          <StatusChip for="user" state={operator.state} />
        </InformationContainer>
      </Stack>
    </SectionContainer>
  )
}

export const OperatorGeneralInfoSectionSkeleton: React.FC = () => {
  return <SectionContainerSkeleton height={235} />
}
