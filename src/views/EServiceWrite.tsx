import React, { useContext, useEffect, useState } from 'react'
import { Button } from 'react-bootstrap'
import { WhiteBackground } from '../components/WhiteBackground'
import { EServiceDocumentSection } from '../components/EServiceDocumentSection'
import {
  EServiceCreateDataKeysType,
  EServiceCreateDataType,
  EServiceDocumentWrite,
  EServiceReadType,
  FrontendAttributes,
} from '../../types'
import { EServiceAgreementSection } from '../components/EServiceAgreementSection'
import { EServiceGeneralInfoSection } from '../components/EServiceGeneralInfoSection'
import { EServiceAttributeSection } from '../components/EServiceAttributeSection'
import { StyledIntro } from '../components/StyledIntro'
import { fetchAllWithLogs, fetchWithLogs } from '../lib/api-utils'
import { PartyContext } from '../lib/context'
import {
  formatBackendAttributesToFrontend,
  formatFrontendAttributesToBackend,
} from '../lib/attributes'
import isEmpty from 'lodash/isEmpty'
import { Link } from 'react-router-dom'
import { ROUTES } from '../lib/constants'
import { UserFeedbackHOCProps, withUserFeedback } from '../components/withUserFeedback'
import { getFetchOutcome } from '../lib/error-utils'
import { AxiosError, AxiosResponse } from 'axios'
import { showTempAlert } from '../lib/wip-utils'

type EServiceWriteProps = {
  data: EServiceReadType
}

function EServiceWriteComponent({
  data,
  runAction,
  runCustomAction,
  requestRerender,
  wrapActionInDialog,
}: UserFeedbackHOCProps & EServiceWriteProps) {
  const { party } = useContext(PartyContext)
  // General information section
  const [eserviceData, setEserviceData] = useState<EServiceCreateDataType>({
    name: '',
    audience: [],
    description: '',
    technology: 'REST',
    pop: false, // TEMP HYPOTHESIS
    voucherLifespan: 41713585, // TEMP BACKEND
    producerId: party?.partyId as string,
  })
  // Documents section (covers documentation & interface)
  const [interfaceDocument, setInterfaceDocument] = useState<EServiceDocumentWrite | undefined>()
  const [documents, setDocuments] = useState<EServiceDocumentWrite[]>([])
  // Attributes
  const [attributes, setAttributes] = useState<FrontendAttributes>({
    certified: [],
    verified: [],
    declared: [],
  })

  // Contains the data necessary to create an e-service, ecluded the attributes
  const buildSetEServiceData =
    (fieldName: EServiceCreateDataKeysType, fieldType = 'text') =>
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
    showTempAlert('Generazione accordo di interoperabilità') // TEMP PIN-239
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
      attributes: formatFrontendAttributesToBackend(attributes),
    }

    return await fetchWithLogs(
      { endpoint: 'ESERVICE_CREATE' },
      { method: 'POST', data: eserviceCreateData }
    )
  }

  const uploadDocuments = async (eserviceId: string, descriptorId: string) => {
    return await fetchAllWithLogs(
      [...documents, interfaceDocument]
        // For now filter, but they should all be required
        .filter((d) => !isEmpty(d))
        .map((data) => {
          const { kind, description, doc } = data as EServiceDocumentWrite
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
    // Try to create service
    const createEserviceResponse = await createEservice()

    // If success
    if (getFetchOutcome(createEserviceResponse) === 'success') {
      // Get useful variables
      const { descriptors, id: eserviceId } = (createEserviceResponse as AxiosResponse).data

      // For now there is only one. This will be refactored after the PoC
      const descriptorId = descriptors[0].id

      // Try to upload the documents
      const uploadDocumentsResponses = await uploadDocuments(eserviceId, descriptorId)

      // api-utils needs to be typed better
      const errorResponses = (uploadDocumentsResponses as any).filter(
        (r: AxiosResponse | AxiosError) => getFetchOutcome(r) === 'error'
      )

      // If there is any error
      if (errorResponses.length > 0) {
        // Return the error
        return errorResponses[0]
      }

      // Request a rerender so that the view is updated
      // TEMP REFACTOR: this doesn't work now as "data" is fetched by the useAsyncFetch in EServiceGate, note EServiceWrite
      requestRerender()

      // Otherwise return the variables useful for publishing
      return { eserviceId, descriptorId }
    } else {
      // If failure in create service, return the error
      return createEserviceResponse as AxiosError
    }
  }
  /*
   * End API calls
   */

  /*
   * List of possible actions for the user to perform
   */
  const saveDraft = async () => {
    await runCustomAction(createEserviceAndUploadDocuments, {
      loadingText: 'Stiamo salvando la bozza',
      success: {
        title: 'Bozza salvata',
        description: (
          <>
            Operazione conclusa con successo.{' '}
            <Link to={ROUTES.PROVIDE.SUBROUTES!.ESERVICE_LIST.PATH} className="link-default">
              Torna agli e-service
            </Link>
          </>
        ),
      },
      error: { title: 'Errore', description: 'Non è stato possibile salvare la bozza' },
    })
  }

  const publish = async () => {
    const { eserviceId, descriptorId } = await createEserviceAndUploadDocuments()
    await runAction(
      {
        path: {
          endpoint: 'ESERVICE_VERSION_PUBLISH',
          endpointParams: { eserviceId, descriptorId },
        },
        config: { method: 'POST' },
      },
      ROUTES.PROVIDE.SUBROUTES!.ESERVICE_LIST
    )
  }

  const deleteDraft = async () => {
    if (!isEmpty(data) && data.descriptors.length > 0) {
      const eserviceId = data.id
      const descriptorId = data.descriptors[0].id
      await runAction(
        {
          path: { endpoint: 'ESERVICE_DRAFT_DELETE', endpointParams: { eserviceId, descriptorId } },
          config: { method: 'DELETE' },
        },
        ROUTES.PROVIDE.SUBROUTES!.ESERVICE_LIST
      )
    }
  }
  /*
   * End list of actions
   */

  // When the component mounts, if some data is passed from above, pre-compile the fields.
  // This can happen if this service version is an already existing draft that can be edited
  // again before being published
  useEffect(() => {
    if (!isEmpty(data)) {
      // Set general information
      const readEServiceData: EServiceCreateDataType = {
        name: data.name,
        description: data.description,
        audience: data.audience,
        technology: data.technology,
        voucherLifespan: data.voucherLifespan,
        producerId: data.producerId,
        pop: false,
      }

      setEserviceData({ ...eserviceData, ...readEServiceData })

      // Set interface document
      const readInterface = data.descriptors[0].interface

      if (!isEmpty(readInterface)) {
        const writeInterface: EServiceDocumentWrite = {
          kind: 'interface',
          description: readInterface.description,
          doc: { name: readInterface.name }, // TEMP BACKEND: this should be the document blob
        }

        setInterfaceDocument(writeInterface)
      }

      // Set all the other documents
      const readDocuments = data.descriptors[0].docs

      if (!isEmpty(readDocuments) && readDocuments.length > 0) {
        const writeDocuments: EServiceDocumentWrite[] = readDocuments.map((d) => {
          return {
            kind: 'document',
            description: d.description,
            doc: { name: d.name }, // TEMP BACKEND: this should be the document blob
          }
        })

        setDocuments(writeDocuments)
      }

      // Set the attributes
      setAttributes(formatBackendAttributesToFrontend(data.attributes))
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const hasPreviousVersion = () => !isEmpty(data) && data.descriptors.length > 0

  const hasPreviousDraft = () => hasPreviousVersion() && data.descriptors[0].status === 'draft'

  return (
    <React.Fragment>
      <WhiteBackground>
        <StyledIntro>
          {{
            title: 'Crea nuovo e-service',
            description:
              'I campi contrassegnati da asterisco sono obbligatori. Puoi non compilarli tutti subito e salvare il servizio in bozza, ma la pubblicazione potrà avvenire solo una volta che tutti i campi richiesti saranno stati compilati.',
          }}
        </StyledIntro>
      </WhiteBackground>

      <EServiceGeneralInfoSection
        eserviceData={eserviceData}
        setEServiceData={buildSetEServiceData}
        version={hasPreviousVersion() ? data.descriptors[0].version : '1'}
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
          <Button
            className="me-3"
            variant="primary"
            onClick={wrapActionInDialog(saveDraft, 'ESERVICE_CREATE')}
          >
            salva in bozza
          </Button>
          <Button
            className="me-3"
            variant="primary"
            onClick={wrapActionInDialog(publish, 'ESERVICE_VERSION_PUBLISH')}
          >
            pubblica adesso
          </Button>
          {hasPreviousDraft() && (
            <Button
              variant="outline-primary"
              onClick={wrapActionInDialog(deleteDraft, 'ESERVICE_DRAFT_DELETE')}
            >
              cancella bozza
            </Button>
          )}
        </div>
      </WhiteBackground>
    </React.Fragment>
  )
}

export const EServiceWrite = withUserFeedback(EServiceWriteComponent)
