import { PurposeQueries } from '@/api/purpose'
import { PageContainer } from '@/components/layout/containers'
import { useActiveTab } from '@/hooks/useActiveTab'
import useGetConsumerPurposesActions from '@/hooks/useGetConsumerPurposesActions'
import { Link, useParams } from '@/router'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import { Alert, Grid, Tab } from '@mui/material'
import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { PurposeClientsTab } from './components/PurposeClientsTab'
import { PurposeDetailTabSkeleton, PurposeDetailsTab } from './components/PurposeDetailsTab'
import useGetPurposeStateAlertProps from './hooks/useGetPurposeStateAlertProps'

const ConsumerPurposeDetailsPage: React.FC = () => {
  const { purposeId } = useParams<'SUBSCRIBE_PURPOSE_DETAILS'>()
  const { t } = useTranslation('purpose')

  const { data: purpose, isLoading } = PurposeQueries.useGetSingle(purposeId, { suspense: false })
  const { activeTab, updateActiveTab } = useActiveTab('details')

  const { actions } = useGetConsumerPurposesActions(purpose)

  const isPurposeArchived = purpose?.currentVersion?.state === 'ARCHIVED'

  const alertProps = useGetPurposeStateAlertProps(purpose)

  return (
    <PageContainer
      title={purpose?.title}
      description={purpose?.description}
      isLoading={isLoading}
      newTopSideActions={actions}
      statusChip={purpose ? { for: 'purpose', purpose: purpose } : undefined}
      backToAction={{
        label: t('backToListBtn'),
        to: 'SUBSCRIBE_PURPOSE_LIST',
      }}
    >
      {alertProps && (
        <Alert severity={alertProps.severity} sx={{ mb: 3 }}>
          {alertProps.link ? (
            <Trans
              components={{
                1: (
                  <Link
                    to={alertProps.link.to}
                    params={alertProps.link.params}
                    options={alertProps.link.options}
                  />
                ),
              }}
            >
              {t('consumerView.noClientsAlert')}
            </Trans>
          ) : (
            alertProps.content
          )}
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

        <TabPanel value="details">
          <Grid container>
            <Grid item xs={8}>
              {purpose && !isLoading ? (
                <PurposeDetailsTab purpose={purpose} />
              ) : (
                <PurposeDetailTabSkeleton />
              )}
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value="clients">
          <PurposeClientsTab purposeId={purposeId} isPurposeArchived={isPurposeArchived} />
        </TabPanel>
      </TabContext>
    </PageContainer>
  )
}

export default ConsumerPurposeDetailsPage
