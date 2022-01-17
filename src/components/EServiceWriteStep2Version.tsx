import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
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
import { StyledInputControlledText } from './Shared/StyledInputControlledText'
import { requiredValidationPattern } from '../lib/validation'
import { ROUTES } from '../config/routes'
import { EServiceWriteActions } from './Shared/EServiceWriteActions'
import { useEservice } from '../hooks/useEservice'

type VersionData = {
  audience: string
  version: string
  voucherLifespan: string
  description: string
}

type VersionDataWriteType = {
  audience: Array<string>
  // version: string
  voucherLifespan: number
  description: string
}

export function EServiceWriteStep2Version({ forward, back }: StepperStepComponentProps) {
  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm()

  const history = useHistory()
  const { runActionWithCallback } = useFeedback()
  const { data: fetchedData } = useEservice()

  // Pre-fill if there is already a draft of the service available
  useEffect(() => {
    if (fetchedData && !isEmpty(fetchedData.activeDescriptor)) {
      const activeDescriptor = (fetchedData as EServiceReadType)
        .activeDescriptor as EServiceDescriptorRead
      const { audience, version, voucherLifespan, description } = activeDescriptor
      setValue('version', version)
      if (Boolean(audience.length > 0)) {
        setValue('audience', audience[0])
      }
      setValue('voucherLifespan', voucherLifespan)
      setValue('description', description)
    }
  }, [fetchedData]) // eslint-disable-line react-hooks/exhaustive-deps

  // Determine the current version of the service
  const getVersion = () => {
    if (fetchedData && !isEmpty(fetchedData.activeDescriptor)) {
      const activeDescriptor = fetchedData.activeDescriptor as EServiceDescriptorRead
      return activeDescriptor.version
    }

    return '1'
  }

  const mapData = (data: Partial<VersionData>): VersionDataWriteType => {
    return {
      voucherLifespan: +(data.voucherLifespan as string) as number,
      audience: [data.audience as string],
      description: data.description as string,
    }
  }

  const onSubmit = async (data: Partial<VersionData>) => {
    // Format the data like the backend wants it
    const dataToPost = mapData(data)

    const sureFetchedData = fetchedData as EServiceReadType

    // Define which endpoint to call
    let endpoint: ApiEndpointKey = 'ESERVICE_VERSION_CREATE'
    const endpointParams: Record<string, string> = { eserviceId: sureFetchedData.id }
    const isNewDescriptor = isEmpty(sureFetchedData.activeDescriptor)
    if (!isNewDescriptor) {
      const activeDescriptor = sureFetchedData.activeDescriptor as EServiceDescriptorRead
      endpoint = 'ESERVICE_VERSION_UPDATE'
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
    <StyledForm onSubmit={handleSubmit(onSubmit)}>
      <StyledInputControlledText
        name="version"
        label="Numero della versione*"
        defaultValue={getVersion()}
        disabled={true}
        control={control}
        rules={{}}
        errors={errors}
      />

      <StyledInputControlledText
        name="audience"
        label="Identificativo dell'e-service*"
        infoLabel="L'id con il quale il fruitore dichiara il servizio richiesto. Questo identificativo deve essere unico tra i tuoi e-service"
        control={control}
        rules={{ required: requiredValidationPattern }}
        errors={errors}
        focusOnMount={true}
      />

      <StyledInputControlledText
        name="voucherLifespan"
        label="Durata di validità del voucher (in minuti)*"
        type="number"
        inputProps={{ min: '1', max: '5' }}
        defaultValue="1"
        control={control}
        rules={{ required: requiredValidationPattern }}
        errors={errors}
      />

      <StyledInputControlledText
        name="description"
        label="Descrizione della versione*"
        control={control}
        rules={{ required: requiredValidationPattern }}
        errors={errors}
        multiline={true}
      />

      <StyledInputControlledText
        name="load-estimate"
        label="Soglia di carico ammesso (richiesto)"
        infoLabel="Calcolata in numero di richieste al giorno sostenibili per richiesta di fruizione"
        type="number"
        defaultValue="20000"
        control={control}
        rules={{ required: requiredValidationPattern }}
        errors={errors}
      />

      <EServiceWriteActions
        back={{ label: 'Indietro', onClick: back }}
        forward={{ label: 'Salva bozza e prosegui' }}
      />
    </StyledForm>
  )
}
