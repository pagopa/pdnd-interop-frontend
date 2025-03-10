import { TemplateQueries } from '@/api/template'
import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { useParams } from '@/router'
import type { ActionItemButton } from '@/types/common.types'
import { Divider } from '@mui/material'
import { useSuspenseQuery } from '@tanstack/react-query'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import EditIcon from '@mui/icons-material/Edit'
import type { AttributeKey } from '@/types/attribute.types'
import { AuthHooks } from '@/api/auth'
import { AttributeGroupsListSection } from '@/components/shared/ReadOnlyDescriptorAttributes'
import { EServiceTemplateUpdateAttributesDrawer } from './EServiceTemplateUpdateAttributesDrawer'

type EServiceTemplateAttributesProps = {
  readonly: boolean
  routeKey: 'SUBSCRIBE_ESERVICE_TEMPLATE_DETAILS' | 'PROVIDE_ESERVICE_TEMPLATE_DETAILS'
}
export const EServiceTemplateAttributes: React.FC<EServiceTemplateAttributesProps> = ({
  routeKey,
  readonly,
}) => {
  const { t } = useTranslation('eservice', { keyPrefix: 'read.sections.attributes' })
  const { t: tCommon } = useTranslation('common')
  const { isAdmin } = AuthHooks.useJwt()

  const { eServiceTemplateId, eServiceTemplateVersionId } = useParams<typeof routeKey>()

  const { data: eserviceTemplateAttributes } = useSuspenseQuery({
    ...TemplateQueries.getSingle(eServiceTemplateId, eServiceTemplateVersionId),
    select: (d) => d.attributes,
  })

  const [editAttributeDrawerState, setEditAttributeDrawerState] = useState<{
    kind: AttributeKey
    isOpen: boolean
  }>({ isOpen: false, kind: 'certified' })

  const getAttributeSectionActions = (kind: AttributeKey): Array<ActionItemButton> | undefined => {
    if (eserviceTemplateAttributes[kind].length === 0 || !isAdmin) return

    return [
      {
        action: () => setEditAttributeDrawerState({ kind, isOpen: true }),
        label: tCommon('actions.edit'),
        icon: EditIcon,
      },
    ]
  }
  return (
    <>
      <SectionContainer title={t('title')} description={t('description')}>
        <AttributeGroupsListSection
          attributeKey="certified"
          descriptorAttributes={eserviceTemplateAttributes}
          topSideActions={readonly ? undefined : getAttributeSectionActions('certified')}
        />
        <Divider sx={{ my: 3 }} />
        <AttributeGroupsListSection
          attributeKey="verified"
          descriptorAttributes={eserviceTemplateAttributes}
          topSideActions={readonly ? undefined : getAttributeSectionActions('verified')}
        />
        <Divider sx={{ my: 3 }} />
        <AttributeGroupsListSection
          attributeKey="declared"
          descriptorAttributes={eserviceTemplateAttributes}
          topSideActions={readonly ? undefined : getAttributeSectionActions('declared')}
        />
      </SectionContainer>
      <EServiceTemplateUpdateAttributesDrawer
        isOpen={editAttributeDrawerState.isOpen}
        onClose={() => setEditAttributeDrawerState({ ...editAttributeDrawerState, isOpen: false })}
        attributeKey={editAttributeDrawerState.kind}
        attributes={eserviceTemplateAttributes}
      />
    </>
  )
}

export const EServiceTemplateAttributesSkeleton: React.FC = () => {
  return <SectionContainerSkeleton height={1000} />
}
