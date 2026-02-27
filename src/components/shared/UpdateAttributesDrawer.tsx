import { Drawer } from '@/components/shared/Drawer'
import React from 'react'
import type { AttributeKey } from '@/types/attribute.types'
import type { DescriptorAttribute, DescriptorAttributes } from '@/api/api.generatedTypes'
import { Box, Divider, Stack, Typography } from '@mui/material'
import { AttributeContainer, AttributeGroupContainer } from '@/components/layout/containers'
import { useTranslation } from 'react-i18next'
import { ButtonNaked } from '@pagopa/mui-italia'
import AddIcon from '@mui/icons-material/Add'
import { AttributeAutocomplete } from '@/components/shared/AttributeAutocomplete'
import cloneDeep from 'lodash/cloneDeep'
import { EServiceMutations } from '@/api/eservice'
import { remapDescriptorAttributesToDescriptorAttributesSeed } from '@/utils/attribute.utils'
import { useParams } from '@/router'
import { EServiceTemplateMutations } from '@/api/eserviceTemplate'

type UpdateAttributesDrawerProps = {
  isOpen: boolean
  onClose: () => void
  attributeKey: AttributeKey
  attributes: DescriptorAttributes
  kind: 'ESERVICE' | 'ESERVICE_TEMPLATE'
}

export const UpdateAttributesDrawer: React.FC<UpdateAttributesDrawerProps> = ({
  isOpen,
  onClose,
  attributes,
  attributeKey,
  kind,
}) => {
  const { t } = useTranslation('eservice', {
    keyPrefix: 'read.drawers.updateDescriptorAttributesDrawer',
  })
  const { t: tAttribute } = useTranslation('attribute')
  const { t: tCommon } = useTranslation('common')

  const { eserviceId, descriptorId } = useParams<'PROVIDE_ESERVICE_MANAGE'>()
  const { eServiceTemplateId, eServiceTemplateVersionId } =
    useParams<'PROVIDE_ESERVICE_TEMPLATE_DETAILS'>()

  const [selectedAttributes, setSelectedAttributes] = React.useState<DescriptorAttributes>(() =>
    cloneDeep(attributes)
  )

  const { mutate: updateEserviceAttributes } = EServiceMutations.useUpdateDescriptorAttributes()
  const { mutate: updateEserviceTemplateAttributes } =
    EServiceTemplateMutations.useUpdateAttributes()

  const attributeGroups = selectedAttributes[attributeKey]
  const [autocompleteShownForGroup, setAutocompleteShownForGroup] = React.useState<
    Record<number, boolean>
  >({})

  const alreadySelectedAttributeIds = React.useMemo(
    () =>
      attributeGroups.reduce(
        (acc, group) => [...acc, ...group.map(({ id }) => id)],
        [] as Array<string>
      ),
    [attributeGroups]
  )

  const handleAddAttributeToGroup = (groupIdx: number, attribute: DescriptorAttribute) => {
    setSelectedAttributes((prev) => {
      const newAttributeGroups = [...prev[attributeKey]]
      newAttributeGroups[groupIdx].push(attribute)
      return {
        ...prev,
        [attributeKey]: newAttributeGroups,
      }
    })
    setAutocompleteShownForGroup((prev) => ({ ...prev, [groupIdx]: false }))
  }

  const handleRemoveAttributeFromGroup = (groupIdx: number, attributeId: string) => {
    setSelectedAttributes((prev) => {
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

  const canAttributeBeRemoved = (groupIdx: number, attribute: DescriptorAttribute) => {
    return !attributes[attributeKey][groupIdx].some((att) => att.id === attribute.id)
  }

  const handleSubmit = () => {
    if (kind === 'ESERVICE') {
      updateEserviceAttributes(
        {
          eserviceId,
          descriptorId,
          attributeKey,
          ...remapDescriptorAttributesToDescriptorAttributesSeed(selectedAttributes),
        },
        { onSuccess: onClose }
      )
    } else {
      updateEserviceTemplateAttributes(
        {
          eServiceTemplateId,
          eServiceTemplateVersionId,
          attributeKey,
          ...remapDescriptorAttributesToDescriptorAttributesSeed(selectedAttributes),
        },
        { onSuccess: onClose }
      )
    }
  }

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      onTransitionExited={() => setSelectedAttributes(cloneDeep(attributes))}
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
            title={tAttribute('attributeCardHeader.label', {
              index: groupIdx + 1,
              attributeKey: tAttribute(`type.${attributeKey}_other`),
            })}
          >
            <Typography sx={{ py: 1 }} variant="body2">
              {tAttribute('group.read.provider')}
            </Typography>
            <Stack sx={{ listStyleType: 'none', pl: 0, mt: 1, mb: 0 }} component="ul" spacing={1.2}>
              {group.map((attribute, attributeIndex) => (
                <React.Fragment key={attribute.id}>
                  <Box component="li">
                    <AttributeContainer
                      attribute={attribute}
                      onRemove={
                        canAttributeBeRemoved(groupIdx, attribute)
                          ? (attribute) => handleRemoveAttributeFromGroup(groupIdx, attribute)
                          : undefined
                      }
                    />
                  </Box>
                  {group.length > 1 && attributeIndex < group.length - 1 && (
                    <Box component="li">
                      <Divider sx={{ py: 1 }}>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          fontWeight={700}
                          textTransform="uppercase"
                        >
                          {tAttribute('group.or')}
                        </Typography>
                      </Divider>
                    </Box>
                  )}
                </React.Fragment>
              ))}
              {autocompleteShownForGroup[groupIdx] ? (
                <Box component="li" sx={{ pt: 1 }}>
                  <AttributeAutocomplete
                    attributeKey={attributeKey}
                    alreadySelectedAttributeIds={alreadySelectedAttributeIds}
                    onAddAttribute={(attribute) => handleAddAttributeToGroup(groupIdx, attribute)}
                    direction="column"
                  />
                </Box>
              ) : (
                <ButtonNaked
                  color="primary"
                  type="button"
                  sx={{ fontWeight: 700, justifyContent: 'end', pb: 1, pt: 2 }}
                  startIcon={<AddIcon fontSize="small" />}
                  onClick={() =>
                    setAutocompleteShownForGroup((prev) => ({ ...prev, [groupIdx]: true }))
                  }
                >
                  {tAttribute('group.addAnotherBtn')}
                </ButtonNaked>
              )}
            </Stack>
          </AttributeGroupContainer>
        ))}
      </Stack>
    </Drawer>
  )
}
