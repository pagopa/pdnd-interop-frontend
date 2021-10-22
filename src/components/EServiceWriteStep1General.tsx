import { AxiosResponse } from 'axios'
import { isEmpty } from 'lodash'
import React, { useContext, useEffect, useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { Link, useHistory } from 'react-router-dom'
import {
  ApiEndpointKey,
  EServiceCreateDataType,
  EServiceNoDescriptorId,
  FrontendAttributes,
  StepperStepComponentProps,
} from '../../types'
import { useFeedback } from '../hooks/useFeedback'
import {
  remapBackendAttributesToFrontend,
  remapFrontendAttributesToBackend,
} from '../lib/attributes'
import { ROUTES } from '../lib/constants'
import { PartyContext } from '../lib/context'
import { buildDynamicPath } from '../lib/url-utils'
import { EServiceWriteProps } from '../views/EServiceWrite'
import { EServiceAttributeSection } from './EServiceAttributeSection'
import { StyledInputCheckbox } from './Shared/StyledInputCheckbox'
import { StyledInputRadioGroup } from './Shared/StyledInputRadioGroup'
import { StyledInputText } from './Shared/StyledInputText'
import { StyledInputTextArea } from './Shared/StyledInputTextArea'
import { StyledIntro } from './Shared/StyledIntro'
import { WhiteBackground } from './WhiteBackground'

type FieldType = 'text' | 'radio' | 'checkbox'

export function EServiceWriteStep1General({
  forward,
  fetchedDataMaybe,
}: StepperStepComponentProps & EServiceWriteProps) {
  const { party } = useContext(PartyContext)
  const history = useHistory()
  const { runActionWithCallback } = useFeedback()

  // All the data except for the attributes
  const [eserviceData, setEserviceData] = useState<Partial<EServiceCreateDataType>>({
    technology: 'REST',
    pop: false,
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
    if (!isEmpty(fetchedDataMaybe)) {
      const { technology, name, description, attributes: backendAttributes } = fetchedDataMaybe!
      setEserviceData({ technology, name, description })
      setAttributes(remapBackendAttributesToFrontend(backendAttributes))
    }
  }, [fetchedDataMaybe])

  // Check for empty strings in input text field
  const isEmptyTextField = (fieldType: FieldType, valueToTest: any) =>
    fieldType === 'text' && valueToTest === ''

  const wrapSetEServiceData =
    (fieldName: keyof EServiceCreateDataType, fieldType: FieldType = 'text') =>
    (e: any) => {
      const { value, checked, id } = e.target
      const fieldValueMaybe = { text: value, checkbox: checked, radio: id }[fieldType]

      // Check for false positives (e.g. empty strings in input types), and set them explicitly to undefined
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
    let endpointParams = {}
    const isNewService = isEmpty(fetchedDataMaybe)
    if (!isNewService) {
      endpoint = 'ESERVICE_UPDATE'
      endpointParams = { eserviceId: fetchedDataMaybe!.id }
    }

    await runActionWithCallback(
      { path: { endpoint, endpointParams }, config: { data: dataToPost } },
      { callback: wrapOnSubmitSuccess(isNewService), suppressToast: false }
    )
  }

  const wrapOnSubmitSuccess = (isNewService: boolean) => (response: AxiosResponse) => {
    const eserviceId = response.data.id

    if (isNewService) {
      const tempDescriptorId: EServiceNoDescriptorId = 'prima-bozza'

      // Replace the create route with the acutal eserviceId, now that we have it.
      // WARNING: this will cause a re-render that will fetch fresh data
      // at the EServiceGate component level
      history.replace(
        buildDynamicPath(ROUTES.PROVIDE.SUBROUTES!.ESERVICE_EDIT.PATH, {
          eserviceId,
          descriptorId: tempDescriptorId,
        }),
        { stepIndexDestination: 1 }
      )
    } else {
      // Go to next step
      forward()
    }
  }

  const isNewService = isEmpty(fetchedDataMaybe)
  const hasVersion = !isEmpty(fetchedDataMaybe?.activeDescriptor)
  const isEditable =
    // case 1: new service
    isNewService ||
    // case 2: already existing service but no versions created
    (!isNewService && !hasVersion) ||
    // case 3: already existing service and version, but version is 1 and still a draft
    (!isNewService &&
      hasVersion &&
      fetchedDataMaybe!.activeDescriptor!.version === '1' &&
      fetchedDataMaybe!.activeDescriptor!.status === 'draft')

  return (
    <React.Fragment>
      <WhiteBackground>
        <StyledIntro>
          {{
            title: 'Crea e-service: informazioni generali',
            description:
              "Attenzione: una volta pubblicata la prima versione dell'e-service, le informazioni contenute in questa sezione non saranno più modificabili",
          }}
        </StyledIntro>
      </WhiteBackground>
      <Form onSubmit={submit}>
        <WhiteBackground>
          <StyledIntro priority={2}>{{ title: 'Caratterizzazione e-service' }}</StyledIntro>

          <StyledInputText
            id="name"
            label="Nome dell'e-service*"
            value={eserviceData.name || ''}
            onChange={wrapSetEServiceData('name')}
            readOnly={!isEditable}
          />

          <StyledInputTextArea
            id="description"
            label="Descrizione dell'e-service*"
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

          <div className="mt-5 d-flex">
            <Button className="me-3" type="submit" variant="primary" disabled={!eserviceData.name}>
              salva bozza e prosegui
            </Button>
            <Button
              variant="outline-primary"
              as={Link}
              to={ROUTES.PROVIDE.SUBROUTES!.ESERVICE_LIST.PATH}
            >
              torna agli e-service
            </Button>
          </div>
        </WhiteBackground>
      </Form>
    </React.Fragment>
  )
}
