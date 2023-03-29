import React from 'react'
import { ClientQueries } from '@/api/client'
import { Stack } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import type { UserProductRole } from '@/types/party.types'

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
          label={t('productRoleField.label')}
          content={tCommon(`userProductRole.${operator.product.role as UserProductRole}`)}
        />
      </Stack>
    </SectionContainer>
  )
}

export const OperatorGeneralInfoSectionSkeleton: React.FC = () => {
  return <SectionContainerSkeleton height={235} />
}
