import React, { useContext, useEffect, useState } from 'react'
import { Button } from 'react-bootstrap'
import { WhiteBackground } from '../components/WhiteBackground'
import { EServiceDocumentSection } from '../components/EServiceDocumentSection'
import {
  Attributes,
  DialogContent,
  DialogProceedCallback,
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
import { showTempAlert } from '../lib/wip-utils'
import { LoadingOverlay } from '../components/LoadingOverlay'
import { Link } from 'react-router-dom'
import { ROUTES } from '../lib/constants'
import { StyledDialog } from '../components/StyledDialog'

type EServiceWriteProps = {
  data: any
}

export function EServiceWrite({ data }: EServiceWriteProps) {
  const [loadingText, setLoadingText] = useState<string | undefined>(undefined)
  const [toast, setToast] = useState<ToastContent>()
  const [dialog, setDialog] = useState<DialogContent>()

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

  // Contains the data necessary to create an e-service, ecluded the attributes
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

  // Contains the template to generate the interoperability agreement
  const todoLoadAccordo = () => {
    console.log('TODO: genera accordo di interoperabilità')
  }

  // Contain the optional documents to explain how the service works
  const updateDocuments = (e: any) => {
    setDocuments([...documents, { kind: 'document', description: '', doc: e.target.files[0] }])
  }
  const buildDeleteDocuments = (name: string) => (_: any) => {
    setDocuments([...documents.filter((d) => d.doc.name !== name)])
  }

  // Contain the required OpenAPI/WSDL file to explain how the API is structured
  const updateInterface = (e: any) => {
    setInterfaceDocument({ kind: 'interface', description: '', doc: e.target.files[0] })
  }
  const deleteInterface = (_: any) => {
    setInterfaceDocument(undefined)
  }

  // Dialog and toast related functions
  const wrapActionInDialog = (wrappedAction: DialogProceedCallback) => async (_: any) => {
    setDialog({ proceedCallback: wrappedAction, close: closeDialog })
  }
  const closeDialog = () => {
    setDialog(undefined)
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

  /*
   * API calls
   */
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

  // This method contains a waterfall of two calls
  // First, the eservice is created
  // Then, it is attached its interface and documents
  const createEserviceAndUploadDocuments = async () => {
    const { descriptors, eserviceId } = await createEservice()
    // For now there is only one. This will be refactored after the PoC
    const descriptorId = descriptors[0].id
    await uploadDocuments(eserviceId, descriptorId)
    return { eserviceId, descriptorId }
  }
  /*
   * End API calls
   */

  /*
   * List of possible actions for the user to perform
   */
  const saveDraft = async () => {
    closeDialog()
    setLoadingText('Stiamo salvando la bozza')
    await createEserviceAndUploadDocuments()
    setLoadingText(undefined)
    showToast('Bozza salvata')
  }

  const publish = async () => {
    closeDialog()
    setLoadingText('Stiamo pubblicando la versione del servizio')
    const { eserviceId } = await createEserviceAndUploadDocuments()

    await fetchWithLogs(
      { endpoint: 'ESERVICE_VERSION_PUBLISH', endpointParams: { eserviceId } },
      { method: 'POST' }
    )

    setLoadingText(undefined)
    showToast('Versione del servizio pubblicata')
  }

  const cancel = () => {
    showTempAlert('Cancella bozza')
    closeDialog()
    showToast('Bozza eliminata')
  }
  /*
   * End list of actions
   */

  // When the component mounts, if some data is passed from above, pre-compile the fields.
  // This can happen if this service version is an already existing draft that can be edited
  // again before being published
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
          <Button className="me-3" variant="primary" onClick={wrapActionInDialog(saveDraft)}>
            salva in bozza
          </Button>
          <Button className="me-3" variant="primary" onClick={wrapActionInDialog(publish)}>
            pubblica adesso
          </Button>
          <Button
            className="mockFeature"
            variant="outline-primary"
            onClick={wrapActionInDialog(cancel)}
          >
            cancella
          </Button>
        </div>
      </WhiteBackground>

      {dialog && <StyledDialog {...dialog} />}
      {toast && !isEmpty(toast) && <StyledToast {...toast} />}
      {loadingText && (
        <LoadingOverlay loadingText={loadingText || "Stiamo effettuando l'operazione richiesta"} />
      )}
    </React.Fragment>
  )
}
