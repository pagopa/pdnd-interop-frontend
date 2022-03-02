import React, { useContext } from 'react'
import { Formik } from 'formik'
import { useLocation } from 'react-router-dom'
import { useMode } from '../hooks/useMode'
import { Party, ProviderOrSubscriber, UserOnCreate } from '../../types'
import { PartyContext } from '../lib/context'
import { buildDynamicRoute, getBits } from '../lib/router-utils'
import { StyledIntro, StyledIntroChildrenProps } from '../components/Shared/StyledIntro'
import { useFeedback } from '../hooks/useFeedback'
import { StyledButton } from '../components/Shared/StyledButton'
import { StyledForm } from '../components/Shared/StyledForm'
import { AxiosResponse } from 'axios'
import { UserCreationForm } from '../components/Shared/UserCreationForm'
import {
  userCreationFormContract,
  userCreationFormInitialValues,
  userCreationFormValidationSchema,
} from '../config/forms'
import { useRoute } from '../hooks/useRoute'
import { useClientKind } from '../hooks/useClientKind'

export function UserCreate() {
  const { runActionWithDestination, runAction } = useFeedback()
  const location = useLocation()
  const mode = useMode()
  const { routes } = useRoute()
  const currentMode = mode as ProviderOrSubscriber
  const { party } = useContext(PartyContext)
  const clientKind = useClientKind()

  const onSubmit = async (operator: Partial<UserOnCreate>) => {
    const userData = {
      ...operator,
      role: 'OPERATOR',
      product: 'interop',
      productRole: mode === 'provider' ? 'api' : 'security',
    }
    const { institutionId } = party as Party
    const dataToPost = { users: [userData], institutionId, contract: userCreationFormContract }

    if (mode === 'provider') {
      // Create the api operator
      await runActionWithDestination(
        { path: { endpoint: 'OPERATOR_CREATE' }, config: { data: dataToPost } },
        { destination: routes.PROVIDE_OPERATOR_LIST, suppressToast: false }
      )
    } else {
      // First create the security operator
      const { response } = await runAction(
        { path: { endpoint: 'OPERATOR_CREATE' }, config: { data: dataToPost } },
        { suppressToast: false }
      )

      const bits = getBits(location)
      const clientId = bits[bits.length - 3]

      const destinationPath =
        clientKind === 'API'
          ? routes.SUBSCRIBE_INTEROP_M2M_CLIENT_EDIT
          : routes.SUBSCRIBE_CLIENT_EDIT

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
          destination: buildDynamicRoute(
            destinationPath,
            { clientId },
            { tab: 'securityOperators' }
          ),
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

  return (
    <React.Fragment>
      <StyledIntro>{INTRO[currentMode]}</StyledIntro>

      <Formik
        initialValues={userCreationFormInitialValues}
        validationSchema={userCreationFormValidationSchema}
        onSubmit={onSubmit}
        validateOnChange={false}
        validateOnBlur={false}
      >
        {({ handleSubmit, errors, values, handleChange }) => (
          <StyledForm onSubmit={handleSubmit}>
            <UserCreationForm handleChange={handleChange} errors={errors} values={values} />
            <StyledButton sx={{ mt: 8 }} variant="contained" type="submit">
              Crea operatore
            </StyledButton>
          </StyledForm>
        )}
      </Formik>
    </React.Fragment>
  )
}
