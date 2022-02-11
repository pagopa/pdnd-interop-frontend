import React, { FunctionComponent, useContext } from 'react'
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
import { CLIENT_STATE_LABEL } from '../config/labels'

type ClientList = {
  clients: Array<Client>
}

export const PurposeWriteStep3Clients: FunctionComponent<ActiveStepProps> = ({ back }) => {
  const location = useLocation()
  const bits = getBits(location)
  const purposeId = bits.pop()
  const { setDialog } = useContext(DialogContext)

  const { wrapActionInDialog, runActionWithDestination } = useFeedback()

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

    await runActionWithDestination(
      {
        path: { endpoint: 'PURPOSE_VERSION_DRAFT_UPDATE', endpointParams: { purposeId } },
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
        path: { endpoint: 'PURPOSE_VERSION_DRAFT_PUBLISH', endpointParams: { purposeId } },
      },
      { destination: ROUTES.SUBSCRIBE_PURPOSE_LIST, suppressToast: false }
    )
  }

  const deleteVersion = async () => {
    await runActionWithDestination(
      {
        path: { endpoint: 'PURPOSE_VERSION_DRAFT_DELETE', endpointParams: { purposeId } },
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

  const headData = ['nome client', 'stato']

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
              <StyledTableRow
                key={i}
                cellData={[{ label: client.name }, { label: CLIENT_STATE_LABEL[client.state] }]}
              >
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
          forward={{ label: 'Salva bozza e torna alle finalità', type: 'submit' }}
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
            onClick={wrapActionInDialog(publishVersion, 'PURPOSE_VERSION_DRAFT_PUBLISH')}
          >
            Pubblica bozza
          </StyledButton>
          <StyledButton
            variant="outlined"
            onClick={wrapActionInDialog(deleteVersion, 'PURPOSE_VERSION_DRAFT_DELETE')}
          >
            Cancella bozza
          </StyledButton>
        </Box>
      </Paper>
    </React.Fragment>
  )
}
