import React from 'react'
import { EServiceQueries } from '@/api/eservice'
import { PageContainer } from '@/components/layout/containers'
import { useParams } from '@/router'
import { useMarkNotificationsAsRead } from '@/hooks/useMarkNotificationsAsRead'
import { Tab } from '@mui/material'
import { useGetProviderEServiceActions } from '@/hooks/useGetProviderEServiceActions'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import { useActiveTab } from '@/hooks/useActiveTab'
import { ProviderEserviceDetailsTab } from './components/ProviderEServiceDetailsTab/ProviderEServiceDetailsTab'
import { ProviderEserviceKeychainsTab } from './components/ProviderEServiceKeychainsTab/ProviderEServiceKeychainsTab'
import type { StatusChip } from '@/components/shared/StatusChip'
import type { CompactDescriptor } from '@/api/api.generatedTypes'

const ProviderEServiceDetailsPage: React.FC = () => {
  const { t } = useTranslation('eservice', { keyPrefix: 'read' })
  const { eserviceId, descriptorId } = useParams<'PROVIDE_ESERVICE_MANAGE'>()

  const { activeTab, updateActiveTab } = useActiveTab('eserviceDetails')

  const { data: descriptor } = useQuery(
    EServiceQueries.getDescriptorProvider(eserviceId, descriptorId)
  )

  useMarkNotificationsAsRead(`${eserviceId}/${descriptorId}`)

  const isEserviceFromTemplate = Boolean(descriptor?.templateRef)

  descriptor?.delegation
  const { actions } = useGetProviderEServiceActions(
    eserviceId,
    descriptor?.state,
    descriptor?.eservice.draftDescriptor?.state,
    descriptorId,
    descriptor?.eservice.draftDescriptor?.id,
    descriptor?.eservice.mode,
    descriptor?.eservice.name,
    descriptor?.templateRef?.isNewTemplateVersionAvailable ?? false,
    isEserviceFromTemplate,
    descriptor?.delegation
  )

  const getStatusChips = () => {
    let eserviceChip: React.ComponentProps<typeof StatusChip> | undefined
    let versionChip: React.ComponentProps<typeof StatusChip> | undefined

    if (descriptor) {
      const lastActiveDescriptor = descriptor.eservice.descriptors.reduce<
        CompactDescriptor | undefined
      >((acc, curr) => {
        if (curr.state !== 'DRAFT') {
          if (!acc || curr.version > acc.version) {
            return curr
          }
        }
        return acc
      }, undefined)

      eserviceChip = lastActiveDescriptor
        ? {
            for: 'eservice',
            state: lastActiveDescriptor?.state,
          }
        : undefined

      if (
        descriptor.id !== lastActiveDescriptor?.id &&
        descriptor.state !== lastActiveDescriptor?.state
      ) {
        versionChip = { for: 'eservice', state: descriptor.state }
      }
    }

    return {
      eserviceChip,
      versionChip,
    }
  }

  const statusChips = getStatusChips()

  return (
    <PageContainer
      title={descriptor?.eservice.name || ''}
      topSideActions={actions}
      isLoading={!descriptor}
      statusChip={statusChips.eserviceChip}
      backToAction={{
        label: t('actions.backToListLabel'),
        to: 'PROVIDE_ESERVICE_LIST',
      }}
      secondaryIntro={
        descriptor
          ? {
              label: t('versionHeaderLabel'),
              link: { label: descriptor.version, onClink: () => {} }, // TODO navigation function
              actions: [], // TODO actions for secondHeader
              statusChip: statusChips.versionChip,
            }
          : undefined
      }
    >
      <TabContext value={activeTab}>
        <TabList onChange={updateActiveTab} aria-label={t('tabs.ariaLabel')} variant="fullWidth">
          <Tab label={t('tabs.eserviceDetails')} value="eserviceDetails" />
          <Tab label={t('tabs.keychain')} value="keychains" />
        </TabList>

        <TabPanel value="eserviceDetails">
          <ProviderEserviceDetailsTab />
        </TabPanel>

        <TabPanel value="keychains">
          <ProviderEserviceKeychainsTab />
        </TabPanel>
      </TabContext>
    </PageContainer>
  )
}

export default ProviderEServiceDetailsPage
