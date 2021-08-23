import React from 'react'
import { EServiceDataTypeKeys } from '../../types'
import { StyledInputCheckbox } from './StyledInputCheckbox'
import { StyledInputRadioGroup } from './StyledInputRadioGroup'
import { StyledInputText } from './StyledInputText'
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
      <h2 className="mb-5">Informazioni generali*</h2>

      {[
        { id: 'name', label: 'Nome del servizio', placeholder: 'Il mio e-service' },
        { id: 'version', label: 'Versione del servizio', placeholder: '1', readOnly: true },
        // { id: 'serviceId', label: 'Id del servizio', placeholder: 'Lorem ipsum id del servizio' },
      ].map(({ id, label, placeholder, readOnly }, i) => (
        <StyledInputText
          key={i}
          id={id}
          label={label}
          placeholder={placeholder}
          readOnly={readOnly}
          value={(eserviceData[id as EServiceDataTypeKeys] as any) || ''}
          onChange={setEServiceData(id as EServiceDataTypeKeys)}
        />
      ))}

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
