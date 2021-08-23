import React, { useState } from 'react'
import { WhiteBackground } from '../components/WhiteBackground'
import { EServiceDocumentSection } from '../components/EServiceDocumentSection'
import { EServiceDataType, EServiceDataTypeKeys, EServiceDocumentType } from '../../types'
import { EServiceAgreementSection } from '../components/EServiceAgreementSection'
import { EServiceGeneralInfoSection } from '../components/EServiceGeneralInfoSection'

/*
{
  "name": "pariatur exercita",
  "producerId": "ee503ded-c7eb-453d-8741-0f92ecaf08c9",
  "description": "aliqua ex est dolore",
  "audience": [ "pippo" ],
  "technology": "REST",
  "voucherLifespan": 41713585,
  "attributes": {
    "certified": [
      {"group": ["881db7e1-7851-481f-84ff-287ee7ff00f0", "b030e657-75d4-4125-8ad2-4faf24c7f831"]}
    ],
    "declared": [],
    "verified": [
      {"simple": "068a29db-33fa-4713-89ef-b38218907b09"},
      {"simple": "f436a203-fa03-43c6-a532-2617d098340c"}
      ]
  }
]
*/

// These fields are static for now, and they will not be handled in the PoC
const staticFields = {
  pop: false,
  audience: [],
  voucherLifespan: 41713585,
  description: '',
  version: 1,
}

export function EServiceCreate() {
  // General information section
  const [eserviceData, setEserviceData] = useState<EServiceDataType>({
    technology: 'REST',
    ...staticFields,
  })
  // Documents section (covers documentation & interface)
  const [interfaceDocument, setInterfaceDocument] = useState<EServiceDocumentType | undefined>()
  const [documents, setDocuments] = useState<EServiceDocumentType[]>([])

  const buildSetEServiceData =
    (fieldName: EServiceDataTypeKeys, fieldType = 'text') =>
    (e: any) => {
      const value = {
        text: e.target.value,
        checkbox: e.target.checked,
        radio: e.target.name,
      }[fieldType]
      setEserviceData({ ...eserviceData, [fieldName]: value })
    }

  const todoLoadAccordo = () => {
    console.log('TODO: genera accordo di interoperabilità')
  }

  const updateDocuments = (e: any) => {
    setDocuments([...documents, { kind: 'document', description: '', file: e.target.files[0] }])
  }

  const buildDeleteDocuments = (name: string) => (_: any) => {
    setDocuments([...documents.filter((d) => d.file.name !== name)])
  }

  const updateInterface = (e: any) => {
    setInterfaceDocument({ kind: 'interface', description: '', file: e.target.files[0] })
  }

  const deleteInterface = (_: any) => {
    setInterfaceDocument(undefined)
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

      <EServiceGeneralInfoSection
        eserviceData={eserviceData}
        setEServiceData={buildSetEServiceData}
      />
      <EServiceAgreementSection todoLoadAccordo={todoLoadAccordo} />
      {/* I know it's verbose, but keeping interface and documents separated makes it easier to manage for now */}
      <EServiceDocumentSection
        interfaceDocument={interfaceDocument}
        setInterface={updateInterface}
        deleteInterface={deleteInterface}
        documents={documents}
        setDocuments={updateDocuments}
        deleteDocuments={buildDeleteDocuments}
      />
    </React.Fragment>
  )
}
