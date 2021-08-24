import React, { useState } from 'react'
import { Button } from 'react-bootstrap'
import { WhiteBackground } from '../components/WhiteBackground'
import { EServiceDocumentSection } from '../components/EServiceDocumentSection'
import {
  Attributes,
  EServiceDataType,
  EServiceDataTypeKeys,
  EServiceDocumentType,
} from '../../types'
import { EServiceAgreementSection } from '../components/EServiceAgreementSection'
import { EServiceGeneralInfoSection } from '../components/EServiceGeneralInfoSection'
import { EServiceAttributeSection } from '../components/EServiceAttributeSection'
import { StyledIntro } from '../components/StyledIntro'
import { testCreateNewServiceStaticFields } from '../lib/mock-static-data'

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

export function EServiceCreate() {
  // General information section
  const [eserviceData, setEserviceData] = useState<EServiceDataType>({
    technology: 'REST',
    ...testCreateNewServiceStaticFields,
  })
  // Documents section (covers documentation & interface)
  const [interfaceDocument, setInterfaceDocument] = useState<EServiceDocumentType | undefined>()
  const [documents, setDocuments] = useState<EServiceDocumentType[]>([])
  // Attributes
  const [attributes, setAttributes] = useState<Attributes>({
    certified: [],
    verified: [],
    declared: [],
  })

  const buildSetEServiceData =
    (fieldName: EServiceDataTypeKeys, fieldType = 'text') =>
    (e: any) => {
      const value = {
        text: e.target.value,
        checkbox: e.target.checked,
        radio: e.target.name,
        textArray: [e.target.value],
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

  const saveDraft = () => {
    console.log({
      eserviceData,
      interfaceDocument,
      documents,
      attributes,
    })
  }

  const publish = () => {}
  const cancel = () => {}

  return (
    <React.Fragment>
      <WhiteBackground>
        <StyledIntro>
          {{
            title: 'Crea nuovo e-service',
            description:
              'Compila tutti i campi richiesti e salva in bozza o pubblica il tuo e-service. I campi contrassegnati da asterisco sono obbligatori.',
          }}
        </StyledIntro>
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
      <EServiceAttributeSection attributes={attributes} setAttributes={setAttributes} />

      <WhiteBackground>
        <div className="d-flex">
          <Button className="me-3" variant="primary" onClick={saveDraft}>
            salva in bozza
          </Button>
          <Button className="me-3" variant="primary" onClick={publish}>
            pubblica adesso
          </Button>
          <Button variant="outline-primary" onClick={cancel}>
            cancella
          </Button>
        </div>
      </WhiteBackground>
    </React.Fragment>
  )
}
