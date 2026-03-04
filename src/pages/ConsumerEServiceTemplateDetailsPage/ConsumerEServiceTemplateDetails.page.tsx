import React from 'react'
import { PageContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { useParams } from '@/router'
import { Grid, Tab } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import { useActiveTab } from '@/hooks/useActiveTab'
import { EServiceTemplateQueries } from '@/api/eserviceTemplate'
import { ConsumerEServiceTemplateDetails, ConsumerEServiceTemplateInstancesTab } from './components'
import { useGetConsumerEServiceTemplateActions } from './hooks/useGetConsumerEServiceTemplateActions'
import { ConsumerEServiceGeneralInfoSectionSkeleton } from '../ConsumerEServiceDetailsPage/components/ConsumerEServiceDetailsTab/ConsumerEServiceGeneralInfoSection'

const ConsumerEServiceTemplateDetailsPage: React.FC = () => {
  const { t } = useTranslation('eserviceTemplate', { keyPrefix: 'read' })
  const { eServiceTemplateId, eServiceTemplateVersionId } =
    useParams<'SUBSCRIBE_ESERVICE_TEMPLATE_DETAILS'>()

  const { activeTab, updateActiveTab } = useActiveTab('eserviceTemplateDetails')

  const { data: eserviceTemplate } = useQuery(
    EServiceTemplateQueries.getSingle(eServiceTemplateId, eServiceTemplateVersionId)
  )

  const { data: templateInstancesCount, isLoading: isLoadingTemplateInstancesCount } = useQuery({
    ...EServiceTemplateQueries.getMyEServiceTemplateInstancesList({
      limit: 1,
      offset: 0,
      eserviceTemplateId: eServiceTemplateId,
    }),
  })

  const hasRequesterRiskAnalysis = eserviceTemplate?.hasRequesterRiskAnalysis ?? true
  const hasPersonalDataValue = eserviceTemplate?.eserviceTemplate.personalData !== undefined
  const isAvailableAtLeastOneInstance =
    templateInstancesCount && templateInstancesCount?.results?.length > 0

  const { actions } = useGetConsumerEServiceTemplateActions(
    eServiceTemplateId,
    hasRequesterRiskAnalysis,
    eserviceTemplate?.state,
    hasPersonalDataValue
  )
  return (
    <PageContainer
      title={eserviceTemplate?.eserviceTemplate.name || ''}
      isLoading={!eserviceTemplate}
      topSideActions={actions}
      statusChip={
        eserviceTemplate
          ? {
              for: 'eserviceTemplate',
              state: eserviceTemplate?.state,
            }
          : undefined
      }
      backToAction={{
        label: t('actions.backToEserviceTemplateCatalog'),
        to: 'PROVIDE_ESERVICE_TEMPLATE_CATALOG',
      }}
    >
      <React.Suspense fallback={<ConsumerEServiceTemplateDetailsSkeleton />}>
        <TabContext value={activeTab}>
          {isAvailableAtLeastOneInstance && (
            <TabList
              onChange={updateActiveTab}
              aria-label={t('tabs.ariaLabel')}
              variant="fullWidth"
            >
              <Tab label={t('tabs.eserviceTemplateDetails')} value="eserviceTemplateDetails" />

              <Tab label={t('tabs.eserviceTemplateInstances')} value="eserviceTemplateInstances" />
            </TabList>
          )}
          <TabPanel value="eserviceTemplateDetails">
            <ConsumerEServiceTemplateDetails />
          </TabPanel>

          {isAvailableAtLeastOneInstance && (
            <TabPanel value="eserviceTemplateInstances">
              <ConsumerEServiceTemplateInstancesTab
                eserviceTemplateVersions={eserviceTemplate?.eserviceTemplate.versions ?? []}
              />
            </TabPanel>
          )}
        </TabContext>
      </React.Suspense>
    </PageContainer>
  )
}

export const ConsumerEServiceTemplateDetailsSkeleton = () => {
  return (
    <>
      <Grid container sx={{ mt: 10 }}>
        <Grid xs={12} sm={6}>
          <SectionContainerSkeleton sx={{ mt: 4, mr: 2 }} height={25} />
        </Grid>
        <Grid xs={12} sm={6}>
          <SectionContainerSkeleton sx={{ mt: 4 }} height={25} />
        </Grid>
      </Grid>
      <SectionContainerSkeleton sx={{ mt: 4 }} height={500} />
    </>
  )
}

export default ConsumerEServiceTemplateDetailsPage
