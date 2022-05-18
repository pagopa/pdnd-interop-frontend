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
import { LoadingWithMessage } from './Shared/LoadingWithMessage'
import { useTranslation } from 'react-i18next'

export const PurposeCreateStep3Clients: FunctionComponent<ActiveStepProps> = ({ back }) => {
  const history = useHistory()
  const purposeId = getPurposeFromUrl(history.location)
  const { setDialog } = useContext(DialogContext)
  const { routes } = useRoute()
  const { party } = useContext(PartyContext)
  const { t } = useTranslation('purpose')

  const { runAction, forceRerenderCounter } = useFeedback()

  const { data: clientsData = [], isLoading: isClientReallyLoading } = useAsyncFetch<
    { clients: Array<Client> },
    Array<Client>
  >(
    {
      path: { endpoint: 'CLIENT_GET_LIST' },
      config: { params: { consumerId: party?.id, purposeId } },
    },
    {
      mapFn: (data) => data.clients,
      useEffectDeps: [forceRerenderCounter],
    }
  )

  const { data: purposeFetchedData, isLoading: isPurposeReallyLoading } = useAsyncFetch<
    Purpose,
    DecoratedPurpose
  >(
    { path: { endpoint: 'PURPOSE_GET_SINGLE', endpointParams: { purposeId } } },
    { mapFn: decoratePurposeWithMostRecentVersion }
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
          { suppressToast: ['success'] }
        )
      })
    )
  }

  const publishVersion = async () => {
    await runAction(
      {
        path: {
          endpoint: 'PURPOSE_VERSION_ACTIVATE',
          endpointParams: { purposeId, versionId: purposeFetchedData?.currentVersion.id },
        },
      },
      { onSuccessDestination: routes.SUBSCRIBE_PURPOSE_LIST, showConfirmDialog: true }
    )
  }

  const deleteVersion = async () => {
    await runAction(
      {
        path: { endpoint: 'PURPOSE_DRAFT_DELETE', endpointParams: { purposeId } },
      },
      { onSuccessDestination: routes.SUBSCRIBE_PURPOSE_LIST, showConfirmDialog: true }
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
      { suppressToast: ['success'] }
    )
  }

  const showClientsDialog = () => {
    setDialog({ type: 'addClients', exclude: clientsData, onSubmit: addClients })
  }

  const headData = [t('create.step3.tableHeadData.clientName'), '']

  const isLoading = isClientReallyLoading || isPurposeReallyLoading

  return (
    <React.Fragment>
      <Paper sx={{ bgcolor: 'background.paper', p: 3, mt: 2 }}>
        <StyledIntro component="h2" sx={{ mb: 4 }}>
          {{ title: t('create.step3.title') }}
        </StyledIntro>

        <TableWithLoader
          isLoading={isLoading}
          headData={headData}
          noDataLabel={t('create.step3.noDataLabel')}
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
          back={{ label: t('create.backWithoutSaveBtn'), type: 'button', onClick: back }}
          forward={{ label: t('create.endWithSaveBtn'), type: 'button', onClick: goToList }}
        />
      </Paper>

      <Paper sx={{ p: 3, mt: 2 }}>
        <StyledIntro component="h2">
          {{
            title: t('create.quickPublish.title'),
            description: t('create.quickPublish.description'),
          }}
        </StyledIntro>
        {!isPurposeReallyLoading ? (
          <Box sx={{ display: 'flex', mt: 3 }}>
            <StyledButton sx={{ mr: 2 }} variant="contained" onClick={publishVersion}>
              {t('create.quickPublish.publishBtn')}
            </StyledButton>
            <StyledButton variant="outlined" onClick={deleteVersion}>
              {t('create.quickPublish.deleteBtn')}
            </StyledButton>
          </Box>
        ) : (
          <LoadingWithMessage label={t('loadingSingleLabel')} transparentBackground />
        )}
      </Paper>
    </React.Fragment>
  )
}
