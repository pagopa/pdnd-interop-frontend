import { EServiceQueries } from '@/api/eservice'
import { PageBottomActionsContainer, PageContainer } from '@/components/layout/containers'
import { EServiceDetails, EServiceDetailsSkeleton } from '@/components/shared/EServiceDetails'
import { RouterLink, useRouteParams } from '@/router'
import { useActiveTab } from '@/hooks/useActiveTab'
import { formatTopSideActions } from '@/utils/common.utils'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import { Alert, Tab } from '@mui/material'
import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { EServicePurposesTable, EServicePurposesTableSkeleton } from './components'
import { useGetProviderEServiceActions } from '@/hooks/useGetProviderEServiceActions'
import { EServiceDescriptorProvider } from '@/types/eservice.types'

const ProviderEServiceDetailsPage: React.FC = () => {
  const { t } = useTranslation('eservice')
  const { eserviceId, descriptorId } = useRouteParams<'PROVIDE_ESERVICE_MANAGE'>()
  const { activeTab, updateActiveTab } = useActiveTab('details')

  const { data: descriptor, isLoading: isLoadingDescriptor } =
    EServiceQueries.useGetDescriptorProvider(eserviceId, descriptorId, { suspense: false })

  const { actions } = useGetProviderEServiceActions(
    descriptor?.eservice.id,
    descriptor?.state,
    descriptor?.id,
    descriptor?.eservice.draftDescriptor?.id
  )

  const topSideActions = formatTopSideActions(actions)

  return (
    <PageContainer
      title={descriptor?.eservice.name || ''}
      description={descriptor?.eservice?.description}
      topSideActions={topSideActions}
      isLoading={isLoadingDescriptor}
    >
      <TabContext value={activeTab}>
        <TabList
          onChange={updateActiveTab}
          aria-label={t('manage.tabs.ariaLabel')}
          variant="fullWidth"
        >
          <Tab label={t('manage.tabs.details')} value="details" />
          <Tab label={t('manage.tabs.purposeAwaitingApproval')} value="purposeAwaitingApproval" />
        </TabList>

        <TabPanel value="details" sx={{ p: 0 }}>
          {descriptor && (
            <>
              <HasDraftDescriptorAlert descriptor={descriptor} />
              <EServiceDetails descriptor={descriptor} />
            </>
          )}
          {(!descriptor || isLoadingDescriptor) && <EServiceDetailsSkeleton />}
        </TabPanel>
        <TabPanel value="purposeAwaitingApproval" sx={{ px: 0 }}>
          <React.Suspense fallback={<EServicePurposesTableSkeleton />}>
            <EServicePurposesTable eserviceId={eserviceId} />
          </React.Suspense>
        </TabPanel>
      </TabContext>

      <PageBottomActionsContainer>
        <RouterLink as="button" to="PROVIDE_ESERVICE_LIST" variant="outlined">
          {t('read.actions.backToListLabel')}
        </RouterLink>
      </PageBottomActionsContainer>
    </PageContainer>
  )
}

const HasDraftDescriptorAlert: React.FC<{ descriptor: EServiceDescriptorProvider }> = ({
  descriptor,
}) => {
  const { t } = useTranslation('eservice')

  if (!descriptor.eservice.draftDescriptor) return null

  return (
    <Alert sx={{ mt: 2 }} severity="info">
      <Trans
        components={{
          1: (
            <RouterLink
              to="PROVIDE_ESERVICE_EDIT"
              params={{
                eserviceId: descriptor.eservice.id,
                descriptorId: descriptor.eservice.draftDescriptor.id,
              }}
              state={{ stepIndexDestination: 1 }}
            />
          ),
        }}
      >
        {t('read.alert.hasNewVersionDraft')}
      </Trans>
    </Alert>
  )
}

export default ProviderEServiceDetailsPage
