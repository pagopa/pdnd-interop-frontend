import React from 'react'
import {
  EServiceCreateDataKeysType,
  EServiceCreateDataType,
  EServiceCreateTextFieldDataType,
} from '../../types'
import { StyledInputCheckbox } from './StyledInputCheckbox'
import { StyledInputRadioGroup } from './StyledInputRadioGroup'
import { StyledInputText } from './StyledInputText'
import { StyledInputTextArea } from './StyledInputTextArea'
import { StyledIntro } from './StyledIntro'
import { WhiteBackground } from './WhiteBackground'

type EServiceGeneralInfoSectionProps = {
  eserviceData: EServiceCreateDataType
  setEServiceData: (fieldName: EServiceCreateDataKeysType, fieldType?: string) => (e: any) => void
  version: string
}

type Field = {
  id: keyof EServiceCreateTextFieldDataType | 'version'
  label: string
  placeholder: string
  type?: 'text' | 'textArray'
  readOnly?: boolean
}

export function EServiceGeneralInfoSection({
  eserviceData,
  setEServiceData,
  version,
}: EServiceGeneralInfoSectionProps) {
  const textFields: Field[] = [
    { id: 'name', label: 'Nome del servizio', placeholder: 'Il mio e-service', type: 'text' },
    { id: 'version', label: 'Versione', placeholder: '1', readOnly: true, type: 'text' },
    { id: 'audience', label: 'Audience del servizio', placeholder: 'Test', type: 'textArray' },
  ]

  return (
    <WhiteBackground>
      <StyledIntro>{{ title: 'Informazioni generali*' }}</StyledIntro>

      {textFields.map(({ id, label, placeholder, readOnly, type }, i) => {
        // This is horrible, and needs refactoring
        let value = ''
        if (id === 'version') {
          value = version
        } else if (Array.isArray(eserviceData[id]) && eserviceData[id].length > 0) {
          value = eserviceData[id][0] // aka audience
        } else if (typeof eserviceData[id] !== 'undefined') {
          value = eserviceData[id] as string
        }

        return (
          <StyledInputText
            key={i}
            id={id}
            label={label}
            placeholder={placeholder}
            readOnly={readOnly}
            value={value}
            onChange={setEServiceData(id as EServiceCreateDataKeysType, type)}
          />
        )
      })}

      <StyledInputTextArea
        id="description"
        label="Descrizione del servizio"
        placeholder="Descrizione"
        value={eserviceData['description'] || ''}
        onChange={setEServiceData('description')}
      />

      <StyledInputRadioGroup
        id="technology"
        groupLabel="Tecnologia"
        options={[
          { label: 'REST', value: 'REST' },
          { label: 'SOAP', value: 'SOAP' },
        ]}
        currentValue={eserviceData.technology}
        onChange={setEServiceData('technology', 'radio')}
      />

      <StyledInputCheckbox
        groupLabel="POP"
        id="pop"
        label="Proof of Possession"
        checked={eserviceData.pop}
        onChange={setEServiceData('pop', 'checkbox')}
      />
    </WhiteBackground>
  )
}
