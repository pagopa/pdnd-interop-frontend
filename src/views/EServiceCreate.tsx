import React, { useState } from 'react'
import { WhiteBackground } from '../components/WhiteBackground'
import { StyledInputText } from '../components/StyledInputText'
import { StyledInputCheckbox } from '../components/StyledInputCheckbox'
import { StyledInputRadioGroup } from '../components/StyledInputRadioGroup'
import { StyledInputFile } from '../components/StyledInputFile'

type FormDataType = {
  name?: string
  version?: number
  id?: string
  technology: 'REST' | 'SOAP'
  pop: boolean
}
type FormDataTypeKeys = 'name' | 'version' | 'id' | 'technology' | 'pop'

export function EServiceCreate() {
  const [data, setData] = useState<FormDataType>({ technology: 'REST', pop: false })

  const buildSetInfo =
    (fieldName: FormDataTypeKeys, fieldType = 'text') =>
    (e: any) => {
      const value = {
        text: e.target.value,
        checkbox: e.target.checked,
        radio: e.target.name,
      }[fieldType]
      setData({ ...data, [fieldName]: value })
    }

  const todoLoadAccordo = () => {
    console.log('TODO: genera accordo di interoperabilità')
  }

  const loadInterface = () => {
    console.log('carica interfaccia open api')
  }

  return (
    <React.Fragment>
      <WhiteBackground>
        <h2>Crea nuovo e-service</h2>
        <p>
          Compila tutti i campi richiesti e salva in bozza o pubblica il tuo e-service. I campi
          contrassegnati da asterisco sono obbligatori.
        </p>
      </WhiteBackground>
      <WhiteBackground>
        <h2 className="mb-5">Informazioni generali*</h2>

        {[
          { id: 'name', label: 'Nome del servizio', placeholder: 'Il mio e-service' },
          { id: 'version', label: 'Versione del servizio', placeholder: '1', readOnly: true },
          { id: 'id', label: 'Id del servizio', placeholder: 'Lorem ipsum id del servizio' },
        ].map(({ id, label, placeholder, readOnly }, i) => (
          <StyledInputText
            key={i}
            id={id}
            label={label}
            placeholder={placeholder}
            readOnly={readOnly}
            value={data[id as FormDataTypeKeys] as any}
            onChange={buildSetInfo(id as FormDataTypeKeys)}
          />
        ))}

        <StyledInputRadioGroup
          id="technology"
          groupLabel="Tecnologia"
          options={[
            { label: 'REST', value: 'REST' },
            { label: 'SOAP', value: 'SOAP' },
          ]}
          currentValue={data.technology}
          onChange={buildSetInfo('technology', 'radio')}
        />

        <StyledInputCheckbox
          groupLabel="POP"
          id="pop"
          label="Proof of Possession"
          checked={data.pop}
          onChange={buildSetInfo('pop', 'checkbox')}
        />
      </WhiteBackground>
      <WhiteBackground>
        <h2>Accordo di interoperabilità*</h2>

        <StyledInputFile onChange={todoLoadAccordo} id="accordo" />
      </WhiteBackground>

      <WhiteBackground>
        <h2>Interfaccia*</h2>
        <p>Carica il file OpenAPI/WSDL che descrive l'API</p>

        <StyledInputFile onChange={loadInterface} id="accordo" />
      </WhiteBackground>
    </React.Fragment>
  )
}
