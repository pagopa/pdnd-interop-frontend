import React from 'react'
import { EServiceDataTypeKeysWrite } from '../../types'
import { StyledInputCheckbox } from './StyledInputCheckbox'
import { StyledInputRadioGroup } from './StyledInputRadioGroup'
import { StyledInputText } from './StyledInputText'
import { StyledInputTextArea } from './StyledInputTextArea'
import { StyledIntro } from './StyledIntro'
import { WhiteBackground } from './WhiteBackground'

type EServiceGeneralInfoSectionProps = {
  eserviceData: any
  setEServiceData: any
}

export function EServiceGeneralInfoSection({
  eserviceData,
  setEServiceData,
}: EServiceGeneralInfoSectionProps) {
  return (
    <WhiteBackground>
      <StyledIntro>{{ title: 'Informazioni generali*' }}</StyledIntro>

      {[
        { id: 'name', label: 'Nome del servizio', placeholder: 'Il mio e-service', type: 'text' },
        {
          id: 'version',
          label: 'Versione del servizio',
          placeholder: '1',
          readOnly: true,
          type: 'text',
        },
        {
          id: 'audience',
          label: 'Audience del servizio',
          placeholder: 'Lorem ipsum audience del servizio',
          type: 'textArray',
        },
      ].map(({ id, label, placeholder, readOnly, type }, i) => {
        return (
          <StyledInputText
            key={i}
            id={id}
            label={label}
            placeholder={placeholder}
            readOnly={readOnly}
            value={(eserviceData[id as EServiceDataTypeKeysWrite] as any) || ''}
            onChange={setEServiceData(id as EServiceDataTypeKeysWrite, type)}
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
