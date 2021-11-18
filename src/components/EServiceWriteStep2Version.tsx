import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useHistory } from 'react-router-dom'
import { AxiosResponse } from 'axios'
import isEmpty from 'lodash/isEmpty'
import { ApiEndpointKey, EServiceDescriptorRead, StepperStepComponentProps } from '../../types'
import { buildDynamicPath } from '../lib/router-utils'
import { useFeedback } from '../hooks/useFeedback'
import { EServiceWriteStepProps } from '../views/EServiceWrite'
import { StyledForm } from './Shared/StyledForm'
import { StyledInputControlledText } from './Shared/StyledInputControlledText'
import { requiredValidationPattern } from '../lib/validation'
import { ROUTES } from '../config/routes'
import { EServiceWriteActions } from './Shared/EServiceWriteActions'

type VersionData = {
  audience: string
  version: string
  voucherLifespan: number
  description: string
}

export function EServiceWriteStep2Version({
  forward,
  back,
  fetchedData,
}: StepperStepComponentProps & EServiceWriteStepProps) {
  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm()

  const history = useHistory()
  const { runActionWithCallback } = useFeedback()

  // Pre-fill if there is already a draft of the service available
  useEffect(() => {
    if (!isEmpty(fetchedData.activeDescriptor)) {
      const activeDescriptor = fetchedData.activeDescriptor as EServiceDescriptorRead
      const { audience, version, voucherLifespan, description } = activeDescriptor
      setValue('version', version)
      if (Boolean(audience.length > 0)) {
        setValue('audience', audience[0])
      }
      setValue('voucherLifespan', voucherLifespan)
      setValue('description', description)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Determine the current version of the service
  const getVersion = () => {
    if (!isEmpty(fetchedData.activeDescriptor)) {
      const activeDescriptor = fetchedData.activeDescriptor as EServiceDescriptorRead
      return activeDescriptor.version
    }

    return '1'
  }

  const onSubmit = async (data: Partial<VersionData>) => {
    // Format the data like the backend wants it
    const dataToPost: any = { ...data }
    if (data.audience) {
      dataToPost.audience = [data.audience]
    }
    if (data.voucherLifespan) {
      dataToPost.voucherLifespan = +data.voucherLifespan
    }

    // Define which endpoint to call
    let endpoint: ApiEndpointKey = 'ESERVICE_VERSION_CREATE'
    const endpointParams: any = { eserviceId: fetchedData.id }
    const isNewDescriptor = isEmpty(fetchedData.activeDescriptor)
    if (!isNewDescriptor) {
      const activeDescriptor = fetchedData.activeDescriptor as EServiceDescriptorRead
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
          eserviceId: fetchedData.id,
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

      <EServiceWriteActions
        back={{ label: 'Indietro', onClick: back }}
        forward={{ label: 'Salva bozza e prosegui' }}
      />
    </StyledForm>
  )
}
