import React from 'react'
import { EServiceAttributeGroup } from './EServiceAttributeGroup'
import { StyledIntro } from './Shared/StyledIntro'
import isEqual from 'lodash/isEqual'
import { AttributeKey, CatalogAttribute, FrontendAttributes } from '../../types'
import { Box } from '@mui/system'

type EServiceAttributeSectionProps = {
  attributes: FrontendAttributes
  setAttributes: React.Dispatch<React.SetStateAction<FrontendAttributes>>
}

type TypeLabel = {
  title: string
  description: string
}
type TypeLabels = Record<AttributeKey, TypeLabel>

const TYPE_LABELS: TypeLabels = {
  certified: {
    title: 'Attributi Certificati',
    description:
      'Questi attributi sono verificati da una fonte autoritativa riconosciuta, e non necessitano di ulteriori verifiche',
  },
  verified: {
    title: 'Attributi Verificati',
    description:
      'Questi attributi potrebbero essere stati già verificati da altre organizzazioni. Decidi se verificarli comunque',
  },
  declared: {
    title: 'Attributi Dichiarati',
    description:
      'Il fruitore dichiara di possedere questi attributi. Non è necessaria la verifica e il fruitore si assume la responsabilità di quanto dichiarato',
  },
}

export function EServiceAttributeSection({
  attributes,
  setAttributes,
}: EServiceAttributeSectionProps) {
  const getIds = (arr: any[]) => arr.map((item) => item.id)

  const wrapRemove = (key: AttributeKey) => (attributeGroupToRemove: CatalogAttribute[]) => {
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
    (key: AttributeKey) =>
    (attributeGroup: CatalogAttribute[], explicitAttributeVerification: boolean) => {
      setAttributes({
        ...attributes,
        [key]: [...attributes[key], { attributes: attributeGroup, explicitAttributeVerification }],
      })
    }

  return (
    <React.Fragment>
      {Object.keys(attributes).map((key, i) => {
        const attributeKey = key as AttributeKey
        const { title, description } = TYPE_LABELS[attributeKey]

        return (
          <Box sx={{ mb: 12 }} key={i}>
            <StyledIntro variant="h3" sx={{ mb: 0, pb: 0 }}>
              {{ title, description }}
            </StyledIntro>
            <EServiceAttributeGroup
              canRequireVerification={attributeKey === 'verified'}
              canCreateNewAttributes={attributeKey !== 'certified'}
              attributesGroup={attributes[attributeKey]}
              add={wrapAdd(attributeKey)}
              remove={wrapRemove(attributeKey)}
              attributeKey={attributeKey}
            />
          </Box>
        )
      })}
    </React.Fragment>
  )
}
