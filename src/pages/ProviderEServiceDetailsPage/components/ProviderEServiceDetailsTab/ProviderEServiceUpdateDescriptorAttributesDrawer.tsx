import { Drawer } from '@/components/shared/Drawer'
import React from 'react'
import type { AttributeKey } from '@/types/attribute.types'
import type { DescriptorAttribute, DescriptorAttributes } from '@/api/api.generatedTypes'
import { Box, Stack } from '@mui/material'
import { AttributeContainer, AttributeGroupContainer } from '@/components/layout/containers'
import { useTranslation } from 'react-i18next'
import { ButtonNaked } from '@pagopa/mui-italia'
import AddIcon from '@mui/icons-material/Add'
import { AttributeAutocomplete } from '@/components/shared/AttributeAutocomplete'
import cloneDeep from 'lodash/cloneDeep'
import { EServiceMutations } from '@/api/eservice'
import { remapDescriptorAttributesToDescriptorAttributesSeed } from '@/utils/attribute.utils'
import { useParams } from '@/router'

type ProviderEServiceUpdateDescriptorAttributesDrawerProps = {
  isOpen: boolean
  onClose: () => void
  attributeKey: AttributeKey
  descriptorAttributes: DescriptorAttributes
}

export const ProviderEServiceUpdateDescriptorAttributesDrawer: React.FC<
  ProviderEServiceUpdateDescriptorAttributesDrawerProps
> = ({ isOpen, onClose, descriptorAttributes, attributeKey }) => {
  const { t } = useTranslation('eservice', {
    keyPrefix: 'read.drawers.updateDescriptorAttributesDrawer',
  })
  const { t: tAttribute } = useTranslation('attribute')
  const { t: tCommon } = useTranslation('common')

  const { eserviceId, descriptorId } = useParams<'PROVIDE_ESERVICE_MANAGE'>()

  const [selectedDescriptorAttributes, setSelectedDescriptorAttributes] =
    React.useState<DescriptorAttributes>(() => cloneDeep(descriptorAttributes))

  const { mutate: updateAttributes } = EServiceMutations.useUpdateDescriptorAttributes()

  const attributeGroups = selectedDescriptorAttributes[attributeKey]
  const [isAttributeAutocompleteShown, setIsAttributeAutocompleteShown] = React.useState(false)

  const alreadySelectedAttributeIds = React.useMemo(
    () =>
      attributeGroups.reduce(
        (acc, group) => [...acc, ...group.map(({ id }) => id)],
        [] as Array<string>
      ),
    [attributeGroups]
  )

  const handleAddAttributeToGroup = (groupdIdx: number, attribute: DescriptorAttribute) => {
    setSelectedDescriptorAttributes((prev) => {
      const newAttributeGroups = [...prev[attributeKey]]
      newAttributeGroups[groupdIdx].push(attribute)
      return {
        ...prev,
        [attributeKey]: newAttributeGroups,
      }
    })
    setIsAttributeAutocompleteShown(false)
  }

  const handleRemoveAttributeFromGroup = (groupIdx: number, attributeId: string) => {
    setSelectedDescriptorAttributes((prev) => {
      const newAttributeGroups = [...prev[attributeKey]]
      newAttributeGroups[groupIdx] = newAttributeGroups[groupIdx].filter(
        ({ id }) => id !== attributeId
      )
      return {
        ...prev,
        [attributeKey]: newAttributeGroups,
      }
    })
  }

  const canAttributeBeRemoved = (groupIdx: number, descriptorAttribute: DescriptorAttribute) => {
    return !descriptorAttributes[attributeKey][groupIdx].some(
      (att) => att.id === descriptorAttribute.id
    )
  }

  const handleSubmit = () => {
    updateAttributes(
      {
        eserviceId,
        descriptorId,
        attributeKey,
        ...remapDescriptorAttributesToDescriptorAttributesSeed(selectedDescriptorAttributes),
      },
      { onSuccess: onClose }
    )
  }

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      onTransitionExited={() => setSelectedDescriptorAttributes(cloneDeep(descriptorAttributes))}
      title={t('title', { attributeKind: tAttribute(`type.${attributeKey}_other`) })}
      subtitle={t('subtitle')}
      buttonAction={{
        label: tCommon('actions.saveEdits'),
        action: handleSubmit,
      }}
    >
      <Stack spacing={3} sx={{ mb: 3 }}>
        {attributeGroups.map((group, groupIdx) => (
          <AttributeGroupContainer
            cardContentSx={{
              py: 1,
              px: 2,
            }}
            sx={{ border: 'none' }}
            elevation={4}
            key={groupIdx}
            title={tAttribute('group.read.provider')}
          >
            <Stack sx={{ listStyleType: 'none', pl: 0, mt: 1 }} component="ul" spacing={1.2}>
              {group.map((attribute) => (
                <Box component="li" key={attribute.id}>
                  <AttributeContainer
                    attribute={attribute}
                    onRemove={
                      canAttributeBeRemoved(groupIdx, attribute)
                        ? (attribute) => handleRemoveAttributeFromGroup(groupIdx, attribute)
                        : undefined
                    }
                  />
                </Box>
              ))}
            </Stack>
            {isAttributeAutocompleteShown ? (
              <AttributeAutocomplete
                attributeKey={attributeKey}
                alreadySelectedAttributeIds={alreadySelectedAttributeIds}
                onAddAttribute={(attribute) => handleAddAttributeToGroup(groupIdx, attribute)}
                direction="column"
              />
            ) : (
              <ButtonNaked
                color="primary"
                type="button"
                sx={{ fontWeight: 700 }}
                startIcon={<AddIcon fontSize="small" />}
                onClick={() => setIsAttributeAutocompleteShown(true)}
              >
                {tAttribute('group.addBtn')}
              </ButtonNaked>
            )}
          </AttributeGroupContainer>
        ))}
      </Stack>
    </Drawer>
  )
}
