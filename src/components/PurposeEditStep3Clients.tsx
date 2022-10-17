import React, { FunctionComponent, useContext } from 'react'
import { Box, Stack } from '@mui/material'
import { useHistory } from 'react-router-dom'
import { ActiveStepProps } from '../hooks/useActiveStep'
import { useFeedback } from '../hooks/useFeedback'
import { StepActions } from './Shared/StepActions'
import { StyledButton } from './Shared/StyledButton'
import { StyledIntro } from './Shared/StyledIntro'
import { TableWithLoader } from './Shared/TableWithLoader'
import { DeleteOutline as DeleteOutlineIcon } from '@mui/icons-material'
import { StyledTableRow } from './Shared/StyledTableRow'
import { Client, DecoratedPurpose, Purpose, PurposeVersion } from '../../types'
import { DialogContext } from '../lib/context'
import { useAsyncFetch } from '../hooks/useAsyncFetch'
import { useRoute } from '../hooks/useRoute'
import { decoratePurposeWithMostRecentVersion, getPurposeFromUrl } from '../lib/purpose'
import { ButtonNaked } from '@pagopa/mui-italia'
import { LoadingWithMessage } from './Shared/LoadingWithMessage'
import { useTranslation } from 'react-i18next'
import { useJwt } from '../hooks/useJwt'
import { StyledPaper } from './StyledPaper'

export const PurposeEditStep3Clients: FunctionComponent<ActiveStepProps> = ({ back }) => {
  const history = useHistory()
  const purposeId = getPurposeFromUrl(history.location)
  const { setDialog } = useContext(DialogContext)
  const { routes } = useRoute()
  const { jwt } = useJwt()
  const { t } = useTranslation(['purpose', 'toast', 'common'])

  const { runAction, forceRerenderCounter } = useFeedback()

  const { data: clientsData = [], isLoading: isClientReallyLoading } = useAsyncFetch<
    { clients: Array<Client> },
    Array<Client>
  >(
    {
      path: { endpoint: 'CLIENT_GET_LIST' },
      config: { params: { consumerId: jwt?.organization.id, purposeId } },
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
    const successMessage = t('PURPOSE_DRAFT_UPDATE.success.message', { ns: 'toast' })
    history.push(routes.SUBSCRIBE_PURPOSE_LIST.PATH, {
      toast: { outcome: 'success', message: successMessage },
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
    const currentVersion = purposeFetchedData?.currentVersion as PurposeVersion
    await runAction(
      {
        path: {
          endpoint: 'PURPOSE_VERSION_ACTIVATE',
          endpointParams: { purposeId, versionId: currentVersion.id },
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

  const headData = [t('edit.step3.tableHeadData.clientName'), '']

  const isLoading = isClientReallyLoading || isPurposeReallyLoading

  return (
    <React.Fragment>
      <StyledPaper>
        <StyledIntro component="h2" sx={{ mb: 4 }}>
          {{ title: t('edit.step3.title') }}
        </StyledIntro>
        <TableWithLoader
          isLoading={isLoading}
          headData={headData}
          noDataLabel={t('edit.step3.noDataLabel')}
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
        <StyledButton sx={{ mt: 2 }} variant="contained" size="small" onClick={showClientsDialog}>
          {t('addBtn', { ns: 'common' })}
        </StyledButton>
      </StyledPaper>

      <StepActions
        back={{ label: t('edit.backWithoutSaveBtn'), type: 'button', onClick: back }}
        forward={{ label: t('edit.endWithSaveBtn'), type: 'button', onClick: goToList }}
      />

      <Box sx={{ mt: 8 }}>
        <StyledPaper>
          <StyledIntro component="h2">
            {{
              title: t('edit.quickPublish.title'),
              description: t('edit.quickPublish.description'),
            }}
          </StyledIntro>
          {!isPurposeReallyLoading ? (
            <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
              <StyledButton variant="outlined" onClick={deleteVersion}>
                {t('edit.quickPublish.deleteBtn')}
              </StyledButton>
              <StyledButton variant="contained" onClick={publishVersion}>
                {t('edit.quickPublish.publishBtn')}
              </StyledButton>
            </Stack>
          ) : (
            <LoadingWithMessage label={t('loadingSingleLabel')} transparentBackground />
          )}
        </StyledPaper>
      </Box>
    </React.Fragment>
  )
}
