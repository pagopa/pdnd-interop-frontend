import React, { useContext } from 'react'
import { StyledIntro } from '../components/Shared/StyledIntro'
import { DialogContext } from '../lib/context'
import { StyledButton } from '../components/Shared/StyledButton'
import { Tab } from '@mui/material'
import { TabList, TabContext, TabPanel } from '@mui/lab'
import { Box } from '@mui/system'
import { useActiveTab } from '../hooks/useActiveTab'
import { EServiceContentInfo } from '../components/Shared/EServiceContentInfo'
import { ActionProps, DecoratedPurpose, EServiceReadType, Purpose } from '../../types'
import { TableWithLoader } from '../components/Shared/TableWithLoader'
import { formatThousands } from '../lib/number-utils'
import { StyledTableRow } from '../components/Shared/StyledTableRow'
import { decoratePurposeWithMostRecentVersion } from '../lib/purpose'
import { formatDateString } from '../lib/date-utils'
import { useFeedback } from '../hooks/useFeedback'
import { ActionMenu } from '../components/Shared/ActionMenu'
import { useLocation } from 'react-router-dom'
import {
  decorateEServiceWithActiveDescriptor,
  getEserviceAndDescriptorFromUrl,
} from '../lib/eservice-utils'
import { useAsyncFetch } from '../hooks/useAsyncFetch'
import { NotFound } from './NotFound'
import { StyledSkeleton } from '../components/Shared/StyledSkeleton'
import { useRoute } from '../hooks/useRoute'

export function EServiceManage() {
  const { routes } = useRoute()
  const { setDialog } = useContext(DialogContext)
  const { runFakeAction, runAction, forceRerenderCounter } = useFeedback()
  const { activeTab, updateActiveTab } = useActiveTab('details')

  const location = useLocation()
  const { eserviceId, descriptorId } = getEserviceAndDescriptorFromUrl(location)
  const { data: eserviceData, error } = useAsyncFetch<EServiceReadType>(
    {
      path: { endpoint: 'ESERVICE_GET_SINGLE', endpointParams: { eserviceId } },
    },
    {
      mapFn: decorateEServiceWithActiveDescriptor(descriptorId),
      loadingTextLabel: 'Stiamo caricando il tuo e-service',
      useEffectDeps: [forceRerenderCounter],
    }
  )

  const { data: purposeData /* , error */ } = useAsyncFetch<
    { purposes: Array<Purpose> },
    Array<DecoratedPurpose>
  >(
    {
      path: { endpoint: 'PURPOSE_GET_LIST' },
      config: { params: { states: 'WAITING_FOR_APPROVAL', eserviceId } },
    },
    {
      mapFn: (data) => data.purposes.map(decoratePurposeWithMostRecentVersion),
      loadingTextLabel: 'Stiamo caricando le finalità in attesa',
      useEffectDeps: [forceRerenderCounter],
    }
  )

  const wrapUpdatePurposeExpectedApprovalDate = (id: string, approvalDate?: string) => () => {
    setDialog({ type: 'setPurposeExpectedApprovalDate', id, approvalDate, runAction })
  }

  const wrapActivatePurpose = (id: string) => () => {
    runFakeAction(`Attivazione finalità ${id}`)
  }

  const getAvailableActions = (item: DecoratedPurpose): Array<ActionProps> => {
    const actions = [
      {
        onClick: wrapUpdatePurposeExpectedApprovalDate(
          item.id,
          item.currentVersion.expectedApprovalDate
        ),
        label: 'Aggiorna data di approvazione',
      },
      {
        onClick: wrapActivatePurpose(item.id),
        label: 'Attiva',
      },
    ]
    return actions
  }

  if (!eserviceData) {
    return <StyledSkeleton />
  }

  if (error) {
    return <NotFound errorType="server-error" />
  }

  const headData = ['Nome finalità', 'Stima di carico', 'Data di completamento']

  return (
    <React.Fragment>
      <StyledIntro sx={{ mb: 0 }}>
        {{ title: eserviceData.name, description: eserviceData.description }}
      </StyledIntro>

      <TabContext value={activeTab}>
        <TabList
          onChange={updateActiveTab}
          aria-label="Due tab diverse per i dettagli dell'e-service e le stime di carico indicate dai fruitori"
          sx={{ my: 6 }}
          variant="fullWidth"
        >
          <Tab label="Dettagli dell'e-service" value="details" />
          <Tab label="Finalità da evadere" value="purposeAwaitingApproval" />
        </TabList>

        <TabPanel value="details">
          <React.Fragment>
            <EServiceContentInfo data={eserviceData} />

            <Box sx={{ display: 'flex', mt: 4 }}>
              <StyledButton variant="outlined" to={routes.PROVIDE_ESERVICE_LIST.PATH}>
                Torna al catalogo
              </StyledButton>
            </Box>
          </React.Fragment>
        </TabPanel>
        <TabPanel value="purposeAwaitingApproval">
          <TableWithLoader
            loadingText={null}
            headData={headData}
            noDataLabel="Nessuna finalità da evadere"
          >
            {purposeData &&
              Boolean(purposeData.length > 0) &&
              purposeData.map((item, i) => {
                return (
                  <StyledTableRow
                    key={i}
                    cellData={[
                      { label: item.title },
                      { label: formatThousands(item.currentVersion.dailyCalls) },
                      {
                        label: item.currentVersion.expectedApprovalDate
                          ? formatDateString(item.currentVersion.expectedApprovalDate)
                          : 'In attesa di presa in carico',
                      },
                    ]}
                  >
                    <ActionMenu actions={getAvailableActions(item)} />
                  </StyledTableRow>
                )
              })}
          </TableWithLoader>
        </TabPanel>
      </TabContext>
    </React.Fragment>
  )
}
