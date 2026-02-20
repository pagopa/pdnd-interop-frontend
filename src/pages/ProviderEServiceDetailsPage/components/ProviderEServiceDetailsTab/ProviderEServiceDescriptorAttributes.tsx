import { EServiceMutations, EServiceQueries } from '@/api/eservice'
import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { AttributeGroupsListSection } from '@/components/shared/ReadOnlyDescriptorAttributes'
import { useParams } from '@/router'
import type { ActionItemButton } from '@/types/common.types'
import { Divider, Stack } from '@mui/material'
import { useSuspenseQuery } from '@tanstack/react-query'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import type { AttributeKey } from '@/types/attribute.types'
import { AuthHooks } from '@/api/auth'
import { useGetProducerDelegationUserRole } from '@/hooks/useGetProducerDelegationUserRole'
import { UpdateAttributesDrawer } from '@/components/shared/UpdateAttributesDrawer'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import { UpdateThresholdsDrawer } from '@/components/shared/UpdateThresholdsDrawer'

export const ProviderEServiceDescriptorAttributes: React.FC = () => {
  const { t } = useTranslation('eservice', { keyPrefix: 'read.sections.attributes' })
  const { t: tThresholdDrawer } = useTranslation('eservice', {
    keyPrefix: 'read.drawers.updateThresholdsDrawer',
  })
  const { jwt, isAdmin, isOperatorAPI } = AuthHooks.useJwt()

  const { eserviceId, descriptorId } = useParams<'PROVIDE_ESERVICE_MANAGE'>()

  const { data: descriptor } = useSuspenseQuery({
    ...EServiceQueries.getDescriptorProvider(eserviceId, descriptorId),
  })

  const descriptorAttributes = descriptor.attributes

  const isEserviceFromTemplate = Boolean(descriptor.templateRef)

  const { isDelegator } = useGetProducerDelegationUserRole({
    eserviceId,
    organizationId: jwt?.organizationId,
  })

  const [editAttributeDrawerState, setEditAttributeDrawerState] = useState<{
    kind: AttributeKey
    isOpen: boolean
  }>({ isOpen: false, kind: 'certified' })

  const [editThresholdsDrawerState, setEditThresholdsDrawerState] = useState<{
    isOpen: boolean
  }>({ isOpen: false })

  const getAttributeSectionActions = (kind: AttributeKey): Array<ActionItemButton> | undefined => {
    if (
      descriptorAttributes[kind].length === 0 ||
      isDelegator ||
      !(isAdmin || isOperatorAPI) ||
      isEserviceFromTemplate
    )
      return

    return [
      {
        action: () => setEditAttributeDrawerState({ kind, isOpen: true }),
        label: t('addAttributes'),
        icon: AddIcon,
      },
    ]
  }

  const getThresholdSectionActions = (): Array<ActionItemButton> | undefined => {
    return [
      {
        action: () => setEditThresholdsDrawerState({ isOpen: true }),
        label: t('modify'),
        icon: EditIcon,
      },
    ]
  }

  const { mutate: updateVersion } = EServiceMutations.useUpdateVersion(true)
  const { mutate: updateInstanceVersion } = EServiceMutations.useUpdateInstanceVersion(true)

  const handleUpdateThresholds = (
    id: string,
    dailyCallsPerConsumer: number,
    dailyCallsTotal: number,
    descriptorId?: string
  ) => {
    if (isEserviceFromTemplate) {
      updateInstanceVersion(
        {
          eserviceId: id,
          descriptorId: descriptorId!,
          dailyCallsPerConsumer,
          dailyCallsTotal,
        },
        { onSuccess: () => setEditThresholdsDrawerState({ isOpen: false }) }
      )
      return
    }
    updateVersion(
      {
        eserviceId: id,
        descriptorId: descriptorId!,
        voucherLifespan: descriptor.voucherLifespan,
        dailyCallsPerConsumer,
        dailyCallsTotal,
      },
      { onSuccess: () => setEditThresholdsDrawerState({ isOpen: false }) }
    )
  }

  return (
    <>
      <SectionContainer title={t('title')} description={t('description')}>
        <SectionContainer
          title={t('thresholds.title')}
          innerSection
          sx={{ p: 0 }}
          topSideActions={getThresholdSectionActions()}
        >
          <Stack spacing={1} mt={1} mb={3}>
            <InformationContainer
              label={t('thresholds.dailyCallsPerConsumer.label')}
              content={`${descriptor.dailyCallsPerConsumer}`}
            />
            <InformationContainer
              label={t('thresholds.dailyCallsTotal.label')}
              content={`${descriptor.dailyCallsTotal}`}
            />
          </Stack>
        </SectionContainer>
        <Divider sx={{ my: 3 }} />
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
      <UpdateAttributesDrawer
        isOpen={editAttributeDrawerState.isOpen}
        onClose={() => setEditAttributeDrawerState({ ...editAttributeDrawerState, isOpen: false })}
        attributeKey={editAttributeDrawerState.kind}
        attributes={descriptorAttributes}
        kind="ESERVICE"
      />
      <UpdateThresholdsDrawer
        isOpen={editThresholdsDrawerState.isOpen}
        onClose={() => setEditThresholdsDrawerState({ isOpen: false })}
        id={eserviceId}
        dailyCallsPerConsumer={descriptor.dailyCallsPerConsumer}
        dailyCallsTotal={descriptor.dailyCallsTotal}
        versionId={descriptorId}
        subtitle={tThresholdDrawer('subtitle')}
        dailyCallsPerConsumerLabel={tThresholdDrawer('dailyCallsPerConsumerField.label')}
        dailyCallsTotalLabel={tThresholdDrawer('dailyCallsTotalField.label')}
        onSubmit={handleUpdateThresholds}
      />
    </>
  )
}

export const ProviderEServiceDescriptorAttributesSkeleton: React.FC = () => {
  return <SectionContainerSkeleton height={1000} />
}
