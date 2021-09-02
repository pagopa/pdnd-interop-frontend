import React from 'react'
import { EServiceAttributeGroup } from './EServiceAttributeGroup'
import { StyledIntro } from './StyledIntro'
import { WhiteBackground } from './WhiteBackground'
import isEqual from 'lodash/isEqual'
import { AttributeType, CatalogAttribute, FrontendAttributes } from '../../types'

type EServiceAttributeSectionProps = {
  attributes: FrontendAttributes
  setAttributes: React.Dispatch<React.SetStateAction<FrontendAttributes>>
}

type TypeLabel = {
  title: string
  description: string
}
type TypeLabels = {
  [key in AttributeType]: TypeLabel
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
      "Questi attributi sono dichiarati dall’ente che eroga il servizio, il quale è responsabile legalmente delle dichiarazioni rese all'atto della sottoscrizione dell'accordo di interoperabilità",
  },
}

export function EServiceAttributeSection({
  attributes,
  setAttributes,
}: EServiceAttributeSectionProps) {
  const getIds = (arr: any[]) => arr.map((item) => item.id)

  const wrapRemove = (key: AttributeType) => (attributeGroupToRemove: CatalogAttribute[]) => {
    // Just for safety, generate new object
    const filteredAttributes = { ...attributes }
    // Filter out those that have the exact same id list as the group to remove
    filteredAttributes[key] = filteredAttributes[key].filter(
      ({ attributes: currentGroup }) =>
        !isEqual(getIds(currentGroup), getIds(attributeGroupToRemove))
    )
    // Set again
    setAttributes(filteredAttributes)
  }

  const wrapAdd =
    (key: AttributeType) =>
    (attributeGroup: CatalogAttribute[], explicitAttributeVerification: boolean) => {
      setAttributes({
        ...attributes,
        [key]: [...attributes[key], { attributes: attributeGroup, explicitAttributeVerification }],
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
        const attributeKey = key as AttributeType
        const title = TYPE_LABELS[key as keyof TypeLabels].title
        const description = TYPE_LABELS[key as keyof TypeLabels].description

        return (
          <div className="my-5" key={i}>
            <StyledIntro priority={2}>{{ title, description }}</StyledIntro>
            <EServiceAttributeGroup
              canRequireVerification={key === 'verified'}
              canCreateNewAttributes={key !== 'certified'}
              attributesGroup={attributes[attributeKey]}
              add={wrapAdd(attributeKey)}
              remove={wrapRemove(attributeKey)}
              attributeKey={attributeKey}
            />
          </div>
        )
      })}
    </WhiteBackground>
  )
}
