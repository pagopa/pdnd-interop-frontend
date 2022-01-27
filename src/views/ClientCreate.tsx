import React, { useContext, useEffect } from 'react'
import { useFormik } from 'formik'
import { object, string } from 'yup'
import { StyledIntro } from '../components/Shared/StyledIntro'
import { useAsyncFetch } from '../hooks/useAsyncFetch'
import { EServiceReadType, SelectOption } from '../../types'
import { PartyContext } from '../lib/context'
import { useFeedback } from '../hooks/useFeedback'
import { StyledButton } from '../components/Shared/StyledButton'
import { StyledForm } from '../components/Shared/StyledForm'
import { StyledSkeleton } from '../components/Shared/StyledSkeleton'
import { ROUTES } from '../config/routes'
import { StyledInputControlledTextFormik } from '../components/Shared/StyledInputControlledTextFormik'
import { StyledInputControlledSelectFormik } from '../components/Shared/StyledInputControlledSelectFormik'

type ClientFields = {
  name: string
  description: string
  eServiceId: string
  purposes: string
}

export function ClientCreate() {
  const { runActionWithDestination } = useFeedback()
  const { party } = useContext(PartyContext)
  const { data: eserviceData } = useAsyncFetch<Array<EServiceReadType>, Array<SelectOption>>(
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
  const formik = useFormik({ initialValues, validationSchema, onSubmit })

  useEffect(() => {
    if (eserviceData && eserviceData.length > 0) {
      formik.setValues({ ...initialValues, eServiceId: String(eserviceData[0].value) }, false)
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

      <StyledForm onSubmit={formik.handleSubmit}>
        <StyledInputControlledTextFormik
          focusOnMount={true}
          name="name"
          label="Nome del client*"
          value={formik.values.name}
          onChange={formik.handleChange}
          error={formik.errors.name}
        />

        <StyledInputControlledTextFormik
          name="description"
          label="Descrizione del client*"
          value={formik.values.description}
          onChange={formik.handleChange}
          error={formik.errors.description}
          multiline={true}
        />

        <StyledInputControlledSelectFormik
          name="eServiceId"
          label="E-service da associare*"
          value={formik.values.eServiceId}
          onChange={formik.handleChange}
          error={formik.errors.eServiceId}
          disabled={eserviceData.length === 0}
          options={eserviceData}
        />

        <StyledInputControlledTextFormik
          name="purposes"
          label="Finalità*"
          value={formik.values.purposes}
          onChange={formik.handleChange}
          error={formik.errors.purposes}
        />

        <StyledButton sx={{ mt: 8 }} variant="contained" type="submit">
          Crea client
        </StyledButton>
      </StyledForm>
    </React.Fragment>
  )
}
