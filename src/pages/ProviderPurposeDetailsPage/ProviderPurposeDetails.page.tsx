import { PurposeQueries } from '@/api/purpose'
import { PageContainer } from '@/components/layout/containers'
import useGetProviderPurposesActions from '@/hooks/useGetProviderPurposesActions'
import { useParams } from '@/router'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { ProviderPurposeDetailsGeneralInfoSection } from './components/ProviderPurposeDetailsGeneralInfoSection'
import { Alert, Grid, Stack } from '@mui/material'
import { ProviderPurposeDetailsLoadEstimateSection } from './components/ProviderPurposeDetailsLoadEstimateSection'
import useGetPurposeStateAlertProps from './hooks/useGetPurposeStateAlertProps'

const ProviderPurposeDetailsPage: React.FC = () => {
  const { t } = useTranslation('purpose')
  const { purposeId } = useParams<'PROVIDE_PURPOSE_DETAILS'>()

  const { data: purpose, isLoading } = PurposeQueries.useGetSingle(purposeId, { suspense: false })

  const { actions } = useGetProviderPurposesActions(purpose)

  const alertProps = useGetPurposeStateAlertProps(purpose)

  return (
    <PageContainer
      title={purpose?.title}
      isLoading={isLoading}
      newTopSideActions={actions}
      statusChip={purpose ? { for: 'purpose', purpose: purpose } : undefined}
      backToAction={{
        label: t('backToPurposeListBtn'),
        to: 'PROVIDE_PURPOSE_LIST',
      }}
    >
      <Grid container>
        <Grid item xs={8}>
          <Stack spacing={3}>
            {alertProps && <Alert severity={alertProps.severity}>{alertProps.content}</Alert>}
            {purpose && <ProviderPurposeDetailsGeneralInfoSection purpose={purpose} />}
            {purpose && <ProviderPurposeDetailsLoadEstimateSection purpose={purpose} />}
          </Stack>
        </Grid>
      </Grid>
    </PageContainer>
  )
}

export default ProviderPurposeDetailsPage
