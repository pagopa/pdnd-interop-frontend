import React, { useContext } from 'react'
import isEmpty from 'lodash/isEmpty'
import has from 'lodash/has'
import { Button } from 'react-bootstrap'
import {
  AttributeType,
  EServiceReadType,
  GroupBackendAttribute,
  SingleBackendAttribute,
} from '../../types'
import { DescriptionBlock } from '../components/DescriptionBlock'
import { StyledIntro } from '../components/StyledIntro'
import { WhiteBackground } from '../components/WhiteBackground'
import { useMode } from '../hooks/useMode'
import { ATTRIBUTE_TYPE_LABEL, ESERVICE_STATUS_LABEL, ROUTES } from '../lib/constants'
import { PartyContext } from '../lib/context'
import { UserFeedbackHOCProps, withUserFeedback } from '../components/withUserFeedback'
import { Link } from 'react-router-dom'
import { minutesToHHMMSS } from '../lib/date-utils'

type EServiceReadProps = {
  data: EServiceReadType
}

function EServiceReadComponent({
  data,
  runAction,
  wrapActionInDialog,
}: EServiceReadProps & UserFeedbackHOCProps) {
  const { party } = useContext(PartyContext)
  const mode = useMode()

  const DESCRIPTIONS = {
    provider: "Nota: questa versione dell'e-service non è più modificabile",
    subscriber: `${
      party?.partyId === data.producerId ? "Nota: sei l'erogatore di questo e-service" : ''
    }`,
  }

  /*
   * List of possible actions for the user to perform
   */
  const subscribe = async (_: any) => {
    const agreementData = { eserviceId: data.id, consumerId: party?.partyId }

    await runAction(
      { path: { endpoint: 'AGREEMENT_CREATE' }, config: { method: 'POST', data: agreementData } },
      { suppressToast: false }
    )
  }
  /*
   * End list of actions
   */

  // Get all documents actual URL
  const wrapDownloadDocument = (documentId: string) => async (e: any) => {
    await runAction(
      {
        path: {
          endpoint: 'ESERVICE_VERSION_GET_DOCUMENTS',
          endpointParams: {
            eserviceId: data.id,
            descriptorId: data.activeDescriptor!.id,
            documentId,
          },
        },
        config: { method: 'GET' },
      },
      { suppressToast: false }
    )
  }

  if (isEmpty(data)) {
    return null
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

        <DescriptionBlock label="Interfaccia">
          <button
            className="btn-as-link-default"
            onClick={wrapDownloadDocument(data.activeDescriptor!.interface!.id)}
          >
            Scarica il documento di interfaccia
          </button>
        </DescriptionBlock>

        {data.activeDescriptor!.docs.length > 0 && (
          <DescriptionBlock label="Documentazione">
            {data.activeDescriptor!.docs.map((d, i) => (
              <div
                className={`d-flex justify-content-between border-bottom border-bottom-1 ${
                  i === 0 ? 'mt-3' : ''
                }`}
                key={i}
              >
                <div className="py-1 my-1">
                  <i className="text-primary fs-5 bi bi-paperclip me-2" /> <strong>{d.name}</strong>
                  <br />
                  {d.description}
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
              data.attributes[key].map((attribute, j) => {
                const isVerified = key === 'verified'
                const isSingle = has(attribute, 'single')

                const labels = isSingle
                  ? [(attribute as SingleBackendAttribute).single!]
                  : (attribute as GroupBackendAttribute).group!

                const attributeLabels = labels
                  .map((a) =>
                    isVerified ? `${a.name || a.id} (richiesta verifica)` : a.name || a.id
                  )
                  .join(' oppure ')

                return (
                  <React.Fragment key={j}>
                    <span>{attributeLabels}</span>
                    <br />
                  </React.Fragment>
                )
              })
            ) : (
              <span>Nessun attributo presente</span>
            )}
          </DescriptionBlock>
        ))}
      </WhiteBackground>

      {mode === 'subscriber' && (
        <WhiteBackground>
          <div className="d-flex">
            {party?.partyId !== data.producerId && data.activeDescriptor?.status === 'published' && (
              <Button
                className="me-3"
                variant="primary"
                onClick={wrapActionInDialog(subscribe, 'AGREEMENT_CREATE')}
              >
                iscriviti
              </Button>
            )}
            <Button
              variant="outline-primary"
              as={Link}
              to={ROUTES.SUBSCRIBE.SUBROUTES!.CATALOG_LIST.PATH}
            >
              torna al catalogo
            </Button>
          </div>
        </WhiteBackground>
      )}
    </React.Fragment>
  )
}

export const EServiceRead = withUserFeedback(EServiceReadComponent)
