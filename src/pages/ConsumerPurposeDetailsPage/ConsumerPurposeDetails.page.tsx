import { PurposeQueries } from '@/api/purpose'
import { PageContainer } from '@/components/layout/containers'
import { useActiveTab } from '@/hooks/useActiveTab'
import useGetConsumerPurposesActions from '@/hooks/useGetConsumerPurposesActions'
import { useParams } from '@/router'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import type { AlertProps } from '@mui/material'
import { Alert, Grid, Tab } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { PurposeClientsTab } from './components/PurposeClientsTab'
import { PurposeDetailTabSkeleton, PurposeDetailsTab } from './components/PurposeDetailsTab'

const ConsumerPurposeDetailsPage: React.FC = () => {
  const { purposeId } = useParams<'SUBSCRIBE_PURPOSE_DETAILS'>()
  const { t } = useTranslation('purpose')

  const { data: purpose, isLoading } = PurposeQueries.useGetSingle(purposeId, { suspense: false })
  const { activeTab, updateActiveTab } = useActiveTab('details')

  const { actions } = useGetConsumerPurposesActions(purpose)

  const isPurposeArchived = purpose?.currentVersion?.state === 'ARCHIVED'

  const isPurposeSuspended = purpose?.currentVersion?.state === 'SUSPENDED'
  const isPurposeWaintingForApproval = Boolean(purpose?.waitingForApprovalVersion)
  const isPurposeActive = purpose?.currentVersion?.state === 'ACTIVE'

  let alert: { severity: AlertProps['severity']; content: string } | undefined = undefined

  if (isPurposeSuspended) {
    alert = {
      severity: 'error',
      content: t('consumerView.suspendedAlert'),
    }
  }

  if (isPurposeWaintingForApproval && !isPurposeSuspended) {
    alert = {
      severity: 'warning',
      content: t('consumerView.waitingForApprovalAlert'),
    }
  }

  if (isPurposeActive && purpose.clients.length === 0) {
    alert = {
      severity: 'info',
      content: t('consumerView.noClientsAlert'),
    }
  }

  return (
    <PageContainer
      title={purpose?.title}
      description={purpose?.description}
      isLoading={isLoading}
      newTopSideActions={actions}
      statusChip={purpose ? { for: 'purpose', purpose: purpose } : undefined}
      backToAction={{
        label: t('backToPurposeListBtn'),
        to: 'SUBSCRIBE_PURPOSE_LIST',
      }}
    >
      {alert && (
        <Alert severity={alert.severity} sx={{ mb: 3 }}>
          {alert.content}
        </Alert>
      )}
      <TabContext value={activeTab}>
        <TabList
          onChange={updateActiveTab}
          aria-label={t('consumerView.tabs.ariaLabel')}
          variant="fullWidth"
        >
          <Tab label={t('consumerView.tabs.details')} value="details" />
          <Tab label={t('consumerView.tabs.clients')} value="clients" />
        </TabList>

        <Grid container>
          <Grid item xs={8}>
            <TabPanel value="details">
              {purpose && !isLoading ? (
                <PurposeDetailsTab purpose={purpose} />
              ) : (
                <PurposeDetailTabSkeleton />
              )}
            </TabPanel>
          </Grid>

          <Grid item xs={12}>
            <TabPanel value="clients">
              <PurposeClientsTab purposeId={purposeId} isPurposeArchived={isPurposeArchived} />
            </TabPanel>
          </Grid>
        </Grid>
      </TabContext>
    </PageContainer>
  )
}

export default ConsumerPurposeDetailsPage
