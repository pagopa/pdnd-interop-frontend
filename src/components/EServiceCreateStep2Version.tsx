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
import { Paper } from '@mui/material'
import { RunActionOutput } from '../hooks/useFeedback'

type VersionData = {
  audience: string
  version: string
  voucherLifespan: number
  description: string
  dailyCallsPerConsumer: number
  dailyCallsTotal: number
}

export function EServiceCreateStep2Version({ forward, back }: StepperStepComponentProps) {
  const { routes } = useRoute()
  const history = useHistory()
  const { runAction } = useFeedback()
  const { data: fetchedData } = useEserviceCreateFetch()

  const validationSchema = object({
    version: string().required(),
    audience: string().required(),
    voucherLifespan: number().required(),
    description: string().required(),
    dailyCallsPerConsumer: number().required(),
    dailyCallsTotal: number().required(),
  })
  const initialValues: VersionData = {
    version: '1',
    audience: '',
    voucherLifespan: 1,
    description: '',
    dailyCallsPerConsumer: 1,
    dailyCallsTotal: 1,
  }
  const [initialOrFetchedValues, setInitialOrFetchedValues] = useState(initialValues)

  // Pre-fill if there is already a draft of the service available
  useEffect(() => {
    if (fetchedData && !isEmpty(fetchedData.activeDescriptor)) {
      const activeDescriptor = (fetchedData as EServiceReadType)
        .activeDescriptor as EServiceDescriptorRead
      const {
        audience,
        version,
        voucherLifespan,
        description,
        dailyCallsPerConsumer,
        dailyCallsTotal,
      } = activeDescriptor
      setInitialOrFetchedValues({
        version,
        audience: Boolean(audience.length > 0) ? audience[0] : '',
        voucherLifespan,
        description,
        dailyCallsPerConsumer: dailyCallsPerConsumer || 1,
        dailyCallsTotal: dailyCallsTotal || 1,
      })
    }
  }, [fetchedData]) // eslint-disable-line react-hooks/exhaustive-deps

  const onSubmit = async (data: VersionData) => {
    // Format the data like the backend wants it
    const dataToPost = {
      audience: [data.audience],
      voucherLifespan: data.voucherLifespan,
      description: data.description,
      dailyCallsPerConsumer: data.dailyCallsPerConsumer,
      dailyCallsTotal: data.dailyCallsTotal,
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

    const { outcome, response } = (await runAction(
      { path: { endpoint, endpointParams }, config: { data: dataToPost } },
      { silent: true, suppressToast: ['success'] }
    )) as RunActionOutput

    if (outcome === 'success') {
      wrapOnSubmitSuccess(isNewDescriptor, response as AxiosResponse)
    }
  }

  const wrapOnSubmitSuccess = (isNewDescriptor: boolean, response: AxiosResponse) => {
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
    <Paper sx={{ bgcolor: 'background.paper', p: 3, mt: 2 }}>
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
              sx={{ mt: 0 }}
              name="version"
              label="Numero della versione (richiesto)"
              infoLabel="Assegnata automaticamente dal sistema e non modificabile"
              disabled={true}
              value={values.version}
              error={errors.version}
            />

            <StyledInputControlledText
              name="description"
              label="Descrizione della versione (richiesto)"
              value={values.description}
              error={errors.description}
              onChange={handleChange}
              multiline={true}
              focusOnMount={true}
            />

            <StyledInputControlledText
              name="audience"
              label="Audience (richiesto)"
              infoLabel="All’nterno del token JWT che il fruitore ti invierà rappresenterà l’audience (aud), l'id con il quale il fruitore dichiara il servizio richiesto"
              value={values.audience}
              error={errors.audience}
              onChange={handleChange}
            />

            <StyledInputControlledText
              name="voucherLifespan"
              label="Durata di validità del voucher (in minuti - richiesto)"
              infoLabel="Valore massimo: 1440 minuti (24 ore)"
              type="number"
              inputProps={{ min: '1', max: '1440' }}
              value={values.voucherLifespan}
              error={errors.voucherLifespan}
              onChange={handleChange}
            />

            <StyledInputControlledText
              name="dailyCallsPerConsumer"
              label="Soglia chiamate API/giorno per fruitore (richiesto)"
              infoLabel="Il fruitore dovrà dichiarare una stima delle chiamate che effettuerà per ogni finalità. Se la somma delle chiamate dichiarate dal fruitore sarà sopra la soglia da te impostata, potrai approvare manualmente l'accesso delle nuove finalità alla fruizione del tuo E-Service"
              type="number"
              value={values.dailyCallsPerConsumer}
              error={errors.dailyCallsPerConsumer}
              onChange={handleChange}
              inputProps={{ min: '1' }}
            />

            <StyledInputControlledText
              name="dailyCallsTotal"
              label="Soglia chiamate API/giorno totali (richiesto)"
              infoLabel="Il numero totale di chiamate al giorno permesse sommando quelle di tutti i fruitori. Se la somma sarà superiore alla soglia da te impostata, potrai approvare manualmente l'accesso delle nuove finalità alla fruizione del tuo E-Service"
              type="number"
              value={values.dailyCallsTotal}
              error={errors.dailyCallsTotal}
              onChange={handleChange}
              inputProps={{ min: '1' }}
              sx={{ mb: 3 }}
            />

            <StepActions
              back={{ label: 'Indietro', type: 'button', onClick: back }}
              forward={{ label: 'Salva bozza e prosegui', type: 'submit' }}
            />
          </StyledForm>
        )}
      </Formik>
    </Paper>
  )
}
