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

type ClientFields = {
  name: string
  description: string
  operators: Array<User>
}

export function ClientCreate() {
  const { /* runActionWithDestination, */ runFakeAction } = useFeedback()
  const { party } = useContext(PartyContext)
  const { setDialog } = useContext(DialogContext)
  const { routes } = useRoute()

  const onSubmit = async (data: ClientFields) => {
    const dataToPost = { ...data, consumerId: party?.partyId }

    // TEMP PIN-933: as soon as backend purpose is deployed, plug back in actual action
    runFakeAction(`Client esempio creato con i seguenti dati ${JSON.stringify(dataToPost)}`)
    // await runActionWithDestination(
    // { path: { endpoint: 'CLIENT_CREATE' }, config: { data: dataToPost } },
    // { destination: ROUTES.SUBSCRIBE_CLIENT_LIST, suppressToast: false }
    // )
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

  const openCreateOperatoDialog = () => {
    setDialog({ type: 'createSecurityOperator' })
  }

  const addOperators = (data: AddSecurityOperatorFormInputValues) => {
    formik.setFieldValue('operators', data.selected, false)
  }

  const wrapRemoveOperator = (id: string) => () => {
    const filteredOperators = formik.values.operators.filter((u) => u.id !== id)
    formik.setFieldValue('operators', filteredOperators, false)
  }

  const headData = ['Nome e cognome']

  return (
    <React.Fragment>
      <StyledIntro>
        {{
          title: `Crea nuovo client`,
          description:
            'Una volta creato il client, potrai completarlo inserendo tutti gli operatori che hanno la possibilità di caricare chiavi di sicurezza e le finalità per fruire degli e-service per i quali hai una richiesta di fruizione attiva',
        }}
      </StyledIntro>

      <StyledForm onSubmit={formik.handleSubmit}>
        <Box sx={{ mb: 12 }}>
          <StyledIntro sx={{ mb: 2, pb: 0 }} variant="h2">
            {{ title: 'Informazioni generali' }}
          </StyledIntro>

          <StyledInputControlledText
            focusOnMount={true}
            name="name"
            label="Nome del client*"
            value={formik.values.name}
            onChange={formik.handleChange}
            error={formik.errors.name}
          />

          <StyledInputControlledText
            name="description"
            label="Descrizione del client*"
            value={formik.values.description}
            onChange={formik.handleChange}
            error={formik.errors.description}
            multiline={true}
          />
        </Box>

        <Box sx={{ mb: 12 }}>
          <StyledIntro sx={{ mb: 2, pb: 0 }} variant="h2">
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
                  <StyledButton onClick={wrapRemoveOperator(user.id)}>
                    <DeleteOutlineIcon fontSize="small" sx={{ mr: 1 }} color="primary" />
                  </StyledButton>
                </StyledTableRow>
              ))}
          </TableWithLoader>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 4 }}>
            <StyledButton sx={{ mr: 2 }} variant="contained" onClick={openAddOperatoDialog}>
              + Aggiungi
            </StyledButton>
            <StyledButton variant="outlined" onClick={openCreateOperatoDialog}>
              Crea nuovo operatore
            </StyledButton>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mt: 4 }}>
          <StyledButton sx={{ mr: 2 }} variant="contained" type="submit">
            Crea client
          </StyledButton>
          <StyledButton variant="outlined" to={routes.SUBSCRIBE_CLIENT_LIST.PATH}>
            Torna ai client
          </StyledButton>
        </Box>
      </StyledForm>
    </React.Fragment>
  )
}
