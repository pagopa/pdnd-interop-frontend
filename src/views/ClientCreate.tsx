import React, { useContext } from 'react'
import { useFormik } from 'formik'
import { array, object, string } from 'yup'
import { StyledIntro } from '../components/Shared/StyledIntro'
import { DialogContext, PartyContext } from '../lib/context'
import { useFeedback } from '../hooks/useFeedback'
import { StyledButton } from '../components/Shared/StyledButton'
import { StyledForm } from '../components/Shared/StyledForm'
import { StyledInputControlledText } from '../components/Shared/StyledInputControlledText'
import { TableWithLoader } from '../components/Shared/TableWithLoader'
import { AddSecurityOperatorFormInputValues, User } from '../../types'
import { Box } from '@mui/system'
import { DeleteOutline as DeleteOutlineIcon } from '@mui/icons-material'
import { StyledTableRow } from '../components/Shared/StyledTableRow'
import { useRoute } from '../hooks/useRoute'
import { useClientKind } from '../hooks/useClientKind'
import { AxiosResponse } from 'axios'
import { useHistory } from 'react-router-dom'
import { fetchAllWithLogs } from '../lib/api-utils'
import { Divider, Grid, Paper } from '@mui/material'
import { PageBottomActions } from '../components/Shared/PageBottomActions'
import { ButtonNaked } from '@pagopa/mui-italia'

type ClientFields = {
  name: string
  description: string
  operators: Array<User>
}

export function ClientCreate() {
  const { runAction } = useFeedback()
  const { party } = useContext(PartyContext)
  const { setDialog } = useContext(DialogContext)
  const { routes } = useRoute()
  const clientKind = useClientKind()
  const history = useHistory()

  const onSubmit = async (data: ClientFields) => {
    const dataToPost = { name: data.name, description: data.description, consumerId: party?.id }

    const endpoint = clientKind === 'CONSUMER' ? 'CLIENT_CREATE' : 'CLIENT_INTEROP_M2M_CREATE'
    const { outcome, response } = await runAction({
      path: { endpoint },
      config: { data: dataToPost },
    })

    if (outcome === 'success') {
      await fetchAllWithLogs(
        data.operators.map(({ id }) => ({
          path: {
            endpoint: 'OPERATOR_SECURITY_JOIN_WITH_CLIENT',
            endpointParams: {
              clientId: (response as AxiosResponse).data.id,
              relationshipId: id,
            },
          },
        }))
      )

      const destination =
        clientKind === 'CONSUMER'
          ? routes.SUBSCRIBE_CLIENT_LIST.PATH
          : `${routes.SUBSCRIBE_INTEROP_M2M.PATH}?tab=clients`

      history.push(destination)
    }
  }

  const validationSchema = object({
    name: string().required(),
    description: string().required(),
    operators: array(object({ id: string().required() })),
  })

  const initialValues: ClientFields = { name: '', description: '', operators: [] }

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
    validateOnChange: false,
    validateOnBlur: false,
  })

  const openAddOperatoDialog = () => {
    setDialog({
      type: 'addSecurityOperator',
      initialValues: { selected: [] },
      onSubmit: addOperators,
    })
  }

  // const openCreateOperatoDialog = () => {
  //   setDialog({ type: 'createSecurityOperator' })
  // }

  const addOperators = (data: AddSecurityOperatorFormInputValues) => {
    formik.setFieldValue('operators', data.selected, false)
  }

  const wrapRemoveOperator = (id: string) => () => {
    const filteredOperators = formik.values.operators.filter((u) => u.id !== id)
    formik.setFieldValue('operators', filteredOperators, false)
  }

  const headData = ['Nome e cognome', '']

  return (
    <React.Fragment>
      <StyledIntro>
        {{
          title: `Crea nuovo client`,
          description:
            'Una volta creato il client, potrai completarlo inserendo tutti gli operatori che hanno la possibilità di caricare chiavi di sicurezza e le finalità per fruire degli E-Service per i quali hai una richiesta di fruizione attiva',
        }}
      </StyledIntro>

      <Grid container>
        <Grid item xs={8}>
          <Paper sx={{ bgcolor: 'background.paper', p: 3, mt: 2 }}>
            <StyledForm onSubmit={formik.handleSubmit}>
              <StyledIntro sx={{ mb: 2, pb: 0 }} variant="h2">
                {{ title: 'Informazioni generali' }}
              </StyledIntro>

              <StyledInputControlledText
                focusOnMount={true}
                name="name"
                label="Nome del client (richiesto)"
                infoLabel="Ti aiuta a distinguerlo dagli altri"
                value={formik.values.name}
                onChange={formik.handleChange}
                error={formik.errors.name}
              />

              <StyledInputControlledText
                name="description"
                label="Descrizione del client (richiesto)"
                value={formik.values.description}
                onChange={formik.handleChange}
                error={formik.errors.description}
                multiline={true}
              />

              <Divider />

              <StyledIntro sx={{ mt: 8, mb: 4 }} variant="h2">
                {{ title: 'Operatori di sicurezza' }}
              </StyledIntro>

              <TableWithLoader
                loadingText={null}
                headData={headData}
                noDataLabel="Nessun operatore aggiunto"
              >
                {Boolean(formik.values.operators.length > 0) &&
                  formik.values.operators.map((user, i) => (
                    <StyledTableRow key={i} cellData={[{ label: `${user.name} ${user.surname}` }]}>
                      <ButtonNaked onClick={wrapRemoveOperator(user.id)}>
                        <DeleteOutlineIcon fontSize="small" color="primary" />
                      </ButtonNaked>
                    </StyledTableRow>
                  ))}
              </TableWithLoader>

              <Box sx={{ display: 'flex', alignItems: 'center', my: 2 }}>
                <StyledButton variant="contained" size="small" onClick={openAddOperatoDialog}>
                  + Aggiungi
                </StyledButton>
                {/* <StyledButton variant="outlined" onClick={openCreateOperatoDialog}>
              Crea nuovo operatore
            </StyledButton> */}
              </Box>

              <Divider />

              <PageBottomActions>
                <StyledButton variant="contained" type="submit">
                  Crea client
                </StyledButton>
                <StyledButton variant="text" to={routes.SUBSCRIBE_CLIENT_LIST.PATH}>
                  Torna alla lista dei client
                </StyledButton>
              </PageBottomActions>
            </StyledForm>
          </Paper>
        </Grid>
      </Grid>
    </React.Fragment>
  )
}
