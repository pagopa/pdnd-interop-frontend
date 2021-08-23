import React from 'react'
import { EServiceAttributes } from '../../types'
import { WhiteBackground } from './WhiteBackground'

type EServiceAttributeSectionProps = {
  attributes: EServiceAttributes
  setAttributes: React.Dispatch<React.SetStateAction<EServiceAttributes>>
}

type Label = {
  title: string
  subtitle: string
}
type Labels = {
  certified: Label
  verified: Label
  declared: Label
}

export function EServiceAttributeSection({
  attributes,
  setAttributes,
}: EServiceAttributeSectionProps) {
  const LABELS: Labels = {
    certified: {
      title: 'Attributi Certificati',
      subtitle:
        'Questi attributi sono verificati da un’autorità trusted, e non necessitano di ulteriori verifiche',
    },
    verified: {
      title: 'Attributi Verificati',
      subtitle:
        'Questi attributi sono verificati da altri enti. Necessitano comunque approvazione manuale da parte di un authority',
    },
    declared: {
      title: 'Attributi Dichiarati',
      subtitle:
        'Questi attributi sono dichiarati dall’ente che eroga il servizio, il quale è responsabile legalmente delle dichiarazioni rese',
    },
  }

  return (
    <WhiteBackground>
      <h2>Attributi*</h2>

      {Object.keys(attributes).map((key, i) => {
        return (
          <div key={i} className="my-5">
            <h3>{LABELS[key as keyof Labels].title}</h3>
            <p>{LABELS[key as keyof Labels].subtitle}</p>

            <div>Tabella attributi</div>
          </div>
        )
      })}
    </WhiteBackground>
  )
}
