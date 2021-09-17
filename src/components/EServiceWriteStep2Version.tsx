import { AxiosResponse, Method } from 'axios'
import { isEmpty } from 'lodash'
import React, { useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import { ApiEndpointKey, StepperStepComponentProps } from '../../types'
import { ROUTES } from '../lib/constants'
import { EServiceWriteStepProps } from '../views/EServiceWrite'
import { StyledInputText } from './StyledInputText'
import { StyledInputTextArea } from './StyledInputTextArea'
import { StyledIntro } from './StyledIntro'
import { WhiteBackground } from './WhiteBackground'
import { UserFeedbackHOCProps, withUserFeedback } from './withUserFeedback'

type FieldType = 'text' | 'textArray'

type VersionData = {
  audience: string[]
  version: string
  voucherLifespan: number
  description: string
}

function EServiceWriteStep2VersionComponent({
  runActionWithCallback,
  forward,
  back,
  fetchedData,
}: StepperStepComponentProps & UserFeedbackHOCProps & EServiceWriteStepProps) {
  const [versionData, setVersionData] = useState<Partial<VersionData>>({})
  const history = useHistory()

  // Determine the current version of the service
  const getVersion = () => {
    return !isEmpty(fetchedData.activeDescriptor) ? fetchedData.activeDescriptor!.version : '1'
  }

  // Check for empty strings in input text field
  const isEmptyTextField = (fieldType: FieldType, valueToTest: any) => {
    const failConditions = { text: valueToTest === '', textArray: valueToTest[0] === '' }
    return failConditions[fieldType]
  }

  const wrapSetVersionData =
    (fieldName: keyof VersionData, fieldType: FieldType = 'text') =>
    (e: any) => {
      const { value } = e.target
      const fieldValueMaybe = { text: value, textArray: [value] }[fieldType]

      // Check for false positives (e.g. empty strings in input types), and set them explicitly to undefined
      const fieldValue = !isEmptyTextField(fieldType, fieldValueMaybe) ? fieldValueMaybe : undefined

      setVersionData({ ...versionData, [fieldName]: fieldValue })
    }

  const submit = async (e: any) => {
    e.preventDefault()

    // Format the data like the backend wants it
    const dataToPost = { ...versionData, version: getVersion() }

    // Define which endpoint to call
    let endpoint: ApiEndpointKey = 'ESERVICE_VERSION_CREATE'
    let method: Method = 'POST'
    const endpointParams: any = { eserviceId: fetchedData.id }
    const isNewDescriptor = isEmpty(fetchedData.activeDescriptor)
    if (!isNewDescriptor) {
      // TEMP PIN-385 (missing the PUT request)
      // endpoint = 'ESERVICE_VERSION_UPDATE'
      // method = 'PUT'
      endpointParams.descriptorId = fetchedData.activeDescriptor!.id
    }

    await runActionWithCallback(
      {
        path: { endpoint, endpointParams },
        config: { method, data: dataToPost },
      },
      { callback: wrapOnSubmitSuccess(isNewDescriptor), suppressToast: false }
    )
  }

  const wrapOnSubmitSuccess = (isNewDescriptor: boolean) => (response: AxiosResponse) => {
    if (isNewDescriptor) {
      // const descriptorId = response.data.id
      // TEMP, just for testing
      const descriptorId = fetchedData.descriptors[0].id

      // Replace the create route with the acutal descriptorId, now that we have it.
      // WARNING: this will cause a re-render that will fetch fresh data
      // at the EServiceGate component level
      history.replace(
        `${ROUTES.PROVIDE.SUBROUTES!.ESERVICE_LIST.PATH}/${fetchedData.id}/${descriptorId}`,
        { stepIndexDestination: 2 }
      )
    } else {
      // Go to next step
      forward()
    }
  }

  return (
    <React.Fragment>
      <WhiteBackground>
        <StyledIntro priority={2}>{{ title: 'Informazioni di versione' }}</StyledIntro>

        <Form onSubmit={submit}>
          <StyledInputText
            id="version"
            label="Numero della versione*"
            value={getVersion()}
            readOnly={true}
          />

          <StyledInputText
            id="audience"
            label="Identificativo del servizio*"
            value={
              versionData.audience && versionData.audience.length > 0 ? versionData.audience[0] : ''
            }
            onChange={wrapSetVersionData('audience', 'textArray')}
          />

          <StyledInputText
            type="number"
            id="voucherLifespan"
            label="Durata del voucher (in minuti)*"
            value={versionData.voucherLifespan || 0}
            onChange={wrapSetVersionData('voucherLifespan')}
          />

          <StyledInputTextArea
            id="description"
            label="Descrizione della versione*"
            value={versionData.description || ''}
            onChange={wrapSetVersionData('description')}
          />

          <div className="mt-5 d-flex">
            <Button className="me-3" variant="primary" type="submit">
              salva bozza e prosegui
            </Button>
            <Button variant="outline-primary" onClick={back}>
              indietro
            </Button>
          </div>
        </Form>
      </WhiteBackground>
    </React.Fragment>
  )
}

export const EServiceWriteStep2Version = withUserFeedback(EServiceWriteStep2VersionComponent)
