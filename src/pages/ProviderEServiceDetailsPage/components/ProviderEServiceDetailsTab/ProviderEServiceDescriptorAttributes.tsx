import { EServiceMutations, EServiceQueries } from '@/api/eservice'
import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { AttributeGroupsListSection } from '@/components/shared/ReadOnlyDescriptorAttributes'
import { useParams } from '@/router'
import type { ActionItemButton } from '@/types/common.types'
import { Divider, Stack, Typography } from '@mui/material'
import { useSuspenseQuery } from '@tanstack/react-query'
import React, { useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import type { AttributeKey } from '@/types/attribute.types'
import { AuthHooks } from '@/api/auth'
import { useGetProducerDelegationUserRole } from '@/hooks/useGetProducerDelegationUserRole'
import { UpdateAttributesDrawer } from '@/components/shared/UpdateAttributesDrawer'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import { UpdateDailyCallsDrawer } from '@/components/shared/UpdateDailyCallsDrawer'
import {
  CustomizeThresholdDrawer,
  useCustomizeThresholdDrawer,
} from '@/components/shared/CustomizeThresholdDrawer'
import cloneDeep from 'lodash/cloneDeep'
import type { DescriptorAttributes, UpdateEServiceDescriptorSeed } from '@/api/api.generatedTypes'
import { remapDescriptorAttributesToDescriptorAttributesSeed } from '@/utils/attribute.utils'

export const ProviderEServiceDescriptorAttributes: React.FC = () => {
  const { t } = useTranslation('eservice', { keyPrefix: 'read.sections.attributes' })
  const { t: tDailyCallsDrawer } = useTranslation('eservice', {
    keyPrefix: 'read.drawers.updateDailyCallsDrawer',
  })
  const { t: tCustomizeThresholdDrawer } = useTranslation('eservice', {
    keyPrefix: 'read.drawers.customizeThresholdDrawer',
  })
  const { jwt, isAdmin, isOperatorAPI } = AuthHooks.useJwt()

  const { eserviceId, descriptorId } = useParams<'PROVIDE_ESERVICE_MANAGE'>()

  const { data: descriptor } = useSuspenseQuery({
    ...EServiceQueries.getDescriptorProvider(eserviceId, descriptorId),
  })

  const descriptorAttributes = descriptor.attributes

  const { attribute, attributeGroupIndex } = useCustomizeThresholdDrawer()

  const isEserviceFromTemplate = Boolean(descriptor.templateRef)

  const { isDelegator } = useGetProducerDelegationUserRole({
    eserviceId,
    organizationId: jwt?.organizationId,
  })

  const [editAttributeDrawerState, setEditAttributeDrawerState] = useState<{
    kind: AttributeKey
    isOpen: boolean
  }>({ isOpen: false, kind: 'certified' })

  const [editDailyCallsDrawerState, setEditDailyCallsDrawerState] = useState<{
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
        action: () => setEditDailyCallsDrawerState({ isOpen: true }),
        label: t('modify'),
        icon: EditIcon,
      },
    ]
  }

  const { mutate: updateVersion } = EServiceMutations.useUpdateVersion(true)
  const { mutate: updateInstanceVersion } = EServiceMutations.useUpdateInstanceVersion(true)
  const { mutate: updateVersionDraft } = EServiceMutations.useUpdateVersionDraft(
    { suppressSuccessToast: false },
    true
  )

  const handleUpdateDailyCalls = (
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
        { onSuccess: () => setEditDailyCallsDrawerState({ isOpen: false }) }
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
      { onSuccess: () => setEditDailyCallsDrawerState({ isOpen: false }) }
    )
  }

  const handleUpdateCertifiedAttributeThreshold = (threshold: number) => {
    if (!attribute || attributeGroupIndex === undefined || !descriptor) return

    const updatedAttributes: DescriptorAttributes = cloneDeep(descriptor.attributes)

    updatedAttributes.certified[attributeGroupIndex] = updatedAttributes.certified[
      attributeGroupIndex
    ].map((att) => (att.id === attribute.id ? { ...att, dailyCallsPerConsumer: threshold } : att))

    const payload: UpdateEServiceDescriptorSeed & { eserviceId: string; descriptorId: string } = {
      audience: descriptor.audience,
      voucherLifespan: descriptor.voucherLifespan,
      dailyCallsPerConsumer: descriptor.dailyCallsPerConsumer,
      dailyCallsTotal: descriptor.dailyCallsTotal,
      agreementApprovalPolicy: descriptor.agreementApprovalPolicy,
      description: descriptor.description,
      attributes: remapDescriptorAttributesToDescriptorAttributesSeed(updatedAttributes),
      eserviceId: descriptor.eservice.id,
      descriptorId: descriptor.id,
    }

    updateVersionDraft(payload, {
      onSuccess: () => useCustomizeThresholdDrawer.getState().close(),
    })
  }

  const customizeThresholdDrawerSubtitle = (
    <Trans
      ns="eservice"
      i18nKey="read.drawers.customizeThresholdDrawer.subtitle"
      values={{ name: attribute?.name }}
      components={{ 1: <strong /> }}
    />
  )

  const currentConsumerThreshold = (
    <Typography variant="body2" sx={{ mb: 4, mt: 0 }}>
      <Trans
        ns="eservice"
        i18nKey="read.drawers.customizeThresholdDrawer.consumerThreshold"
        values={{ dailyCallsPerConsumer: attribute?.dailyCallsPerConsumer }}
        components={{ 1: <strong /> }}
      />
    </Typography>
  )

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
          withThreshold
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
      <UpdateDailyCallsDrawer
        isOpen={editDailyCallsDrawerState.isOpen}
        onClose={() => setEditDailyCallsDrawerState({ isOpen: false })}
        id={eserviceId}
        dailyCallsPerConsumer={descriptor.dailyCallsPerConsumer}
        dailyCallsTotal={descriptor.dailyCallsTotal}
        versionId={descriptorId}
        subtitle={tDailyCallsDrawer('subtitle')}
        dailyCallsPerConsumerLabel={tDailyCallsDrawer('dailyCallsPerConsumerField.label')}
        dailyCallsTotalLabel={tDailyCallsDrawer('dailyCallsTotalField.label')}
        onSubmit={handleUpdateDailyCalls}
      />
      <CustomizeThresholdDrawer
        dailyCallsTotal={descriptor.dailyCallsTotal}
        dailyCallsPerConsumer={descriptor.dailyCallsPerConsumer}
        onSubmit={(threshold) => handleUpdateCertifiedAttributeThreshold(threshold)}
        title={tCustomizeThresholdDrawer('title')}
        subtitle={customizeThresholdDrawerSubtitle}
        alertLabel={tCustomizeThresholdDrawer('alert')}
        submitButtonLabel={tCustomizeThresholdDrawer('submitBtnLabel')}
        currentConsumerThreshold={currentConsumerThreshold}
      />
    </>
  )
}

export const ProviderEServiceDescriptorAttributesSkeleton: React.FC = () => {
  return <SectionContainerSkeleton height={1000} />
}
