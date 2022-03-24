import React, { FunctionComponent, useContext } from 'react'
import { Paper } from '@mui/material'
import { Box } from '@mui/system'
import { useHistory } from 'react-router-dom'
import { ActiveStepProps } from '../hooks/useActiveStep'
import { useFeedback } from '../hooks/useFeedback'
import { StepActions } from './Shared/StepActions'
import { StyledButton } from './Shared/StyledButton'
import { StyledIntro } from './Shared/StyledIntro'
import { TableWithLoader } from './Shared/TableWithLoader'
import { DeleteOutline as DeleteOutlineIcon } from '@mui/icons-material'
import { StyledTableRow } from './Shared/StyledTableRow'
import { Client, DecoratedPurpose, Purpose } from '../../types'
import { DialogContext, PartyContext } from '../lib/context'
import { useAsyncFetch } from '../hooks/useAsyncFetch'
import { useRoute } from '../hooks/useRoute'
import { decoratePurposeWithMostRecentVersion, getPurposeFromUrl } from '../lib/purpose'
import { TOAST_CONTENTS } from '../config/toast'
import { ButtonNaked } from '@pagopa/mui-italia'

export const PurposeCreateStep3Clients: FunctionComponent<ActiveStepProps> = ({ back }) => {
  const history = useHistory()
  const purposeId = getPurposeFromUrl(history.location)
  const { setDialog } = useContext(DialogContext)
  const { routes } = useRoute()
  const { party } = useContext(PartyContext)

  const { wrapActionInDialog, runActionWithDestination, runAction, forceRerenderCounter } =
    useFeedback()

  const { data: clientsData = [] } = useAsyncFetch<{ clients: Array<Client> }, Array<Client>>(
    {
      path: { endpoint: 'CLIENT_GET_LIST' },
      config: { params: { consumerId: party?.id, purposeId } },
    },
    {
      loadingTextLabel: 'Stiamo caricando le informazioni dei client associati alle finalità',
      mapFn: (data) => data.clients,
      useEffectDeps: [forceRerenderCounter],
    }
  )

  const { data: purposeFetchedData } = useAsyncFetch<Purpose, DecoratedPurpose>(
    { path: { endpoint: 'PURPOSE_GET_SINGLE', endpointParams: { purposeId } } },
    {
      loadingTextLabel: 'Stiamo caricando le informazioni della finalità',
      mapFn: decoratePurposeWithMostRecentVersion,
    }
  )

  const goToList = () => {
    history.push(routes.SUBSCRIBE_PURPOSE_LIST.PATH, {
      toast: { outcome: 'success', ...TOAST_CONTENTS.PURPOSE_DRAFT_UPDATE.success },
    })
  }

  const addClients = async (data: Array<Client>) => {
    const alreadyPostedClients = (clientsData || []).map((c) => c.id)
    const newClients = data.filter((c) => !alreadyPostedClients.includes(c.id))

    if (newClients.length === 0) {
      goToList()
    }

    // TEMP REFACTOR: improve this with error messages, failure handling, etc
    await Promise.all(
      newClients.map(async ({ id: clientId }) => {
        return await runAction(
          {
            path: { endpoint: 'CLIENT_JOIN_WITH_PURPOSE', endpointParams: { clientId } },
            config: { data: { purposeId } },
          },
          { suppressToast: true }
        )
      })
    )
  }

  const publishVersion = async () => {
    await runActionWithDestination(
      {
        path: {
          endpoint: 'PURPOSE_VERSION_ACTIVATE',
          endpointParams: { purposeId, versionId: purposeFetchedData?.currentVersion.id },
        },
      },
      { destination: routes.SUBSCRIBE_PURPOSE_LIST, suppressToast: false }
    )
  }

  const deleteVersion = async () => {
    await runActionWithDestination(
      {
        path: { endpoint: 'PURPOSE_DRAFT_DELETE', endpointParams: { purposeId } },
      },
      { destination: routes.SUBSCRIBE_PURPOSE_LIST, suppressToast: false }
    )
  }

  const wrapRemove = (client: Client) => async () => {
    await runAction(
      {
        path: {
          endpoint: 'CLIENT_REMOVE_FROM_PURPOSE',
          endpointParams: { clientId: client.id, purposeId },
        },
      },
      { suppressToast: true }
    )
  }

  const showClientsDialog = () => {
    setDialog({ type: 'addClients', exclude: clientsData, onSubmit: addClients })
  }

  const headData = ['Nome client', '']

  return (
    <React.Fragment>
      <Paper sx={{ bgcolor: 'background.paper', p: 3, mt: 2 }}>
        <StyledIntro variant="h2" sx={{ mb: 4 }}>
          {{ title: 'Associazione client' }}
        </StyledIntro>

        <TableWithLoader
          loadingText={null}
          headData={headData}
          noDataLabel="Nessun client associato"
        >
          {Boolean(clientsData.length > 0) &&
            clientsData.map((client, i) => (
              <StyledTableRow key={i} cellData={[{ label: client.name }]}>
                <ButtonNaked onClick={wrapRemove(client)}>
                  <DeleteOutlineIcon fontSize="small" color="primary" />
                </ButtonNaked>
              </StyledTableRow>
            ))}
        </TableWithLoader>
        <StyledButton sx={{ my: 2 }} variant="contained" size="small" onClick={showClientsDialog}>
          + Aggiungi
        </StyledButton>

        <StepActions
          back={{ label: 'Indietro', type: 'button', onClick: back }}
          forward={{ label: 'Salva e torna alle finalità', type: 'button', onClick: goToList }}
        />
      </Paper>

      <Paper sx={{ p: 3, mt: 2 }}>
        <StyledIntro variant="h2">
          {{
            title: 'Azioni rapide di pubblicazione',
            description:
              'Hai inserito tutte le informazioni per questa finalità? Da qui puoi pubblicare immediatamente una bozza, oppure cancellarla. Se desideri pubblicare più tardi, salva solo la bozza sopra',
          }}
        </StyledIntro>
        <Box sx={{ display: 'flex', mt: 3 }}>
          <StyledButton
            sx={{ mr: 2 }}
            variant="contained"
            onClick={wrapActionInDialog(publishVersion, 'PURPOSE_VERSION_ACTIVATE')}
          >
            Pubblica bozza
          </StyledButton>
          <StyledButton
            variant="outlined"
            onClick={wrapActionInDialog(deleteVersion, 'PURPOSE_DRAFT_DELETE')}
          >
            Cancella bozza
          </StyledButton>
        </Box>
      </Paper>
    </React.Fragment>
  )
}
