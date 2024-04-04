import { PurposeQueries } from '@/api/purpose'
import { PageContainer } from '@/components/layout/containers'
import useGetProviderPurposesActions from '@/hooks/useGetProviderPurposesActions'
import { useParams } from '@/router'
import React from 'react'
import { useTranslation } from 'react-i18next'
import {
  ProviderPurposeDetailsGeneralInfoSection,
  ProviderPurposeDetailsGeneralInfoSectionSkeleton,
} from './components/ProviderPurposeDetailsGeneralInfoSection'
import { Alert, Grid, Stack } from '@mui/material'
import {
  ProviderPurposeDetailsLoadEstimateSection,
  ProviderPurposeDetailsLoadEstimateSectionSkeleton,
} from './components/ProviderPurposeDetailsLoadEstimateSection'
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
      topSideActions={actions}
      statusChip={purpose ? { for: 'purpose', purpose: purpose } : undefined}
      backToAction={{
        label: t('backToListBtn'),
        to: 'PROVIDE_PURPOSE_LIST',
      }}
    >
      {alertProps && (
        <Alert severity={alertProps.severity} sx={{ mb: 3 }}>
          {alertProps.content}
        </Alert>
      )}
      <Grid container>
        <Grid item xs={8}>
          {!purpose ? (
            <ProviderPurposeDetailsPageSkeleton />
          ) : (
            <Stack spacing={3}>
              <ProviderPurposeDetailsGeneralInfoSection purpose={purpose} />
              <ProviderPurposeDetailsLoadEstimateSection purpose={purpose} />
            </Stack>
          )}
        </Grid>
      </Grid>
    </PageContainer>
  )
}

const ProviderPurposeDetailsPageSkeleton: React.FC = () => {
  return (
    <Stack spacing={3}>
      <ProviderPurposeDetailsGeneralInfoSectionSkeleton />
      <ProviderPurposeDetailsLoadEstimateSectionSkeleton />
    </Stack>
  )
}

export default ProviderPurposeDetailsPage
