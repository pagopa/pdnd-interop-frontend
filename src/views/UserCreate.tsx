import React, { useContext } from 'react'
import { Formik } from 'formik'
import { object, string } from 'yup'
import { useLocation } from 'react-router-dom'
import { useMode } from '../hooks/useMode'
import { Party, ProviderOrSubscriber, UserOnCreate } from '../../types'
import { PartyContext } from '../lib/context'
import { buildDynamicRoute, getBits } from '../lib/router-utils'
import { StyledIntro, StyledIntroChildrenProps } from '../components/Shared/StyledIntro'
import { useFeedback } from '../hooks/useFeedback'
import { StyledButton } from '../components/Shared/StyledButton'
import { StyledForm } from '../components/Shared/StyledForm'
import { ROUTES } from '../config/routes'
import { Contained } from '../components/Shared/Contained'
import { AxiosResponse } from 'axios'
import { Grid } from '@mui/material'
import { StyledInputControlledTextFormik } from '../components/Shared/StyledInputControlledTextFormik'

export function UserCreate() {
  const { runActionWithDestination, runAction } = useFeedback()
  const location = useLocation()
  const mode = useMode()
  const currentMode = mode as ProviderOrSubscriber
  const { party } = useContext(PartyContext)

  const onSubmit = async (operator: Partial<UserOnCreate>) => {
    const userData = {
      ...operator,
      role: 'OPERATOR',
      product: 'interop',
      productRole: mode === 'provider' ? 'api' : 'security',
    }

    const { institutionId } = party as Party
    const contract = { version: '1', path: 'contracts/v1/interop-contract.html' }
    const dataToPost = { users: [userData], institutionId, contract }

    if (mode === 'provider') {
      // Create the api operator
      await runActionWithDestination(
        { path: { endpoint: 'OPERATOR_CREATE' }, config: { data: dataToPost } },
        { destination: ROUTES.PROVIDE_OPERATOR_LIST, suppressToast: false }
      )
    } else {
      // First create the security operator
      const { response } = await runAction(
        { path: { endpoint: 'OPERATOR_CREATE' }, config: { data: dataToPost } },
        { suppressToast: false }
      )

      const bits = getBits(location)
      const clientId = bits[2]

      // Then, join it with the client it belongs to
      await runActionWithDestination(
        {
          path: {
            endpoint: 'OPERATOR_SECURITY_JOIN_WITH_CLIENT',
            endpointParams: {
              clientId,
              relationshipId: (response as AxiosResponse).data[0].id,
            },
          },
        },
        {
          destination: buildDynamicRoute(ROUTES.SUBSCRIBE_CLIENT_EDIT, {
            id: clientId,
          }),
          suppressToast: false,
        }
      )
    }
  }

  const INTRO: Record<ProviderOrSubscriber, StyledIntroChildrenProps> = {
    provider: {
      title: 'Crea nuovo operatore API',
      description:
        "La figura dell'operatore API potrà gestire i tuoi servizi, crearne di nuovi, sospenderli e riattivarli, gestire le versioni. L'attivazione degli accordi di interoperabilità invece rimarrà esclusivamente sotto il controllo dell'Amministratore e dei suoi Delegati. Al nuovo utente verrà inviata una notifica all'indirizzo email indicato in questa form",
    },
    subscriber: {
      title: 'Crea nuovo operatore di sicurezza',
      description:
        "La figura dell'operatore di sicurezza potrà caricare una chiave pubblica per il client al quale è stato assegnato, ed eventualmente sospenderla o aggiornarla. Al nuovo utente verrà inviata una notifica all'indirizzo email indicato in questa form",
    },
  }

  const initialValues = { name: '', surname: '', taxCode: '', email: '' }
  const validationSchema = object({
    name: string().required(),
    surname: string().required(),
    taxCode: string().required(),
    email: string().email().required(),
  })

  return (
    <React.Fragment>
      <StyledIntro>{INTRO[currentMode]}</StyledIntro>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        validateOnChange={false}
        validateOnBlur={false}
      >
        {({ handleSubmit, errors, values, handleChange }) => (
          <StyledForm onSubmit={handleSubmit}>
            <Contained>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <StyledInputControlledTextFormik
                    focusOnMount={true}
                    sx={{ my: 4 }}
                    label="Nome*"
                    name="name"
                    onChange={handleChange}
                    value={values.name}
                    error={errors.name}
                  />
                </Grid>

                <Grid item xs={6}>
                  <StyledInputControlledTextFormik
                    sx={{ my: 4 }}
                    label="Cognome*"
                    name="surname"
                    onChange={handleChange}
                    value={values.surname}
                    error={errors.surname}
                  />
                </Grid>

                <Grid item xs={12}>
                  <StyledInputControlledTextFormik
                    sx={{ my: 4 }}
                    label="Codice Fiscale*"
                    name="taxCode"
                    onChange={handleChange}
                    value={values.taxCode}
                    error={errors.taxCode}
                  />
                </Grid>

                <Grid item xs={12}>
                  <StyledInputControlledTextFormik
                    type="email"
                    infoLabel="Inserisci l'indirizzo email ad uso aziendale utilizzato per l'Ente"
                    sx={{ my: 4 }}
                    label="Email ad uso aziendale*"
                    name="email"
                    onChange={handleChange}
                    value={values.email}
                    error={errors.email}
                  />
                </Grid>
              </Grid>
            </Contained>

            <StyledButton sx={{ mt: 8 }} variant="contained" type="submit">
              Crea operatore
            </StyledButton>
          </StyledForm>
        )}
      </Formik>
    </React.Fragment>
  )
}
