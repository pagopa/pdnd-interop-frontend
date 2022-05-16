import React from 'react'
import { EServiceAttributeGroup } from './EServiceAttributeGroup'
import { StyledIntro } from './Shared/StyledIntro'
import isEqual from 'lodash/isEqual'
import { AttributeKey, CatalogAttribute, FrontendAttributes } from '../../types'
import { Box } from '@mui/system'
import { useTranslation } from 'react-i18next'

type EServiceAttributeSectionProps = {
  attributes: FrontendAttributes
  setAttributes: React.Dispatch<React.SetStateAction<FrontendAttributes>>
  disabled: boolean
}

export function EServiceAttributeSection({
  attributes,
  setAttributes,
  disabled,
}: EServiceAttributeSectionProps) {
  const { t } = useTranslation('attributes')
  const getIds = (arr: Array<CatalogAttribute>) => arr.map((item) => item.id)

  const wrapRemove = (key: AttributeKey) => (attributeGroupToRemove: Array<CatalogAttribute>) => {
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
    (attributeGroup: Array<CatalogAttribute>, explicitAttributeVerification: boolean) => {
      setAttributes({
        ...attributes,
        [key]: [...attributes[key], { attributes: attributeGroup, explicitAttributeVerification }],
      })
    }

  return (
    <React.Fragment>
      {Object.keys(attributes).map((key, i) => {
        const attributeKey = key as AttributeKey
        const title = t(`${attributeKey}.label`)
        const description = t(`${attributeKey}.description`)

        return (
          <Box sx={{ mb: attributeKey === 'declared' ? 4 : 12 }} key={i}>
            <StyledIntro component="h3" sx={{ mb: 2 }}>
              {{ title, description }}
            </StyledIntro>
            <EServiceAttributeGroup
              canRequireVerification={attributeKey === 'verified'}
              canCreateNewAttributes={attributeKey !== 'certified'}
              attributesGroup={attributes[attributeKey]}
              add={wrapAdd(attributeKey)}
              remove={wrapRemove(attributeKey)}
              attributeKey={attributeKey}
              disabled={disabled}
            />
          </Box>
        )
      })}
    </React.Fragment>
  )
}
