import React from 'react'
import { AttributeFromCatalog, AttributeKey, Attributes } from '../../types'
import { EServiceAttributeGroup } from './EServiceAttributeGroup'
import { StyledIntro } from './StyledIntro'
import { WhiteBackground } from './WhiteBackground'

type EServiceAttributeSectionProps = {
  attributes: Attributes
  setAttributes: React.Dispatch<React.SetStateAction<Attributes>>
}

type TypeLabel = {
  title: string
  description: string
}
type TypeLabels = {
  [key in AttributeKey]: TypeLabel
}

const TYPE_LABELS: TypeLabels = {
  certified: {
    title: 'Attributi Certificati',
    description:
      'Questi attributi sono verificati da un’autorità trusted, e non necessitano di ulteriori verifiche',
  },
  verified: {
    title: 'Attributi Verificati',
    description:
      'Questi attributi sono verificati da altri enti. Necessitano comunque approvazione manuale da parte di un authority',
  },
  declared: {
    title: 'Attributi Dichiarati',
    description:
      'Questi attributi sono dichiarati dall’ente che eroga il servizio, il quale è responsabile legalmente delle dichiarazioni rese',
  },
}

export function EServiceAttributeSection({
  attributes,
  setAttributes,
}: EServiceAttributeSectionProps) {
  const buildRemove = (key: AttributeKey) => (attributeGroup: AttributeFromCatalog[]) => {
    // const _attributes = { ...attributes }
    // _attributes[key] = _attributes[key].filter((_attribute) => _attribute.id !== attribute.id)
    console.log('REMOVE', attributeGroup)
    // setAttributes(_attributes)
  }

  const buildAdd =
    (key: AttributeKey) =>
    (attributeGroup: AttributeFromCatalog[], verificationRequired: boolean) => {
      setAttributes({
        ...attributes,
        [key]: [...attributes[key], { attributeGroup, verificationRequired }],
      })
    }

  console.log({ attributes })

  return (
    <WhiteBackground>
      <StyledIntro>
        {{
          title: 'Attributi*',
        }}
      </StyledIntro>

      {Object.keys(attributes).map((key, i) => {
        const attributeKey = key as AttributeKey
        const title = TYPE_LABELS[key as keyof TypeLabels].title
        const description = TYPE_LABELS[key as keyof TypeLabels].description

        return (
          <div className="my-5">
            <StyledIntro priority={2}>{{ title, description }}</StyledIntro>
            <EServiceAttributeGroup
              key={i}
              canRequiredValidation={key === 'verified'}
              canCreateNewAttributes={key !== 'certified'}
              attributes={attributes[attributeKey]}
              add={buildAdd(attributeKey)}
              remove={buildRemove(attributeKey)}
              attributeKey={attributeKey}
            />
          </div>
        )
      })}
    </WhiteBackground>
  )
}
