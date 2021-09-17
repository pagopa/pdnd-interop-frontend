import React from 'react'
import { EServiceCreateDataType, EServiceCreateTextFieldDataType } from '../../types'
import { StyledInputCheckbox } from './StyledInputCheckbox'
import { StyledInputRadioGroup } from './StyledInputRadioGroup'
import { StyledInputText } from './StyledInputText'
import { StyledInputTextArea } from './StyledInputTextArea'
import { StyledIntro } from './StyledIntro'
import { WhiteBackground } from './WhiteBackground'

type EServiceGeneralInfoSectionProps = {
  eserviceData: EServiceCreateDataType
  setEServiceData: (fieldName: keyof EServiceCreateDataType, fieldType?: string) => (e: any) => void
  version: string
}

type Field = {
  id: keyof EServiceCreateTextFieldDataType | 'version'
  label: string
  type?: 'text' | 'textArray'
  readOnly?: boolean
}

export function EServiceGeneralInfoSection({
  eserviceData,
  setEServiceData,
  version,
}: EServiceGeneralInfoSectionProps) {
  const textFields: Field[] = [
    { id: 'name', label: 'Nome del servizio', type: 'text' },
    { id: 'version', label: 'Versione', readOnly: true, type: 'text' },
    { id: 'audience', label: 'Audience del servizio', type: 'textArray' },
  ]

  return (
    <WhiteBackground>
      <StyledIntro>{{ title: 'Informazioni generali*' }}</StyledIntro>

      {textFields.map(({ id, label, readOnly, type }, i) => {
        // TEMP REFACTOR
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
            readOnly={readOnly}
            value={value}
            onChange={setEServiceData(id as keyof EServiceCreateDataType, type)}
          />
        )
      })}

      <StyledInputTextArea
        id="description"
        label="Descrizione del servizio"
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
