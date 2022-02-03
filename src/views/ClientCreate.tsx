import React, { useContext } from 'react'
import { Formik } from 'formik'
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
import { AddSecurityOperatorFormInputValues, FormikSetFieldValue, User } from '../../types'
import { Box } from '@mui/system'
import { TableCell, TableRow, Typography } from '@mui/material'

type ClientFields = {
  name: string
  description: string
  operators: Array<User>
}

export function ClientCreate() {
  const { runActionWithDestination } = useFeedback()
  const { party } = useContext(PartyContext)
  const { setDialog } = useContext(DialogContext)

  const onSubmit = async (values: ClientFields) => {
    const dataToPost = { ...values, consumerId: party?.partyId }

    await runActionWithDestination(
      { path: { endpoint: 'CLIENT_CREATE' }, config: { data: dataToPost } },
      { destination: ROUTES.SUBSCRIBE_CLIENT_LIST, suppressToast: false }
    )
  }

  const validationSchema = object({
    name: string().required(),
    description: string().required(),
    operators: array(object({ id: string().required() })),
  })
  const initialValues: ClientFields = { name: '', description: '', operators: [] }

  const headData = ['Nome e cognome', '']

  const wrapOpenAddOperatoDialog = (setFieldValue: FormikSetFieldValue) => () => {
    setDialog({
      type: 'addSecurityOperator',
      initialValues: { selected: [] },
      onSubmit: wrapAddOperators(setFieldValue),
    })
  }

  const wrapAddOperators =
    (setFieldValue: FormikSetFieldValue) => (data: AddSecurityOperatorFormInputValues) => {
      setFieldValue('operators', data.selected, false)
    }

  const wrapRemoveOperator =
    (setFieldValue: FormikSetFieldValue, data: ClientFields, id: string) => () => {
      setFieldValue(
        'operators',
        data.operators.filter((u) => u.id !== id),
        false
      )
    }

  return (
    <React.Fragment>
      <StyledIntro>
        {{
          title: `Crea nuovo client`,
          description:
            'Una volta creato il client, potrai completarlo inserendo tutti gli operatori che hanno la possibilità di caricare chiavi di sicurezza e le finalità per fruire degli e-service per i quali hai una richiesta di fruizione attiva',
        }}
      </StyledIntro>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        validateOnChange={false}
        validateOnBlur={false}
      >
        {({ handleSubmit, errors, values, handleChange, setFieldValue }) => (
          <StyledForm onSubmit={handleSubmit}>
            <Box sx={{ mb: 12 }}>
              <StyledIntro sx={{ mb: 2, pb: 0 }} variant="h2">
                {{ title: 'Informazioni generali' }}
              </StyledIntro>

              <StyledInputControlledText
                focusOnMount={true}
                name="name"
                label="Nome del client*"
                value={values.name}
                onChange={handleChange}
                error={errors.name}
              />

              <StyledInputControlledText
                name="description"
                label="Descrizione del client*"
                value={values.description}
                onChange={handleChange}
                error={errors.description}
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
                data={values.operators}
                noDataLabel="Nessun utente aggiunto"
              >
                {values.operators.map((user, i) => (
                  <TableRow key={i} sx={{ bgcolor: 'common.white' }}>
                    <TableCell
                      dangerouslySetInnerHTML={{ __html: `${user.name} ${user.surname}` }}
                    />

                    <TableCell>
                      <StyledButton onClick={wrapRemoveOperator(setFieldValue, values, user.id)}>
                        Elimina
                      </StyledButton>
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
                <StyledButton
                  sx={{ mr: 2 }}
                  variant="contained"
                  onClick={wrapOpenAddOperatoDialog(setFieldValue)}
                >
                  + Aggiungi
                </StyledButton>
                <Typography>
                  L’operatore non è presente nell’elenco? Clicca qui per aggiungerlo [TODO SELF
                  CARE?]
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
        )}
      </Formik>
    </React.Fragment>
  )
}
