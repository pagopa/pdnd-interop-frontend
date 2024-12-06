import { EServiceQueries } from '@/api/eservice'
import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { AttributeGroupsListSection } from '@/components/shared/ReadOnlyDescriptorAttributes'
import { useParams } from '@/router'
import type { ActionItemButton } from '@/types/common.types'
import { Divider } from '@mui/material'
import { useSuspenseQuery } from '@tanstack/react-query'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import EditIcon from '@mui/icons-material/Edit'
import type { AttributeKey } from '@/types/attribute.types'
import { ProviderEServiceUpdateDescriptorAttributesDrawer } from './ProviderEServiceUpdateDescriptorAttributesDrawer'

export const ProviderEServiceDescriptorAttributes: React.FC = () => {
  const { t } = useTranslation('eservice', { keyPrefix: 'read.sections.attributes' })
  const { t: tCommon } = useTranslation('common')

  const { eserviceId, descriptorId } = useParams<'PROVIDE_ESERVICE_MANAGE'>()
  const { data: descriptorAttributes } = useSuspenseQuery({
    ...EServiceQueries.getDescriptorProvider(eserviceId, descriptorId),
    select: (d) => d.attributes,
  })

  const [editAttributeDrawerState, setEditAttributeDrawerState] = useState<{
    kind: AttributeKey
    isOpen: boolean
  }>({ isOpen: false, kind: 'certified' })

  const getAttributeSectionActions = (kind: AttributeKey): Array<ActionItemButton> | undefined => {
    if (descriptorAttributes[kind].length === 0) return

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
          descriptorAttributes={descriptorAttributes}
          topSideActions={getAttributeSectionActions('certified')}
        />
        <Divider sx={{ my: 3 }} />
        <AttributeGroupsListSection
          attributeKey="verified"
          descriptorAttributes={descriptorAttributes}
          topSideActions={getAttributeSectionActions('verified')}
        />
        <Divider sx={{ my: 3 }} />
        <AttributeGroupsListSection
          attributeKey="declared"
          descriptorAttributes={descriptorAttributes}
          topSideActions={getAttributeSectionActions('declared')}
        />
      </SectionContainer>
      <ProviderEServiceUpdateDescriptorAttributesDrawer
        isOpen={editAttributeDrawerState.isOpen}
        onClose={() => setEditAttributeDrawerState({ ...editAttributeDrawerState, isOpen: false })}
        attributeKey={editAttributeDrawerState.kind}
        descriptorAttributes={descriptorAttributes}
      />
    </>
  )
}

export const ProviderEServiceDescriptorAttributesSkeleton: React.FC = () => {
  return <SectionContainerSkeleton height={1000} />
}
