import React, { useEffect, useState } from 'react'
import { Formik } from 'formik'
import { object, string, number } from 'yup'
import { useHistory } from 'react-router-dom'
import { AxiosResponse } from 'axios'
import isEmpty from 'lodash/isEmpty'
import {
  ApiEndpointKey,
  EServiceDescriptorRead,
  EServiceReadType,
  StepperStepComponentProps,
} from '../../types'
import { buildDynamicPath } from '../lib/router-utils'
import { useFeedback } from '../hooks/useFeedback'
import { StyledForm } from './Shared/StyledForm'
import { StepActions } from './Shared/StepActions'
import { StyledInputControlledText } from './Shared/StyledInputControlledText'
import { useEserviceCreateFetch } from '../hooks/useEserviceCreateFetch'
import { useRoute } from '../hooks/useRoute'

type VersionData = {
  audience: string
  version: string
  voucherLifespan: number
  description: string
  dailyCalls: number
}

export function EServiceCreateStep2Version({ forward, back }: StepperStepComponentProps) {
  const { routes } = useRoute()
  const history = useHistory()
  const { runActionWithCallback } = useFeedback()
  const { data: fetchedData } = useEserviceCreateFetch()

  const validationSchema = object({
    version: string().required(),
    audience: string().required(),
    voucherLifespan: number().required(),
    description: string().required(),
    dailyCalls: number().required(),
  })
  const initialValues: VersionData = {
    version: '1',
    audience: '',
    voucherLifespan: 1,
    description: '',
    dailyCalls: 1,
  }
  const [initialOrFetchedValues, setInitialOrFetchedValues] = useState(initialValues)

  // Pre-fill if there is already a draft of the service available
  useEffect(() => {
    if (fetchedData && !isEmpty(fetchedData.activeDescriptor)) {
      const activeDescriptor = (fetchedData as EServiceReadType)
        .activeDescriptor as EServiceDescriptorRead
      const { audience, version, voucherLifespan, description, dailyCalls } = activeDescriptor
      setInitialOrFetchedValues({
        version,
        audience: Boolean(audience.length > 0) ? audience[0] : '',
        voucherLifespan,
        description,
        dailyCalls: dailyCalls || 1,
      })
    }
  }, [fetchedData]) // eslint-disable-line react-hooks/exhaustive-deps

  const onSubmit = async (data: VersionData) => {
    // Format the data like the backend wants it
    const dataToPost = {
      audience: [data.audience],
      voucherLifespan: data.voucherLifespan,
      description: data.description,
      // dailyCalls: data.dailyCalls,
    }

    const sureFetchedData = fetchedData as EServiceReadType

    // Define which endpoint to call
    let endpoint: ApiEndpointKey = 'ESERVICE_VERSION_DRAFT_CREATE'
    const endpointParams: Record<string, string> = { eserviceId: sureFetchedData.id }
    const isNewDescriptor = isEmpty(sureFetchedData.activeDescriptor)
    if (!isNewDescriptor) {
      const activeDescriptor = sureFetchedData.activeDescriptor as EServiceDescriptorRead
      endpoint = 'ESERVICE_VERSION_DRAFT_UPDATE'
      endpointParams.descriptorId = activeDescriptor.id
    }

    await runActionWithCallback(
      {
        path: { endpoint, endpointParams },
        config: { data: dataToPost },
      },
      { callback: wrapOnSubmitSuccess(isNewDescriptor), suppressToast: false }
    )
  }

  const wrapOnSubmitSuccess = (isNewDescriptor: boolean) => (response: AxiosResponse) => {
    if (isNewDescriptor) {
      const descriptorId = response.data.id

      // Replace the create route with the acutal descriptorId, now that we have it.
      // WARNING: this will NOT cause a re-render that will fetch fresh data
      // at the EServiceCreate component level. This is because, to the router, this is not
      // a change of route, we are still in the 'ESERVICE_EDIT' route.
      // The EServiceCreate component rerenders because we added "history.location"
      // as a useEffect dependency in EServiceCreate useEserviceCreateFetch hook
      history.replace(
        buildDynamicPath(routes.PROVIDE_ESERVICE_EDIT.PATH, {
          eserviceId: (fetchedData as EServiceReadType).id,
          descriptorId,
        }),
        { stepIndexDestination: 2 }
      )
    } else {
      // Go to next step
      forward()
    }
  }

  return (
    <Formik
      initialValues={initialOrFetchedValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      validateOnChange={false}
      validateOnBlur={false}
      enableReinitialize={true}
    >
      {({ handleSubmit, errors, values, handleChange }) => (
        <StyledForm onSubmit={handleSubmit}>
          <StyledInputControlledText
            name="version"
            label="Numero della versione*"
            disabled={true}
            value={values.version}
            error={errors.version}
          />

          <StyledInputControlledText
            name="audience"
            label="Identificativo dell'e-service*"
            infoLabel="L'id con il quale il fruitore dichiara il servizio richiesto. Questo identificativo deve essere unico tra i tuoi e-service"
            value={values.audience}
            error={errors.audience}
            onChange={handleChange}
            focusOnMount={true}
          />

          <StyledInputControlledText
            name="voucherLifespan"
            label="Durata di validità del voucher (in minuti)*"
            type="number"
            inputProps={{ min: '1', max: '5' }}
            value={values.voucherLifespan}
            error={errors.voucherLifespan}
            onChange={handleChange}
          />

          <StyledInputControlledText
            name="description"
            label="Descrizione della versione*"
            value={values.description}
            error={errors.description}
            onChange={handleChange}
            multiline={true}
          />

          <StyledInputControlledText
            name="dailyCalls"
            label="Soglia chiamate API/giorno (richiesto)"
            infoLabel="Il fruitore dovrà dichiarare una stima delle chiamate che effettuerà per ogni finalità. Se la somma delle chiamate dichiarate dal fruitore sarà sopra la soglia da te impostata, potrai approvare manualmente l'accesso di queste finalità alla fruizione del tuo e-service"
            type="number"
            value={values.dailyCalls}
            error={errors.dailyCalls}
            onChange={handleChange}
            inputProps={{ min: '1' }}
          />

          <StepActions
            back={{ label: 'Indietro', type: 'button', onClick: back }}
            forward={{ label: 'Salva bozza e prosegui', type: 'submit' }}
          />
        </StyledForm>
      )}
    </Formik>
  )
}
