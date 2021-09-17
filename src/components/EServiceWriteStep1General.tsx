import { AxiosResponse, Method } from 'axios'
import { isEmpty } from 'lodash'
import React, { useContext, useEffect, useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import {
  ApiEndpointKey,
  EServiceCreateDataType,
  EServiceNoDescriptorId,
  FrontendAttributes,
  StepperStepComponentProps,
} from '../../types'
import {
  remapBackendAttributesToFrontend,
  remapFrontendAttributesToBackend,
} from '../lib/attributes'
import { ROUTES } from '../lib/constants'
import { PartyContext } from '../lib/context'
import { EServiceWriteStepperProps } from '../views/EServiceWrite'
import { EServiceAttributeSection } from './EServiceAttributeSection'
import { StyledInputCheckbox } from './StyledInputCheckbox'
import { StyledInputRadioGroup } from './StyledInputRadioGroup'
import { StyledInputText } from './StyledInputText'
import { StyledInputTextArea } from './StyledInputTextArea'
import { StyledIntro } from './StyledIntro'
import { WhiteBackground } from './WhiteBackground'
import { UserFeedbackHOCProps, withUserFeedback } from './withUserFeedback'

type FieldType = 'text' | 'radio' | 'checkbox'

function EServiceWriteStep1GeneralComponent({
  runActionWithCallback,
  forward,
  fetchedData,
}: StepperStepComponentProps & UserFeedbackHOCProps & EServiceWriteStepperProps) {
  const { party } = useContext(PartyContext)
  const history = useHistory()

  // All the data except for the attributes
  const [eserviceData, setEserviceData] = useState<Partial<EServiceCreateDataType>>({
    technology: 'REST',
    pop: false,
    voucherLifespan: 300, // TEMP PIN-385 (obsolete)
    audience: [], // TEMP PIN-385 (obsolete, remove this field from the data when PIN-385 is complete)
  })
  // Attributes are separated from the rest of the data.
  // There is no logical reason, it is just easier to handle the operations this way
  const [attributes, setAttributes] = useState<FrontendAttributes>({
    certified: [],
    verified: [],
    declared: [],
  })

  // Pre-fill if there is already a draft of the service available
  useEffect(() => {
    if (!isEmpty(fetchedData)) {
      const { technology, name, description, attributes: backendAttributes } = fetchedData!
      setEserviceData({ technology, name, description })
      setAttributes(remapBackendAttributesToFrontend(backendAttributes))
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Check for empty strings in input text field
  const isEmptyTextField = (fieldType: FieldType, valueToTest: any) =>
    fieldType === 'text' && valueToTest === ''

  const wrapSetEServiceData =
    (fieldName: keyof EServiceCreateDataType, fieldType: FieldType = 'text') =>
    (e: any) => {
      const { value, checked, id } = e.target
      const fieldValueMaybe = { text: value, checkbox: checked, radio: id }[fieldType]

      // If the field contains a falsy value, like empty string, set it explicitly to undefined
      // This is to avoid passing misleading data to the backend
      // (e.g. a service name set to an empty string passes the "service name exixts" check)
      const fieldValue = !isEmptyTextField(fieldType, fieldValueMaybe) ? fieldValueMaybe : undefined

      setEserviceData({ ...eserviceData, [fieldName]: fieldValue })
    }

  const submit = async (e: any) => {
    e.preventDefault()

    // Format the data like the backend wants it
    const dataToPost = {
      ...eserviceData,
      producerId: party!.partyId,
      attributes: remapFrontendAttributesToBackend(attributes),
    }

    // Define which endpoint to call
    let endpoint: ApiEndpointKey = 'ESERVICE_CREATE'
    let method: Method = 'POST'
    const isNewService = isEmpty(fetchedData)
    if (isNewService) {
      // TEMP PIN-385 (missing the PUT request)
      // endpoint = 'ESERVICE_UPDATE'
      // method = 'PUT'
    }

    // Run the action, and
    await runActionWithCallback(
      { path: { endpoint }, config: { method, data: dataToPost } },
      { callback: wrapOnSubmitSuccess(isNewService), suppressToast: false }
    )
  }

  const wrapOnSubmitSuccess =
    (isNewService: boolean) => (eserviceCreateResponse: AxiosResponse) => {
      const eserviceId = eserviceCreateResponse.data.id

      if (isNewService) {
        const tempDescriptorId: EServiceNoDescriptorId = 'prima-bozza'

        // Replace the create route with the acutal id, now that we have it.
        // WARNING: this will cause a re-render that will fetch fresh data
        // at the EServiceGate component level
        history.replace(
          `${ROUTES.PROVIDE.SUBROUTES!.ESERVICE_LIST.PATH}/${eserviceId}/${tempDescriptorId}`,
          { stepIndexDestination: 1 }
        )
      } else {
        // Go to next step
        forward()
      }
    }

  const isNewService = isEmpty(fetchedData)
  const hasVersion = !isEmpty(fetchedData?.activeDescriptor)
  const isEditable =
    // case 1: new service
    isNewService ||
    // case 2: already existing service but no versions created
    (!isNewService && !hasVersion) ||
    // case 3: already existing service and version, but version is 1 and still a draft
    (!isNewService &&
      hasVersion &&
      fetchedData!.activeDescriptor!.version === '1' &&
      fetchedData!.activeDescriptor!.status === 'draft')

  return (
    <React.Fragment>
      <WhiteBackground>
        <StyledIntro>
          {{
            title: 'Informazioni generali',
            description:
              'Attenzione: una volta pubblicata la prima versione del servizio, le informazioni contenute in questa sezione non saranno più modificabili',
          }}
        </StyledIntro>
      </WhiteBackground>
      <Form onSubmit={submit}>
        <WhiteBackground>
          <StyledIntro priority={2}>{{ title: 'Caratterizzazione e-service' }}</StyledIntro>

          <StyledInputText
            id="name"
            label="Nome del servizio*"
            value={eserviceData.name || ''}
            onChange={wrapSetEServiceData('name')}
            readOnly={!isEditable}
          />

          <StyledInputTextArea
            id="description"
            label="Descrizione del servizio*"
            value={eserviceData.description || ''}
            onChange={wrapSetEServiceData('description')}
            readOnly={!isEditable}
            placeholder={undefined}
          />

          <StyledInputRadioGroup
            id="technology"
            groupLabel="Tecnologia*"
            options={[
              { label: 'REST', value: 'REST' },
              { label: 'SOAP', value: 'SOAP' },
            ]}
            currentValue={eserviceData.technology}
            onChange={wrapSetEServiceData('technology', 'radio')}
            readOnly={!isEditable}
          />

          <StyledInputCheckbox
            groupLabel="POP"
            id="pop"
            label="Proof of Possession*"
            checked={!!eserviceData.pop}
            onChange={wrapSetEServiceData('pop', 'checkbox')}
            readOnly={!isEditable}
          />
        </WhiteBackground>
        <WhiteBackground>
          <StyledIntro priority={2}>{{ title: 'Attributi' }}</StyledIntro>
          <EServiceAttributeSection attributes={attributes} setAttributes={setAttributes} />
        </WhiteBackground>
        <WhiteBackground>
          <Button type="submit" variant="primary" disabled={!eserviceData.name}>
            salva bozza e prosegui
          </Button>
        </WhiteBackground>
      </Form>
    </React.Fragment>
  )
}

export const EServiceWriteStep1General = withUserFeedback(EServiceWriteStep1GeneralComponent)
