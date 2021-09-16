import { AxiosResponse } from 'axios'
import { isEmpty } from 'lodash'
import React, { useContext, useEffect, useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import {
  EServiceCreateDataKeysType,
  EServiceCreateDataType,
  FrontendAttributes,
  StepperStepComponentProps,
} from '../../types'
import {
  remapBackendAttributesToFrontend,
  remapFrontendAttributesToBackend,
} from '../lib/attributes'
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
  data,
  readOnlyVersion,
  updateWriteData,
  writeData,
}: StepperStepComponentProps & UserFeedbackHOCProps & EServiceWriteStepperProps) {
  const { party } = useContext(PartyContext)

  // All the data except for the attributes
  const [eserviceData, setEserviceData] = useState<Partial<EServiceCreateDataType>>({
    technology: 'REST',
    pop: false,
    voucherLifespan: 300, // TEMP PIN-385 (obsolete)
    audience: [], // TEMP PIN-385 (obsolete, remove this field from the data when PIN-385 is complete)
  })
  // Attributes are separated from the rest of the data
  // just because it is easier to handle them this way
  const [attributes, setAttributes] = useState<FrontendAttributes>({
    certified: [],
    verified: [],
    declared: [],
  })

  const isFalsy = (fieldType: FieldType, valueToTest: any) => {
    if (fieldType === 'text' && valueToTest === '') {
      return true
    }

    return false
  }

  const wrapSetEServiceData =
    (fieldName: EServiceCreateDataKeysType, fieldType: FieldType = 'text') =>
    (e: any) => {
      const { value, checked, id } = e.target
      const fieldValueMaybe = { text: value, checkbox: checked, radio: id, textArray: [value] }[
        fieldType
      ]

      // If the field contains a falsy value, set it explicitly to undefined
      // to avoid passing misleading data to the backend (e.g. a service name set to an empty string)
      const fieldValue = !isFalsy(fieldType, fieldValueMaybe) ? fieldValueMaybe : undefined

      setEserviceData({ ...eserviceData, [fieldName]: fieldValue })
    }

  const onSubmitSuccess = (eserviceCreateResponse: AxiosResponse) => {
    const { id: eserviceId, descriptors } = eserviceCreateResponse.data
    const { id: descriptorId } = descriptors[0]
    updateWriteData({ eserviceId, descriptorId })
    forward()
  }

  const submit = async (e: any) => {
    e.preventDefault()

    const dataToPost = {
      ...eserviceData,
      producerId: party!.partyId,
      attributes: remapFrontendAttributesToBackend(attributes),
    }

    // TEMP PIN-385 (missing the PUT request)
    await runActionWithCallback(
      {
        path: { endpoint: 'ESERVICE_CREATE' },
        config: { method: 'POST', data: dataToPost },
      },
      { callback: onSubmitSuccess, suppressToast: false }
    )
  }

  // Pre-fill the state (and thus the input fields) if there are data to do so
  useEffect(() => {
    if (!isEmpty(data)) {
      const { technology, name, description, attributes: backendAttributes } = data!
      setEserviceData({ technology, name, description })
      setAttributes(remapBackendAttributesToFrontend(backendAttributes))
    }
  }, [data])

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
            readOnly={readOnlyVersion}
          />

          <StyledInputTextArea
            id="description"
            label="Descrizione del servizio*"
            value={eserviceData.description || ''}
            onChange={wrapSetEServiceData('description')}
            readOnly={readOnlyVersion}
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
            readOnly={readOnlyVersion}
          />

          <StyledInputCheckbox
            groupLabel="POP"
            id="pop"
            label="Proof of Possession*"
            checked={!!eserviceData.pop}
            onChange={wrapSetEServiceData('pop', 'checkbox')}
            readOnly={readOnlyVersion}
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
