import React from 'react'
import { AttributeFromCatalog, AttributeKey, Attributes } from '../../types'
import { EServiceAttributeGroup } from './EServiceAttributeGroup'
import { StyledIntro } from './StyledIntro'
import { WhiteBackground } from './WhiteBackground'
import isEqual from 'lodash/isEqual'

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

/*
 * The structure of the Attributes object is complex as of now, hopefully
 * it can be simplfied in the future. Right now:
 *
 * {
 *   verified: [
 *     {
 *       group: [
 *         { id: 'abc-def-ghi', ...},
 *         { id: 'pqr-stu-vwy', ...}
 *       ],
 *       verificationRequired: true
 *     },
 *     ...
 *   ],
 *   certified: [...],
 *   declared: [...]
 * }
 */

export function EServiceAttributeSection({
  attributes,
  setAttributes,
}: EServiceAttributeSectionProps) {
  const getIds = (arr: any[]) => arr.map((item) => item.id)

  const buildRemove = (key: AttributeKey) => (groupToRemove: AttributeFromCatalog[]) => {
    // Just for safety, generate new object
    const _attributes = { ...attributes }
    // Filter out those that have the exact same id list as the group to remove
    _attributes[key] = _attributes[key].filter(
      ({ group: currentGroup }) => !isEqual(getIds(currentGroup), getIds(groupToRemove))
    )
    // Set again
    setAttributes(_attributes)
  }

  const buildAdd =
    (key: AttributeKey) => (group: AttributeFromCatalog[], verificationRequired: boolean) => {
      setAttributes({
        ...attributes,
        [key]: [...attributes[key], { group, verificationRequired }],
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
        const attributeKey = key as AttributeKey
        const title = TYPE_LABELS[key as keyof TypeLabels].title
        const description = TYPE_LABELS[key as keyof TypeLabels].description

        return (
          <div className="my-5" key={i}>
            <StyledIntro priority={2}>{{ title, description }}</StyledIntro>
            <EServiceAttributeGroup
              canRequireVerification={key === 'verified'}
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
