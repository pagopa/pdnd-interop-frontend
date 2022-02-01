import React, { useContext, useEffect } from 'react'
import { Formik } from 'formik'
import { object, string } from 'yup'
import { StyledIntro } from '../components/Shared/StyledIntro'
import { useAsyncFetch } from '../hooks/useAsyncFetch'
import { EServiceReadType, InputSelectOption } from '../../types'
import { PartyContext } from '../lib/context'
import { useFeedback } from '../hooks/useFeedback'
import { StyledButton } from '../components/Shared/StyledButton'
import { StyledForm } from '../components/Shared/StyledForm'
import { StyledSkeleton } from '../components/Shared/StyledSkeleton'
import { ROUTES } from '../config/routes'
import { StyledInputControlledText } from '../components/Shared/StyledInputControlledText'
import { StyledInputControlledSelect } from '../components/Shared/StyledInputControlledSelect'

type ClientFields = {
  name: string
  description: string
  eServiceId: string
  purposes: string
}

export function ClientCreate() {
  const { runActionWithDestination } = useFeedback()
  const { party } = useContext(PartyContext)
  const { data: eserviceData } = useAsyncFetch<Array<EServiceReadType>, Array<InputSelectOption>>(
    {
      path: { endpoint: 'ESERVICE_GET_LIST' },
      config: { params: { consumerId: party?.partyId } },
    },
    {
      mapFn: (data) => data.map((d) => ({ value: d.id, label: d.name })),
      loadingTextLabel: 'Stiamo caricando gli e-service associabili al client',
    }
  )

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
    eServiceId: string().required(),
    purposes: string().required(),
  })
  const initialValues: ClientFields = { name: '', description: '', eServiceId: '', purposes: '' }

  useEffect(() => {
    if (eserviceData && eserviceData.length > 0) {
      initialValues.eServiceId = String(eserviceData[0].value)
    }
  }, [eserviceData]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!eserviceData) {
    return <StyledSkeleton />
  }

  return (
    <React.Fragment>
      <StyledIntro>
        {{
          title: `Crea nuovo client`,
          description:
            "Il client sarà associato ad uno specifico e-service. Una volta creato, sarà possibile aggiungere operatori di sicurezza che gestiranno le chiavi per permettere l'accesso machine-to-machine all'e-service",
        }}
      </StyledIntro>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        validateOnChange={false}
        validateOnBlur={false}
      >
        {({ handleSubmit, errors, values, handleChange }) => (
          <StyledForm onSubmit={handleSubmit}>
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

            <StyledInputControlledSelect
              name="eServiceId"
              label="E-service da associare*"
              value={values.eServiceId}
              onChange={handleChange}
              error={errors.eServiceId}
              disabled={eserviceData.length === 0}
              options={eserviceData}
            />

            <StyledInputControlledText
              name="purposes"
              label="Finalità*"
              value={values.purposes}
              onChange={handleChange}
              error={errors.purposes}
            />

            <StyledButton sx={{ mt: 8 }} variant="contained" type="submit">
              Crea client
            </StyledButton>
          </StyledForm>
        )}
      </Formik>
    </React.Fragment>
  )
}
