import React from 'react'
import { ClientQueries } from '@/api/client'
import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { StatusChip } from '@/components/shared/StatusChip'
import { Stack } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { InformationContainer } from '@pagopa/interop-fe-commons'

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
        <InformationContainer
          label={t('taxCodeField.label')}
          sx={{ mt: 0 }}
          content={operator.taxCode}
        />
        <InformationContainer
          label={t('roleField.label')}
          content={tCommon(`userRole.${operator.role}`)}
        />
        <InformationContainer
          label={t('productRoleField.label')}
          content={tCommon(`userProductRole.${operator.product.role}`)}
        />
        <InformationContainer
          label={t('statusField.label')}
          sx={{ mb: 0 }}
          content={<StatusChip for="user" state={operator.state} />}
        />
      </Stack>
    </SectionContainer>
  )
}

export const OperatorGeneralInfoSectionSkeleton: React.FC = () => {
  return <SectionContainerSkeleton height={235} />
}
