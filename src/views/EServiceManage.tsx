import React from 'react'
import { StyledIntro } from '../components/Shared/StyledIntro'
import { StyledButton } from '../components/Shared/StyledButton'
import { Skeleton, Tab } from '@mui/material'
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

export function EServiceManage() {
  const { routes } = useRoute()
  const { runAction, forceRerenderCounter } = useFeedback()
  const { activeTab, updateActiveTab } = useActiveTab('details')

  const location = useLocation()
  const { eserviceId, descriptorId } = getEserviceAndDescriptorFromUrl(location)
  const {
    data: eserviceData,
    isItReallyLoading,
    loadingText,
    error,
  } = useAsyncFetch<EServiceReadType>(
    {
      path: { endpoint: 'ESERVICE_GET_SINGLE', endpointParams: { eserviceId } },
    },
    {
      mapFn: decorateEServiceWithActiveDescriptor(descriptorId),
      loadingTextLabel: 'Stiamo caricando il tuo E-Service',
      loaderType: 'contextual',
      useEffectDeps: [forceRerenderCounter],
    }
  )

  if (error) {
    return <NotFound errorType="server-error" />
  }

  return (
    <React.Fragment>
      <StyledIntro loading={isItReallyLoading}>
        {{ title: eserviceData?.name, description: eserviceData?.description }}
      </StyledIntro>

      <TabContext value={activeTab}>
        <TabList
          onChange={updateActiveTab}
          aria-label="Due tab diverse per i dettagli dell'E-Service e le stime di carico indicate dai fruitori"
          variant="fullWidth"
        >
          <Tab label="Dettagli dell'E-Service" value="details" />
          <Tab label="Finalità da evadere" value="purposeAwaitingApproval" />
        </TabList>

        <TabPanel value="details">
          <React.Fragment>
            {isItReallyLoading ? (
              <LoadingWithMessage label={loadingText} transparentBackground={true} />
            ) : (
              <EServiceContentInfo data={eserviceData as EServiceReadType} />
            )}

            <PageBottomActions>
              <StyledButton variant="outlined" to={routes.PROVIDE_ESERVICE_LIST.PATH}>
                Torna al catalogo
              </StyledButton>
            </PageBottomActions>
          </React.Fragment>
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
