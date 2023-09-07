import { PurposeQueries } from '@/api/purpose'
import { PageContainer } from '@/components/layout/containers'
import useGetProviderPurposesActions from '@/hooks/useGetProviderPurposesActions'
import { useParams } from '@/router'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { ProviderPurposeDetailsGeneralInfoSection } from './components/ProviderPurposeDetailsGeneralInfoSection'
import type { AlertProps } from '@mui/material'
import { Alert, Grid } from '@mui/material'
import { ProviderPurposeDetailsLoadEstimateSection } from './components/ProviderPurposeDetailsLoadEstimateSection'

const ProviderPurposeDetailsPage: React.FC = () => {
  const { t } = useTranslation('purpose')
  const { purposeId } = useParams<'PROVIDE_PURPOSE_DETAILS'>()

  const { data: purpose, isLoading } = PurposeQueries.useGetSingle(purposeId, { suspense: false })

  const { actions } = useGetProviderPurposesActions(purpose)

  const isSuspended = purpose?.currentVersion?.state === 'SUSPENDED'
  const isWaintingForApproval = Boolean(purpose?.waitingForApprovalVersion)

  let alert: { severity: AlertProps['severity']; content: string } | undefined = undefined

  if (isSuspended) {
    alert = {
      severity: 'error',
      content: t('providerView.suspendedAlert'),
    }
  }

  if (isWaintingForApproval && !isSuspended) {
    alert = {
      severity: 'warning',
      content: t('providerView.waitingForApprovalAlert'),
    }
  }

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
      <Grid container spacing={3}>
        {alert && (
          <Grid item xs={8}>
            <Alert severity={alert.severity}>{alert.content}</Alert>
          </Grid>
        )}
        <Grid item xs={8}>
          {purpose && <ProviderPurposeDetailsGeneralInfoSection purpose={purpose} />}
        </Grid>
        <Grid item xs={8}>
          {purpose && <ProviderPurposeDetailsLoadEstimateSection purpose={purpose} />}
        </Grid>
      </Grid>
    </PageContainer>
  )
}

export default ProviderPurposeDetailsPage
