import React from 'react'
import isEmpty from 'lodash/isEmpty'
import has from 'lodash/has'
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
import { ATTRIBUTE_TYPE_LABEL, ESERVICE_STATUS_LABEL } from '../lib/constants'

type EServiceReadProps = {
  data: EServiceReadType
}

export function EServiceRead({ data }: EServiceReadProps) {
  const mode = useMode()

  const DESCRIPTIONS = {
    provider: 'Nota: questa versione del servizio è in sola lettura, non è più modificabile',
    subscriber: '',
  }

  if (isEmpty(data)) {
    return null
  }

  return (
    <React.Fragment>
      <WhiteBackground>
        <StyledIntro>{{ title: data.name, description: DESCRIPTIONS[mode!] }}</StyledIntro>

        <DescriptionBlock label="Versione">
          <span>{data.descriptors[0].version}</span>
        </DescriptionBlock>

        <DescriptionBlock label="Stato della versione">
          <span>{ESERVICE_STATUS_LABEL[data.descriptors[0].status]}</span>
        </DescriptionBlock>

        <DescriptionBlock label="Audience">
          <span>{data.audience?.join(', ')}</span>
        </DescriptionBlock>

        <DescriptionBlock label="Descrizione">
          <span>{data.description}</span>
        </DescriptionBlock>

        <DescriptionBlock label="Tecnologia">
          <span>{data.technology}</span>
        </DescriptionBlock>

        <DescriptionBlock label="PoP (Proof of Possession)">
          <span className="fakeData">Non richiesta</span>
        </DescriptionBlock>

        <DescriptionBlock label="Durata del voucher dall'attivazione">
          <span className="fakeData">
            {new Date(data.voucherLifespan * 1000).toISOString().substr(11, 8)} (HH:MM:SS)
          </span>
        </DescriptionBlock>

        <DescriptionBlock label="Accordo di interoperabilità">
          <a className="fakeData link-default" href="#0" target="_blank">
            Leggi qui
          </a>
        </DescriptionBlock>

        {data.descriptors[0].interface && (
          <DescriptionBlock label="Interfaccia">
            <a className="fakeData link-default" href="#0" target="_blank">
              Leggi qui
            </a>
          </DescriptionBlock>
        )}

        {data.descriptors[0].docs.length > 0 && (
          <DescriptionBlock label="Documentazione">
            {data.descriptors[0].docs.map((d, i) => (
              <div key={i}>
                <a className="fakeData link-default" href="#0" target="_blank">
                  {d.name}
                </a>
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
                  .map((a) => (isVerified ? `${a.id} (richiesta verifica)` : a.id))
                  .join(', ')

                return <span key={j}>{attributeLabels}</span>
              })
            ) : (
              <span>Nessun attributo presente</span>
            )}
          </DescriptionBlock>
        ))}
      </WhiteBackground>
    </React.Fragment>
  )
}
