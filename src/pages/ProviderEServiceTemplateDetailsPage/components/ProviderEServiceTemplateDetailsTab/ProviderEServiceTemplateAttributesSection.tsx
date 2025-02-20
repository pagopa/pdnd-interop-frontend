import { TemplateQueries } from '@/api/template'
import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { useParams } from '@/router'
import type { ActionItemButton } from '@/types/common.types'
import { Divider } from '@mui/material'
import { useQuery, useSuspenseQuery } from '@tanstack/react-query'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import EditIcon from '@mui/icons-material/Edit'
import type { AttributeKey } from '@/types/attribute.types'
import { AuthHooks } from '@/api/auth'
import { AttributeGroupsListSection } from '@/components/shared/ReadOnlyDescriptorAttributes'
import { ProviderEServiceTemplateUpdateAttributesDrawer } from './ProviderEServiceTemplateUpdateAttributesDrawer'

export const ProviderEServiceTemplateAttributes: React.FC = () => {
  const { t } = useTranslation('eservice', { keyPrefix: 'read.sections.attributes' })
  const { t: tCommon } = useTranslation('common')
  const { jwt, isAdmin } = AuthHooks.useJwt()

  const { eServiceTemplateId, eServiceTemplateVersionId } =
    useParams<'PROVIDE_ESERVICE_TEMPLATE_DETAILS'>()

  const { data: eserviceTemplateAttributes } = useSuspenseQuery({
    ...TemplateQueries.getSingle(eServiceTemplateId, eServiceTemplateVersionId),
    select: (d) => d.attributes,
  })

  console.log('eserviceTemplateAttributes', eserviceTemplateAttributes)

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
          topSideActions={getAttributeSectionActions('certified')}
        />
        <Divider sx={{ my: 3 }} />
        <AttributeGroupsListSection
          attributeKey="verified"
          descriptorAttributes={eserviceTemplateAttributes}
          topSideActions={getAttributeSectionActions('verified')}
        />
        <Divider sx={{ my: 3 }} />
        <AttributeGroupsListSection
          attributeKey="declared"
          descriptorAttributes={eserviceTemplateAttributes}
          topSideActions={getAttributeSectionActions('declared')}
        />
      </SectionContainer>
      <ProviderEServiceTemplateUpdateAttributesDrawer
        isOpen={editAttributeDrawerState.isOpen}
        onClose={() => setEditAttributeDrawerState({ ...editAttributeDrawerState, isOpen: false })}
        attributeKey={editAttributeDrawerState.kind}
        attributes={eserviceTemplateAttributes}
      />
    </>
  )
}

export const ProviderEServiceTemplateAttributesSkeleton: React.FC = () => {
  return <SectionContainerSkeleton height={1000} />
}
