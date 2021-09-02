import React, { useContext, useEffect, useState } from 'react'
import { Button } from 'react-bootstrap'
import { WhiteBackground } from '../components/WhiteBackground'
import { EServiceDocumentSection } from '../components/EServiceDocumentSection'
import {
  Attributes,
  EServiceDataType,
  EServiceDataTypeKeys,
  EServiceDocumentType,
  ToastContent,
} from '../../types'
import { EServiceAgreementSection } from '../components/EServiceAgreementSection'
import { EServiceGeneralInfoSection } from '../components/EServiceGeneralInfoSection'
import { EServiceAttributeSection } from '../components/EServiceAttributeSection'
import { StyledIntro } from '../components/StyledIntro'
import { testCreateNewServiceStaticFields } from '../lib/mock-static-data'
import { fetchAllWithLogs, fetchWithLogs } from '../lib/api-utils'
import { PartyContext } from '../lib/context'
import { formatAttributes } from '../lib/attributes'
import { StyledToast } from '../components/StyledToast'
import isEmpty from 'lodash/isEmpty'
import { ConfirmationDialogOverlay } from '../components/ConfirmationDialogOverlay'
import { showTempAlert } from '../lib/wip-utils'
import { LoadingOverlay } from '../components/LoadingOverlay'
import { Link } from 'react-router-dom'
import { ROUTES } from '../lib/constants'

type EServiceWriteProps = {
  data: any
}

export function EServiceWrite({ data }: EServiceWriteProps) {
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<ToastContent>()
  const [modal, setModal] = useState<any>()
  const { party } = useContext(PartyContext)
  // General information section
  const [eserviceData, setEserviceData] = useState<EServiceDataType>({
    technology: 'REST',
    audience: [],
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
    setDocuments([...documents, { kind: 'document', description: '', doc: e.target.files[0] }])
  }

  const buildDeleteDocuments = (name: string) => (_: any) => {
    setDocuments([...documents.filter((d) => d.doc.name !== name)])
  }

  const updateInterface = (e: any) => {
    setInterfaceDocument({ kind: 'interface', description: '', doc: e.target.files[0] })
  }

  const deleteInterface = (_: any) => {
    setInterfaceDocument(undefined)
  }

  const closeModal = () => {
    setModal(undefined)
  }

  const closeToast = () => {
    setToast(undefined)
  }

  const showToast = (title = 'Operazione conclusa') => {
    setToast({
      title,
      description: (
        <>
          Operazione conclusa con successo.{' '}
          <Link to={ROUTES.PROVIDE.SUBROUTES!.ESERVICE_LIST.PATH} className="link-default">
            Torna agli e-service
          </Link>
        </>
      ),
      onClose: closeToast,
    })
  }

  const createEservice = async () => {
    // eService also has pop and version that are currently unused
    const eserviceCreateData = {
      name: eserviceData.name,
      description: eserviceData.description,
      audience: eserviceData.audience,
      technology: eserviceData.technology,
      voucherLifespan: eserviceData.voucherLifespan,
      producerId: party!.partyId,
      attributes: formatAttributes(attributes),
      explicitAttributesVerification: true,
    }

    const createResp = await fetchWithLogs(
      { endpoint: 'ESERVICE_CREATE' },
      { method: 'POST', data: eserviceCreateData }
    )

    const { descriptors, id: eserviceId } = createResp.data
    return { descriptors, eserviceId }
  }

  const uploadDocuments = async (eserviceId: string, descriptorId: string) => {
    return await fetchAllWithLogs(
      [...documents, interfaceDocument]
        // For now filter, but they should all be required
        .filter((d) => !isEmpty(d))
        .map((data) => {
          const { kind, description, doc } = data as EServiceDocumentType
          // Append the file as form data
          const formData = new FormData()
          formData.append('kind', kind)
          formData.append('description', description!)
          formData.append('doc', doc)

          return {
            path: {
              endpoint: 'ESERVICE_POST_DESCRIPTOR_DOCUMENTS',
              endpointParams: { eserviceId, descriptorId },
            },
            config: {
              method: 'POST',
              headers: { 'Content-Type': 'multipart/form-data' },
              data: formData,
            },
          }
        })
    )
  }

  const createEserviceAndUploadDocuments = async () => {
    const { descriptors, eserviceId } = await createEservice()
    // For now there is only one. This will be refactored after the PoC
    const descriptorId = descriptors[0].id
    await uploadDocuments(eserviceId, descriptorId)
    return { eserviceId, descriptorId }
  }

  // This method contains a waterfall of two calls
  // First, the eservice is created
  // Then, it is attached its interface and documents
  const saveDraft = async () => {
    setLoading(true)
    await createEserviceAndUploadDocuments()
    setLoading(false)
    closeModal()
    showToast()
  }

  const publish = async () => {
    setLoading(true)
    const { eserviceId } = await createEserviceAndUploadDocuments()

    await fetchWithLogs(
      { endpoint: 'ESERVICE_VERSION_PUBLISH', endpointParams: { eserviceId } },
      { method: 'POST' }
    )

    setLoading(false)
    closeModal()
    showToast()
  }

  const buildWrapAction = (proceedCallback: VoidFunction) => async (_: any) => {
    setModal({ proceedCallback, close: closeModal })
  }

  const cancel = () => {
    showTempAlert('Cancella bozza')
    closeModal()
    showToast()
  }

  useEffect(() => {
    if (!isEmpty(data)) {
      const _eserviceData = {
        name: data.name,
        description: data.description,
        audience: data.audience,
        technology: data.technology,
        voucherLifespan: data.voucherLifespan,
        producerId: data.producerId,
        attributes: data.attributes,
        explicitAttributesVerification: data.explicitAttributesVerification,
      }

      setEserviceData({ ...eserviceData, ..._eserviceData })

      const _interfaceDocument = data.descriptors[0].docs.find(
        (d: EServiceDocumentType) => d.kind === 'interface'
      )
      // const _documents = data.descriptors[0].docs.filter(
      //   (d: EServiceDocumentType) => d.kind !== 'interface'
      // )

      if (!isEmpty(_interfaceDocument)) {
        setInterfaceDocument(_interfaceDocument)
      }
      // setDocuments(_documents)
      // setAttributes(unformatAttributes(data.attributes))

      // console.log(data)
      // console.log({ _eserviceData, _interfaceDocument, _documents })
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

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
          <Button className="me-3" variant="primary" onClick={buildWrapAction(saveDraft)}>
            salva in bozza
          </Button>
          <Button className="me-3" variant="primary" onClick={buildWrapAction(publish)}>
            pubblica adesso
          </Button>
          <Button
            className="mockFeature"
            variant="outline-primary"
            onClick={buildWrapAction(cancel)}
          >
            cancella
          </Button>
        </div>
      </WhiteBackground>

      {modal && <ConfirmationDialogOverlay {...modal} />}
      {toast && !isEmpty(toast) && <StyledToast {...toast} />}
      {loading && <LoadingOverlay loadingText="Stiamo effettuando l'operazione richiesta" />}
    </React.Fragment>
  )
}
