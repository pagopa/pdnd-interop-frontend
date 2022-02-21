import React, { FunctionComponent, useContext, useEffect } from 'react'
import { Paper } from '@mui/material'
import { Box } from '@mui/system'
import { useFormik } from 'formik'
import { useLocation } from 'react-router-dom'
import { array, object, string } from 'yup'
import { ROUTES } from '../config/routes'
import { ActiveStepProps } from '../hooks/useActiveStep'
import { useFeedback } from '../hooks/useFeedback'
import { getBits } from '../lib/router-utils'
import { StepActions } from './Shared/StepActions'
import { StyledButton } from './Shared/StyledButton'
import { StyledForm } from './Shared/StyledForm'
import { StyledIntro } from './Shared/StyledIntro'
import { TableWithLoader } from './Shared/TableWithLoader'
import { DeleteOutline as DeleteOutlineIcon } from '@mui/icons-material'
import { StyledTableRow } from './Shared/StyledTableRow'
import { Client } from '../../types'
import { DialogContext } from '../lib/context'
import { useAsyncFetch } from '../hooks/useAsyncFetch'

type ClientList = {
  clients: Array<Client>
}

export const PurposeCreateStep3Clients: FunctionComponent<ActiveStepProps> = ({ back }) => {
  const location = useLocation()
  const bits = getBits(location)
  const purposeId = bits.pop()
  const { setDialog } = useContext(DialogContext)

  const { wrapActionInDialog, runActionWithDestination } = useFeedback()

  const { data: clientsData } = useAsyncFetch<Array<Client>>(
    { path: { endpoint: 'CLIENT_GET_LIST' }, config: { params: { purposeId } } },
    { loadingTextLabel: 'Stiamo caricando le informazioni della finalità' }
  )

  const initialValues: ClientList = { clients: [] }
  const validationSchema = object({
    clients: array(
      object({
        id: string(),
        name: string(),
        state: string(),
      })
    ),
  })

  const onSubmit = async (data: ClientList) => {
    const dataToPost = { ...data }

    console.log(dataToPost)
    await runActionWithDestination(
      {
        path: { endpoint: 'CLIENT_JOIN_WITH_PURPOSE', endpointParams: { purposeId } },
        config: { params: dataToPost },
      },
      { destination: ROUTES.SUBSCRIBE_PURPOSE_LIST, suppressToast: false }
    )
  }

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
    validateOnChange: false,
    validateOnBlur: false,
    enableReinitialize: true,
  })

  const publishVersion = async () => {
    await runActionWithDestination(
      {
        path: { endpoint: 'PURPOSE_VERSION_ACTIVATE', endpointParams: { purposeId } },
      },
      { destination: ROUTES.SUBSCRIBE_PURPOSE_LIST, suppressToast: false }
    )
  }

  const deleteVersion = async () => {
    await runActionWithDestination(
      {
        path: { endpoint: 'PURPOSE_DRAFT_DELETE', endpointParams: { purposeId } },
      },
      { destination: ROUTES.SUBSCRIBE_PURPOSE_LIST, suppressToast: false }
    )
  }

  const wrapRemove = (client: Client) => () => {
    formik.setFieldValue(
      'clients',
      formik.values.clients.filter((c) => c.id !== client.id),
      false
    )
  }

  const addClients = (clientList: Array<Client>) => {
    formik.setFieldValue('clients', [...formik.values.clients, ...clientList], false)
  }

  const showClientsDialog = () => {
    setDialog({ type: 'addClients', exclude: formik.values.clients, onSubmit: addClients })
  }

  useEffect(() => {
    if (clientsData) {
      formik.setFieldValue('clients', clientsData, false)
    }
  }, [clientsData]) // eslint-disable-line react-hooks/exhaustive-deps

  const headData = ['nome client']

  return (
    <React.Fragment>
      <StyledForm onSubmit={formik.handleSubmit}>
        <TableWithLoader
          loadingText={null}
          headData={headData}
          noDataLabel="Nessun client associato"
        >
          {Boolean(formik.values.clients.length > 0) &&
            formik.values.clients.map((client, i) => (
              <StyledTableRow key={i} cellData={[{ label: client.name }]}>
                <StyledButton onClick={wrapRemove(client)}>
                  <DeleteOutlineIcon fontSize="small" sx={{ mr: 1 }} color="primary" />
                </StyledButton>
              </StyledTableRow>
            ))}
        </TableWithLoader>
        <StyledButton sx={{ mt: 2 }} variant="contained" onClick={showClientsDialog}>
          + Aggiungi
        </StyledButton>

        <StepActions
          back={{ label: 'Indietro', type: 'button', onClick: back }}
          forward={{ label: 'Associa client e torna alle finalità', type: 'submit' }}
        />
      </StyledForm>

      <Paper sx={{ px: 3, py: 4, mt: 12 }} variant="outlined">
        <StyledIntro variant="h2">
          {{
            title: 'Azioni rapide di pubblicazione',
            description:
              'Hai inserito tutte le informazioni per questa finalità? Da qui puoi pubblicare immediatamente una bozza, oppure cancellarla. Se desideri pubblicare più tardi, salva solo la bozza sopra',
          }}
        </StyledIntro>
        <Box sx={{ display: 'flex' }}>
          <StyledButton
            sx={{ mr: 3 }}
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
