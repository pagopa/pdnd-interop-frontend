import React, { useContext } from 'react'
import { useFormik } from 'formik'
import { array, object, string } from 'yup'
import { StyledIntro } from '../components/Shared/StyledIntro'
import { DialogContext, PartyContext } from '../lib/context'
import { useFeedback } from '../hooks/useFeedback'
import { StyledButton } from '../components/Shared/StyledButton'
import { StyledForm } from '../components/Shared/StyledForm'
import { ROUTES } from '../config/routes'
import { StyledInputControlledText } from '../components/Shared/StyledInputControlledText'
import { TableWithLoader } from '../components/Shared/TableWithLoader'
// import { StyledTableRow } from '../components/Shared/StyledTableRow'
import { AddSecurityOperatorFormInputValues, User } from '../../types'
import { Box } from '@mui/system'
import { TableCell, TableRow, Typography } from '@mui/material'

type ClientFields = {
  name: string
  description: string
  operators: Array<User>
}

export function ClientCreate() {
  const { /* runActionWithDestination, */ runFakeAction } = useFeedback()
  const { party } = useContext(PartyContext)
  const { setDialog } = useContext(DialogContext)

  const onSubmit = async (data: ClientFields) => {
    const dataToPost = { ...data, consumerId: party?.partyId }

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
            data={formik.values.operators}
            noDataLabel="Nessun utente aggiunto"
          >
            {formik.values.operators.map((user, i) => (
              <TableRow key={i} sx={{ bgcolor: 'common.white' }}>
                <TableCell dangerouslySetInnerHTML={{ __html: `${user.name} ${user.surname}` }} />

                <TableCell>
                  <StyledButton onClick={wrapRemoveOperator(user.id)}>Elimina</StyledButton>
                </TableCell>
              </TableRow>

              // <StyledTableRow
              //   key={i}
              //   cellData={[{ label: `${user.name} ${user.surname}` }]}
              //   index={i}
              //   singleActionBtn={{
              //     to: ''
              //     label: 'Rimuovi',
              //   }}
              // />
            ))}
          </TableWithLoader>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 4 }}>
            <StyledButton sx={{ mr: 2 }} variant="contained" onClick={openAddOperatoDialog}>
              + Aggiungi
            </StyledButton>
            <Typography>
              L’operatore non è presente nell’elenco? Clicca qui per aggiungerlo [TODO SELF CARE?]
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mt: 4 }}>
          <StyledButton sx={{ mr: 2 }} variant="contained" type="submit">
            Crea client
          </StyledButton>
          <StyledButton variant="outlined" to={ROUTES.SUBSCRIBE_CLIENT_LIST.PATH}>
            Torna ai client
          </StyledButton>
        </Box>
      </StyledForm>
    </React.Fragment>
  )
}
