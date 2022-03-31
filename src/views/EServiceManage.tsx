import React, { useContext } from 'react'
import { StyledIntro } from '../components/Shared/StyledIntro'
import { DialogContext } from '../lib/context'
import { StyledButton } from '../components/Shared/StyledButton'
import { Tab } from '@mui/material'
import { TabList, TabContext, TabPanel } from '@mui/lab'
import { useActiveTab } from '../hooks/useActiveTab'
import { EServiceContentInfo } from '../components/Shared/EServiceContentInfo'
import { ActionProps, DecoratedPurpose, EServiceReadType, Purpose } from '../../types'
import { TableWithLoader } from '../components/Shared/TableWithLoader'
import { formatThousands } from '../lib/format-utils'
import { StyledTableRow } from '../components/Shared/StyledTableRow'
import { decoratePurposeWithMostRecentVersion } from '../lib/purpose'
import { formatDateString } from '../lib/format-utils'
import { RunAction, useFeedback } from '../hooks/useFeedback'
import { ActionMenu } from '../components/Shared/ActionMenu'
import { useLocation } from 'react-router-dom'
import {
  decorateEServiceWithActiveDescriptor,
  getEserviceAndDescriptorFromUrl,
} from '../lib/eservice-utils'
import { useAsyncFetch } from '../hooks/useAsyncFetch'
import { NotFound } from './NotFound'
import { useRoute } from '../hooks/useRoute'
import { PageBottomActions } from '../components/Shared/PageBottomActions'

type AsyncTableProps = {
  forceRerenderCounter: number
  runAction: RunAction
  eserviceId?: string
}

const AsyncTable = ({ forceRerenderCounter, runAction, eserviceId }: AsyncTableProps) => {
  const { setDialog } = useContext(DialogContext)

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

  /*
   * List of possible actions for the user to perform
   */
  const wrapUpdatePurposeExpectedApprovalDate =
    (purposeId: string, versionId: string, approvalDate?: string) => () => {
      setDialog({
        type: 'setPurposeExpectedApprovalDate',
        purposeId,
        versionId,
        approvalDate,
        runAction,
      })
    }

  const wrapActivatePurpose = (purposeId: string, versionId: string) => async () => {
    await runAction(
      {
        path: {
          endpoint: 'PURPOSE_VERSION_ACTIVATE',
          endpointParams: { purposeId, versionId },
        },
      },
      { showConfirmDialog: true }
    )
  }
  /*
   * End list of actions
   */

  const getAvailableActions = (item: DecoratedPurpose): Array<ActionProps> => {
    const actions = [
      {
        onClick: wrapUpdatePurposeExpectedApprovalDate(
          item.id,
          item.mostRecentVersion.id,
          item.mostRecentVersion.expectedApprovalDate
        ),
        label: 'Aggiorna data di completamento',
      },
      {
        onClick: wrapActivatePurpose(item.id, item.mostRecentVersion.id),
        label: 'Attiva',
      },
    ]
    return actions
  }

  const headData = ['Nome finalità', 'Stima di carico', 'Data di completamento', '']

  return (
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
                { label: formatThousands(item.mostRecentVersion.dailyCalls) },
                {
                  label: item.mostRecentVersion.expectedApprovalDate
                    ? formatDateString(item.mostRecentVersion.expectedApprovalDate)
                    : 'In attesa di presa in carico',
                },
              ]}
            >
              <ActionMenu actions={getAvailableActions(item)} />
            </StyledTableRow>
          )
        })}
    </TableWithLoader>
  )
}

export function EServiceManage() {
  const { routes } = useRoute()
  const { runAction, forceRerenderCounter } = useFeedback()
  const { activeTab, updateActiveTab } = useActiveTab('details')

  const location = useLocation()
  const { eserviceId, descriptorId } = getEserviceAndDescriptorFromUrl(location)
  const { data: eserviceData, error } = useAsyncFetch<EServiceReadType>(
    {
      path: { endpoint: 'ESERVICE_GET_SINGLE', endpointParams: { eserviceId } },
    },
    {
      mapFn: decorateEServiceWithActiveDescriptor(descriptorId),
      loadingTextLabel: 'Stiamo caricando il tuo E-Service',
      useEffectDeps: [forceRerenderCounter],
    }
  )

  if (error) {
    return <NotFound errorType="server-error" />
  }

  return (
    <React.Fragment>
      <StyledIntro>
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
            {eserviceData && <EServiceContentInfo data={eserviceData} />}

            <PageBottomActions>
              <StyledButton variant="outlined" to={routes.PROVIDE_ESERVICE_LIST.PATH}>
                Torna al catalogo
              </StyledButton>
            </PageBottomActions>
          </React.Fragment>
        </TabPanel>
        <TabPanel value="purposeAwaitingApproval">
          <AsyncTable
            forceRerenderCounter={forceRerenderCounter}
            runAction={runAction}
            eserviceId={eserviceId}
          />
        </TabPanel>
      </TabContext>
    </React.Fragment>
  )
}
