import React from 'react'
import {
  EServiceAttribute,
  EServiceAttributeFromCatalog,
  EServiceAttributeKey,
  EServiceAttributes,
} from '../../types'
import { EServiceAttributeGroup } from './EServiceAttributeGroup'
import { StyledIntro } from './StyledIntro'
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
  [key in EServiceAttributeKey]: Label
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

  const buildRemove = (key: EServiceAttributeKey) => (attribute: EServiceAttributeFromCatalog) => {
    const _attributes = { ...attributes }
    _attributes[key] = _attributes[key].filter((_attribute) => _attribute.id !== attribute.id)
    console.log('REMOVE', attribute)
    setAttributes(_attributes)
  }

  const buildAdd =
    (key: EServiceAttributeKey) =>
    (attribute: EServiceAttribute, verificationRequired: boolean) => {
      console.log('ADD', attribute, verificationRequired)
      setAttributes({
        ...attributes,
        [key]: [...attributes[key], { ...attribute, verificationRequired }],
      })
    }

  return (
    <WhiteBackground>
      <StyledIntro>
        {{
          title: 'Attributi*',
        }}
      </StyledIntro>

      {Object.keys(attributes).map((key, i) => {
        const attributeKey = key as EServiceAttributeKey

        return (
          <EServiceAttributeGroup
            key={i}
            title={LABELS[key as keyof Labels].title}
            subtitle={LABELS[key as keyof Labels].subtitle}
            hasValidation={key === 'verified'}
            canCreate={key !== 'certified'}
            attributeClass={attributes[attributeKey]}
            add={buildAdd(attributeKey)}
            remove={buildRemove(attributeKey)}
            attributeKey={attributeKey}
          />
        )
      })}
    </WhiteBackground>
  )
}
