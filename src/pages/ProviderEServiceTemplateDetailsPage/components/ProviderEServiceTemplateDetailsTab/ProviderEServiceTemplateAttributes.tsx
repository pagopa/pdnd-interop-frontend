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
import { EServiceQueries } from '@/api/eservice'

export const ProviderEServiceTemplateAttributes: React.FC = () => {
  const { t } = useTranslation('eservice', { keyPrefix: 'read.sections.attributes' })
  const { t: tCommon } = useTranslation('common')
  const { jwt, isAdmin } = AuthHooks.useJwt()

  const { eserviceTemplateId } = useParams<'PROVIDE_ESERVICE_TEMPLATE_DETAILS'>()
  /* const { data: templateAttributes } = useSuspenseQuery({ //TODO
    TemplateQueries.getSingle(eserviceTemplateId),
    //select: (d) => d.attributes,
  })*/

  /*const { data: descriptorAttributes } = useSuspenseQuery({
    //TODO DA TOGLIERE
    ...EServiceQueries.getDescriptorProvider(
      '98a7e77e-7919-4120-a94a-4addf40b9089',
      '84383096-1153-410d-a9e3-aa957449bfc9'
    ),
    select: (d) => d.attributes,
  })*/

  const { data: template } = useQuery(TemplateQueries.getSingle(eserviceTemplateId))

  const [editAttributeDrawerState, setEditAttributeDrawerState] = useState<{
    kind: AttributeKey
    isOpen: boolean
  }>({ isOpen: false, kind: 'certified' })

  const getAttributeSectionActions = (kind: AttributeKey): Array<ActionItemButton> | undefined => {
    // TODO
    //if (descriptorAttributes[kind].length === 0 || !isAdmin) return

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
        {/* <AttributeGroupsListSection
          attributeKey="certified"
          descriptorAttributes={} //TODO
          topSideActions={getAttributeSectionActions('certified')}        />
        <Divider sx={{ my: 3 }} />
        <AttributeGroupsListSection
          attributeKey="verified"
          descriptorAttributes={descriptorAttributes} //TODO
          topSideActions={getAttributeSectionActions('verified')}
        />
        <Divider sx={{ my: 3 }} />
        <AttributeGroupsListSection
          attributeKey="declared"
          descriptorAttributes={descriptorAttributes} //TODO
          topSideActions={getAttributeSectionActions('declared')}
  />*/}
        TODO
      </SectionContainer>
      {/*<ProviderEServiceUpdateTemplateAttributesDrawer
        isOpen={editAttributeDrawerState.isOpen}
        onClose={() => setEditAttributeDrawerState({ ...editAttributeDrawerState, isOpen: false })}
        attributeKey={editAttributeDrawerState.kind}
        templateAttributes={template?.attributes}
  />*/}
    </>
  )
}

export const ProviderEServiceTemplateAttributesSkeleton: React.FC = () => {
  return <SectionContainerSkeleton height={1000} />
}
