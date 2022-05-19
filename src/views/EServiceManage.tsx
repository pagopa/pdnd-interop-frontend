import React from 'react'
import { StyledIntro } from '../components/Shared/StyledIntro'
import { StyledButton } from '../components/Shared/StyledButton'
import { Tab } from '@mui/material'
import { TabList, TabContext, TabPanel } from '@mui/lab'
import { useActiveTab } from '../hooks/useActiveTab'
import { EServiceContentInfo } from '../components/Shared/EServiceContentInfo'
import { EServiceReadType } from '../../types'
import { useFeedback } from '../hooks/useFeedback'
import { useLocation } from 'react-router-dom'
import {
  decorateEServiceWithActiveDescriptor,
  getEserviceAndDescriptorFromUrl,
} from '../lib/eservice-utils'
import { useAsyncFetch } from '../hooks/useAsyncFetch'
import { NotFound } from './NotFound'
import { useRoute } from '../hooks/useRoute'
import { PageBottomActions } from '../components/Shared/PageBottomActions'
import { AsyncTablePurposeInEService } from '../components/Shared/AsyncTablePurpose'
import { LoadingWithMessage } from '../components/Shared/LoadingWithMessage'
import { useTranslation } from 'react-i18next'

export function EServiceManage() {
  const { t } = useTranslation('eservice')
  const { routes } = useRoute()
  const { runAction, forceRerenderCounter } = useFeedback()
  const { activeTab, updateActiveTab } = useActiveTab('details')

  const location = useLocation()
  const { eserviceId, descriptorId } = getEserviceAndDescriptorFromUrl(location)
  const {
    data: eserviceData,
    isLoading,
    error,
  } = useAsyncFetch<EServiceReadType>(
    { path: { endpoint: 'ESERVICE_GET_SINGLE', endpointParams: { eserviceId } } },
    {
      mapFn: decorateEServiceWithActiveDescriptor(descriptorId),
      useEffectDeps: [forceRerenderCounter],
    }
  )

  if (error) {
    return <NotFound errorType="serverError" />
  }

  return (
    <React.Fragment>
      <StyledIntro isLoading={isLoading}>
        {{ title: eserviceData?.name, description: eserviceData?.description }}
      </StyledIntro>

      <TabContext value={activeTab}>
        <TabList
          onChange={updateActiveTab}
          aria-label={t('manage.tabs.ariaLabel')}
          variant="fullWidth"
        >
          <Tab label={t('manage.tabs.details')} value="details" />
          <Tab label={t('manage.tabs.purposeAwaitingApproval')} value="purposeAwaitingApproval" />
        </TabList>

        <TabPanel value="details">
          {eserviceData ? (
            <React.Fragment>
              <EServiceContentInfo data={eserviceData} />
              <PageBottomActions>
                <StyledButton variant="outlined" to={routes.PROVIDE_ESERVICE_LIST.PATH}>
                  Torna al catalogo
                </StyledButton>
              </PageBottomActions>
            </React.Fragment>
          ) : (
            <LoadingWithMessage label={t('loadingSingleLabel')} transparentBackground />
          )}
        </TabPanel>
        <TabPanel value="purposeAwaitingApproval">
          <AsyncTablePurposeInEService
            forceRerenderCounter={forceRerenderCounter}
            runAction={runAction}
            eserviceId={eserviceId}
          />
        </TabPanel>
      </TabContext>
    </React.Fragment>
  )
}
