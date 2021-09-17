import { AxiosResponse, Method } from 'axios'
import { isEmpty } from 'lodash'
import React, { useEffect, useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import { ApiEndpointKey, StepperStepComponentProps } from '../../types'
import { ROUTES } from '../lib/constants'
import { EServiceWriteStepperProps } from '../views/EServiceWrite'
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
}: StepperStepComponentProps & UserFeedbackHOCProps & EServiceWriteStepperProps) {
  const [versionData, setVersionData] = useState<Partial<VersionData>>({})
  const history = useHistory()

  const getVersion = () => {
    return !isEmpty(fetchedData) && !isEmpty(fetchedData!.activeDescriptor)
      ? fetchedData!.activeDescriptor!.version
      : '1'
  }

  const isEmptyTextField = (fieldType: FieldType, valueToTest: any) => {
    const failConditions = { text: valueToTest === '', textArray: valueToTest[0] === '' }
    return failConditions[fieldType]
  }

  const wrapSetVersionData =
    (fieldName: keyof VersionData, fieldType: FieldType = 'text') =>
    (e: any) => {
      const { value } = e.target
      const fieldValueMaybe = { text: value, textArray: [value] }[fieldType]

      const fieldValue = !isEmptyTextField(fieldType, fieldValueMaybe) ? fieldValueMaybe : undefined

      setVersionData({ ...versionData, [fieldName]: fieldValue })
    }

  useEffect(() => {
    console.log(versionData)
  }, [versionData])

  const submit = async (e: any) => {
    e.preventDefault()

    const dataToPost = { ...versionData, version: getVersion() }

    // Call POST
    let endpoint: ApiEndpointKey = 'ESERVICE_VERSION_CREATE'
    let method: Method = 'POST'
    const isNewDescriptor = !isEmpty(fetchedData) && !isEmpty(fetchedData!.activeDescriptor)
    if (isNewDescriptor) {
      // TEMP PIN-385 (missing the PUT request)
      // endpoint = 'ESERVICE_VERSION_UPDATE'
      // method = 'PUT'
    }

    // Run the action, and
    await runActionWithCallback(
      { path: { endpoint }, config: { method, data: dataToPost } },
      { callback: wrapOnSubmitSuccess(isNewDescriptor), suppressToast: false }
    )
  }

  const wrapOnSubmitSuccess =
    (isNewDescriptor: boolean) => (eserviceVersionCreateResponse: AxiosResponse) => {
      if (isNewDescriptor) {
        const descriptorId = eserviceVersionCreateResponse.data.id

        history.replace(
          `${ROUTES.PROVIDE.SUBROUTES!.ESERVICE_LIST.PATH}/${fetchedData!.id}/${descriptorId}`,
          { stepIndexDestination: 2 }
        )
      } else {
        // Go to the next step
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

          <div className="d-flex">
            <Button className="me-3" variant="primary" type="submit">
              salva bozza e prosegui
            </Button>
            <Button variant="primary-outline" onClick={back}>
              indietro
            </Button>
          </div>
        </Form>
      </WhiteBackground>
    </React.Fragment>
  )
}

export const EServiceWriteStep2Version = withUserFeedback(EServiceWriteStep2VersionComponent)
