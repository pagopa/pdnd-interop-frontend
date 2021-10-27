import { AxiosResponse } from 'axios'
import { isEmpty } from 'lodash'
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { ApiEndpointKey, StepperStepComponentProps } from '../../types'
import { useFeedback } from '../hooks/useFeedback'
import { ROUTES } from '../lib/constants'
import { buildDynamicPath } from '../lib/url-utils'
import { EServiceWriteStepProps } from '../views/EServiceWrite'
import { StyledButton } from './Shared/StyledButton'
import { StyledForm } from './Shared/StyledForm'
import { StyledInputText } from './Shared/StyledInputText'
import { StyledInputTextArea } from './Shared/StyledInputTextArea'
import { StyledIntro } from './Shared/StyledIntro'

type FieldType = 'text' | 'textArray' | 'number'

type VersionData = {
  audience: string[]
  version: string
  voucherLifespan: number
  description: string
}

export function EServiceWriteStep2Version({
  forward,
  back,
  fetchedData,
}: StepperStepComponentProps & EServiceWriteStepProps) {
  const [versionData, setVersionData] = useState<Partial<VersionData>>({})
  const history = useHistory()
  const { runActionWithCallback } = useFeedback()

  // Pre-fill if there is already a draft of the service available
  useEffect(() => {
    if (!isEmpty(fetchedData.activeDescriptor)) {
      const { audience, version, voucherLifespan, description } = fetchedData.activeDescriptor!
      setVersionData({ audience, version, voucherLifespan, description })
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Determine the current version of the service
  const getVersion = () => {
    return !isEmpty(fetchedData.activeDescriptor) ? fetchedData.activeDescriptor!.version : '1'
  }

  // Check for empty strings in input text field
  const isEmptyTextField = (fieldType: FieldType, valueToTest: any) => {
    const failConditions = {
      text: valueToTest === '',
      textArray: valueToTest[0] === '',
      number: false,
    }
    return failConditions[fieldType]
  }

  const wrapSetVersionData =
    (fieldName: keyof VersionData, fieldType: FieldType = 'text') =>
    (e: any) => {
      const { value } = e.target
      const fieldValueMaybe = { text: value, textArray: [value], number: parseInt(value, 10) }[
        fieldType
      ]

      // Check for false positives (e.g. empty strings in input types), and set them explicitly to undefined
      const fieldValue = !isEmptyTextField(fieldType, fieldValueMaybe) ? fieldValueMaybe : undefined

      setVersionData({ ...versionData, [fieldName]: fieldValue })
    }

  const submit = async (e: any) => {
    e.preventDefault()

    // Format the data like the backend wants it
    const dataToPost = { ...versionData }

    // Define which endpoint to call
    let endpoint: ApiEndpointKey = 'ESERVICE_VERSION_CREATE'
    const endpointParams: any = { eserviceId: fetchedData.id }
    const isNewDescriptor = isEmpty(fetchedData.activeDescriptor)
    if (!isNewDescriptor) {
      endpoint = 'ESERVICE_VERSION_UPDATE'
      endpointParams.descriptorId = fetchedData.activeDescriptor!.id
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
        buildDynamicPath(ROUTES.PROVIDE.SUBROUTES!.ESERVICE_EDIT.PATH, {
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
    <React.Fragment>
      <StyledIntro variant="h1">
        {{ title: 'Crea e-service: informazioni di versione' }}
      </StyledIntro>

      <StyledForm onSubmit={submit}>
        <StyledInputText
          id="version"
          label="Numero della versione*"
          value={getVersion()}
          readOnly={true}
        />

        <StyledInputText
          id="audience"
          label="Identificativo dell'e-service*"
          tooltipLabel="L'id con il quale il fruitore dichiara il servizio richiesto. Questo identificativo deve essere unico tra i tuoi e-service"
          value={
            versionData.audience && versionData.audience.length > 0 ? versionData.audience[0] : ''
          }
          onChange={wrapSetVersionData('audience', 'textArray')}
        />

        <StyledInputText
          type="number"
          id="voucherLifespan"
          label="Durata di validità del voucher (in minuti)*"
          value={versionData.voucherLifespan || 0}
          onChange={wrapSetVersionData('voucherLifespan', 'number')}
          inputProps={{ min: '0', max: '5' }}
        />

        <StyledInputTextArea
          id="description"
          label="Descrizione della versione*"
          value={versionData.description || ''}
          onChange={wrapSetVersionData('description')}
        />

        <div className="mt-5 d-flex">
          <StyledButton className="me-3" variant="contained" type="submit">
            Salva bozza e prosegui
          </StyledButton>
          <StyledButton variant="outlined" onClick={back}>
            Indietro
          </StyledButton>
        </div>
      </StyledForm>
    </React.Fragment>
  )
}
