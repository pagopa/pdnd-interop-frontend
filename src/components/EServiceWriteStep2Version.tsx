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
import { ROUTES } from '../config/routes'
import { EServiceWriteActions } from './Shared/EServiceWriteActions'
import { EServiceWriteProps } from '../views/EServiceWrite'
import { StyledInputControlledTextFormik } from './Shared/StyledInputControlledTextFormik'

type VersionData = {
  audience: string
  version: string
  voucherLifespan: number
  description: string
  loadEstimate: number
}

export function EServiceWriteStep2Version({
  forward,
  back,
  fetchedData,
}: StepperStepComponentProps & EServiceWriteProps) {
  const history = useHistory()
  const { runActionWithCallback } = useFeedback()

  const validationSchema = object({
    version: string().required(),
    audience: string().required(),
    voucherLifespan: number().required(),
    description: string().required(),
    loadEstimate: number().required(),
  })
  const initialValues: VersionData = {
    version: '1',
    audience: '',
    voucherLifespan: 1,
    description: '',
    loadEstimate: 20000,
  }
  const [initialOrFetchedValues, setInitialOrFetchedValues] = useState(initialValues)

  // Pre-fill if there is already a draft of the service available
  useEffect(() => {
    if (fetchedData && !isEmpty(fetchedData.activeDescriptor)) {
      const activeDescriptor = (fetchedData as EServiceReadType)
        .activeDescriptor as EServiceDescriptorRead
      const { audience, version, voucherLifespan, description } = activeDescriptor
      setInitialOrFetchedValues({
        version,
        audience: Boolean(audience.length > 0) ? audience[0] : '',
        voucherLifespan,
        description,
        loadEstimate: 20000,
      })
    }
  }, [fetchedData]) // eslint-disable-line react-hooks/exhaustive-deps

  const onSubmit = async (data: VersionData) => {
    // Format the data like the backend wants it
    const dataToPost = {
      audience: [data.audience],
      voucherLifespan: data.voucherLifespan,
      description: data.description,
      // loadEstimate: data.loadEstimate
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
      // at the EServiceGate component level. This is because, to the router, this is not
      // a change of route, we are still in the 'ESERVICE_EDIT' route.
      // The EServiceGate component rerenders because we added "history.location"
      // as a useEffect dependency in EServiceGate useAsyncFetch hook
      history.replace(
        buildDynamicPath(ROUTES.PROVIDE_ESERVICE_EDIT.PATH, {
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
          <StyledInputControlledTextFormik
            name="version"
            label="Numero della versione*"
            disabled={true}
            value={values.version}
            error={errors.version}
          />

          <StyledInputControlledTextFormik
            name="audience"
            label="Identificativo dell'e-service*"
            infoLabel="L'id con il quale il fruitore dichiara il servizio richiesto. Questo identificativo deve essere unico tra i tuoi e-service"
            value={values.audience}
            error={errors.audience}
            onChange={handleChange}
            focusOnMount={true}
          />

          <StyledInputControlledTextFormik
            name="voucherLifespan"
            label="Durata di validità del voucher (in minuti)*"
            type="number"
            inputProps={{ min: '1', max: '5' }}
            value={values.voucherLifespan}
            error={errors.voucherLifespan}
            onChange={handleChange}
          />

          <StyledInputControlledTextFormik
            name="description"
            label="Descrizione della versione*"
            value={values.description}
            error={errors.description}
            onChange={handleChange}
            multiline={true}
          />

          <StyledInputControlledTextFormik
            name="load-estimate"
            label="Soglia di carico ammesso (richiesto)"
            infoLabel="Calcolata in numero di richieste al giorno sostenibili per richiesta di fruizione"
            type="number"
            value={values.loadEstimate}
            error={errors.loadEstimate}
            onChange={handleChange}
          />

          <EServiceWriteActions
            back={{ label: 'Indietro', type: 'button', onClick: back }}
            forward={{ label: 'Salva bozza e prosegui', type: 'submit' }}
          />
        </StyledForm>
      )}
    </Formik>
  )
}
