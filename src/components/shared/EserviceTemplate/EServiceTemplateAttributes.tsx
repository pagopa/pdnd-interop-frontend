import type { DescriptorAttributes } from '@/api/api.generatedTypes'
import type { AttributeKey } from '@/types/attribute.types'
import type { ActionItemButton } from '@/types/common.types'
import { AttributeGroupContainer, SectionContainer } from '@/components/layout/containers'
import { useTranslation } from 'react-i18next'
import { AttributeGroupsListSection } from '../ReadOnlyDescriptorAttributes'
import { Divider } from '@mui/material'

type EServiceTemplateAttributesProps = {
  attributes: DescriptorAttributes
  readonly: boolean
  getAttributeSectionActions: (kind: AttributeKey) => Array<ActionItemButton> | undefined
}

export const EServiceTemplateAttributes: React.FC<EServiceTemplateAttributesProps> = ({
  attributes,
  readonly,
  getAttributeSectionActions,
}) => {
  const { t: tAttribute } = useTranslation('attribute')

  const noAttributes =
    attributes.declared.length === 0 &&
    attributes.certified.length === 0 &&
    attributes.verified.length === 0

  if (noAttributes)
    return (
      <SectionContainer
        title={tAttribute('noAttributesRequiredTemplate.title')}
        innerSection
        sx={{ p: 0 }}
      >
        <AttributeGroupContainer
          title={tAttribute('noAttributesRequiredTemplate.alert')}
          color="gray"
        />
      </SectionContainer>
    )

  return (
    <>
      <AttributeGroupsListSection
        attributeKey="certified"
        descriptorAttributes={attributes}
        topSideActions={readonly ? undefined : getAttributeSectionActions('certified')}
      />
      <Divider sx={{ my: 3 }} />
      <AttributeGroupsListSection
        attributeKey="verified"
        descriptorAttributes={attributes}
        topSideActions={readonly ? undefined : getAttributeSectionActions('verified')}
      />
      <Divider sx={{ my: 3 }} />
      <AttributeGroupsListSection
        attributeKey="declared"
        descriptorAttributes={attributes}
        topSideActions={readonly ? undefined : getAttributeSectionActions('declared')}
      />
    </>
  )
}
