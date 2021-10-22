import React, { useContext } from 'react'
import isEmpty from 'lodash/isEmpty'
import has from 'lodash/has'
import {
  AttributeType,
  BackendAttribute,
  EServiceReadType,
  GroupBackendAttribute,
  SingleBackendAttribute,
} from '../../types'
import { DescriptionBlock } from '../components/DescriptionBlock'
import { StyledIntro } from '../components/Shared/StyledIntro'
import { WhiteBackground } from '../components/WhiteBackground'
import { useMode } from '../hooks/useMode'
import { ATTRIBUTE_TYPE_LABEL, ESERVICE_STATUS_LABEL, ROUTES } from '../lib/constants'
import { PartyContext } from '../lib/context'
import { Link } from 'react-router-dom'
import { minutesToHHMMSS } from '../lib/date-utils'
import { canSubscribe } from '../lib/attributes'
import { isAdmin } from '../lib/auth-utils'
import { useSubscribeDialog } from '../hooks/useSubscribeDialog'
import { useExtensionDialog } from '../hooks/useExtensionDialog'
import { downloadFile } from '../lib/file-utils'
import { AxiosResponse } from 'axios'
import { StyledAccordion } from '../components/Shared/StyledAccordion'
import { useFeedback } from '../hooks/useFeedback'
import { StyledButton } from '../components/Shared/StyledButton'

type EServiceReadProps = {
  data: EServiceReadType
}

export function EServiceRead({ data }: EServiceReadProps) {
  const { runAction, runFakeAction, runActionWithDestination } = useFeedback()
  const { party } = useContext(PartyContext)
  const mode = useMode()

  const DESCRIPTIONS = {
    provider: "Nota: questa versione dell'e-service non è più modificabile",
    subscriber: `${
      party?.partyId === data.producer.id ? "Nota: sei l'erogatore di questo e-service" : ''
    }`,
  }

  /*
   * List of possible actions for the user to perform
   */
  const subscribe = async () => {
    const agreementData = {
      eserviceId: data.id,
      descriptorId: data.activeDescriptor!.id,
      consumerId: party?.partyId,
    }

    await runActionWithDestination(
      { path: { endpoint: 'AGREEMENT_CREATE' }, config: { data: agreementData } },
      { destination: ROUTES.SUBSCRIBE.SUBROUTES!.AGREEMENT_LIST, suppressToast: false }
    )
  }

  const askExtension = () => {
    runFakeAction('Richiedi estensione')
  }

  const { openDialog: openSubscribeDialog } = useSubscribeDialog({
    onProceedCallback: subscribe,
    producerName: data.producer.name,
  })
  const { openDialog: openExtensionDialog } = useExtensionDialog({
    onProceedCallback: askExtension,
  })
  /*
   * End list of actions
   */

  // Get all documents actual URL
  const wrapDownloadDocument = (documentId: string) => async (e: any) => {
    const { response, outcome } = await runAction(
      {
        path: {
          endpoint: 'ESERVICE_VERSION_DOWNLOAD_DOCUMENT',
          endpointParams: {
            eserviceId: data.id,
            descriptorId: data.activeDescriptor!.id,
            documentId,
          },
        },
      },
      { suppressToast: true }
    )

    if (outcome === 'success') {
      downloadFile((response as AxiosResponse).data, 'document')
    }
  }

  if (isEmpty(data)) {
    return null
  }

  const canSubscribeEservice = canSubscribe(party?.attributes, data.attributes.certified)
  const isMine = data.producer.id === party?.partyId
  const isVersionPublished = data.activeDescriptor?.status === 'published'

  const toAccordionEntries = (attributes: BackendAttribute[]) => {
    return attributes.map((attribute) => {
      const isSingle = has(attribute, 'single')

      const labels = isSingle
        ? [(attribute as SingleBackendAttribute).single!]
        : (attribute as GroupBackendAttribute).group!

      let summary = ''
      let details: string | JSX.Element = ''
      if (labels.length === 1) {
        const { name, description, explicitAttributeVerification } = labels[0]
        summary = `${name} ${explicitAttributeVerification ? ' (verifica richiesta)' : ''}`
        details = description!
      } else {
        summary = `${labels.map(({ name }) => name).join(' oppure ')}${
          labels[0].explicitAttributeVerification ? ' (verifica richiesta)' : ''
        }`
        details = (
          <React.Fragment>
            {labels.map((label, i) => {
              return (
                <div className={i !== labels.length - 1 ? 'mb-3' : ''} key={i}>
                  <div>
                    <strong>{label.name}</strong>: {label.description}
                  </div>
                </div>
              )
            })}
          </React.Fragment>
        )
      }

      return { summary, details }
    })
  }

  return (
    <React.Fragment>
      <WhiteBackground>
        <StyledIntro priority={2}>
          {{ title: data.name, description: DESCRIPTIONS[mode!] }}
        </StyledIntro>

        <DescriptionBlock label="Descrizione dell'e-service">
          <span>{data.description}</span>
        </DescriptionBlock>

        <DescriptionBlock label="Ente erogatore">
          <span>{data.producer.name}</span>
        </DescriptionBlock>

        <DescriptionBlock label="Versione">
          <span>{data.activeDescriptor!.version}</span>
        </DescriptionBlock>

        <DescriptionBlock label="Stato della versione">
          <span>{ESERVICE_STATUS_LABEL[data.activeDescriptor!.status]}</span>
        </DescriptionBlock>

        <DescriptionBlock label="Audience">
          <span>{data.activeDescriptor!.audience.join(', ')}</span>
        </DescriptionBlock>

        <DescriptionBlock label="Tecnologia">
          <span>{data.technology}</span>
        </DescriptionBlock>

        <DescriptionBlock label="PoP (Proof of Possession)">
          <span className="fakeData">Non richiesta</span>
        </DescriptionBlock>

        <DescriptionBlock label="Durata del voucher dall'attivazione">
          <span>{minutesToHHMMSS(data.activeDescriptor!.voucherLifespan)} (hh:mm:ss)</span>
        </DescriptionBlock>

        <DescriptionBlock label="Accordo di interoperabilità">
          <a className="fakeData link-default" href="#0" target="_blank">
            Scarica
          </a>
        </DescriptionBlock>

        {data.activeDescriptor!.interface && (
          <DescriptionBlock label="Interfaccia">
            <button
              className="btn-as-link-default"
              onClick={wrapDownloadDocument(data.activeDescriptor!.interface!.id)}
            >
              Scarica il documento di interfaccia
            </button>
          </DescriptionBlock>
        )}

        {data.activeDescriptor!.docs.length > 0 && (
          <DescriptionBlock label="Documentazione">
            {data.activeDescriptor!.docs.map((d, i) => (
              <div
                className={`d-flex justify-content-between border-bottom border-bottom-1 ${
                  i === 0 ? 'mt-2' : ''
                }`}
                key={i}
              >
                <div className="py-1 my-1">
                  <strong>{d.name}</strong>
                  {d.description !== 'undefined' && (
                    <React.Fragment>
                      <br />
                      <span className="d-inline-block mt-1 mb-2">
                        {decodeURIComponent(d.description)}
                      </span>
                    </React.Fragment>
                  )}
                </div>
                <button className="btn-as-link-default" onClick={wrapDownloadDocument(d.id)}>
                  <i className="text-primary fs-5 bi bi-download me-2" />
                </button>
              </div>
            ))}
          </DescriptionBlock>
        )}

        {(Object.keys(data.attributes) as AttributeType[]).map((key, i) => (
          <DescriptionBlock key={i} label={`Attributi ${ATTRIBUTE_TYPE_LABEL[key]}`}>
            {data.attributes[key].length > 0 ? (
              <StyledAccordion entries={toAccordionEntries(data.attributes[key])} />
            ) : (
              <span>Nessun attributo presente</span>
            )}
          </DescriptionBlock>
        ))}
      </WhiteBackground>

      {mode === 'subscriber' && (
        <WhiteBackground>
          <div className="d-flex">
            {isVersionPublished && !isMine && isAdmin(party) && canSubscribeEservice && (
              <StyledButton className="me-3" variant="primary" onClick={openSubscribeDialog}>
                iscriviti
              </StyledButton>
            )}
            {!isMine && isAdmin(party) && !canSubscribeEservice && (
              <StyledButton
                className="me-3 mockFeature"
                variant="primary"
                onClick={openExtensionDialog}
              >
                richiedi estensione
              </StyledButton>
            )}
            <StyledButton
              variant="outline-primary"
              as={Link}
              to={ROUTES.SUBSCRIBE.SUBROUTES!.CATALOG_LIST.PATH}
            >
              torna al catalogo
            </StyledButton>
          </div>
        </WhiteBackground>
      )}
    </React.Fragment>
  )
}
