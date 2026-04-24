import { SectionContainer } from '@/components/layout/containers'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import EditIcon from '@mui/icons-material/Edit'
import AddIcon from '@mui/icons-material/Add'
import { Divider, Stack } from '@mui/material'
import { formatThousands } from '@/utils/format.utils'
import { useDrawerState } from '@/hooks/useDrawerState'
import { EServiceTemplateMutations } from '@/api/eserviceTemplate'
import { UpdateDailyCallsDrawer } from '@/components/shared/UpdateDailyCallsDrawer'
import { useParams } from '@/router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { EServiceTemplateQueries } from '@/api/eserviceTemplate'
import type { AttributeKey } from '@/types/attribute.types'
import type { ActionItemButton } from '@/types/common.types'
import { AuthHooks } from '@/api/auth'
import { UpdateAttributesDrawer } from '@/components/shared/UpdateAttributesDrawer'
import { EServiceTemplateThresholds } from '@/components/shared/EserviceTemplate/EServiceTemplateThresholds'
import { EServiceTemplateAttributes } from '@/components/shared/EserviceTemplate/EServiceTemplateAttributes'

type EServiceTemplateThresholdsAndAttributesSectionProps = {
  readonly: boolean
  routeKey: 'SUBSCRIBE_ESERVICE_TEMPLATE_DETAILS' | 'PROVIDE_ESERVICE_TEMPLATE_DETAILS'
}
export const EServiceTemplateThresholdsAndAttributesSection: React.FC<
  EServiceTemplateThresholdsAndAttributesSectionProps
> = ({ readonly, routeKey }) => {
  const { t } = useTranslation('eserviceTemplate', {
    keyPrefix: 'read.sections.thresholdsAndAttributes',
  })
  const { t: tCommon } = useTranslation('common')
  const { t: tEServiceAttributes } = useTranslation('eservice', {
    keyPrefix: 'read.sections.attributes',
  })

  const { t: tDrawer } = useTranslation('eservice', {
    keyPrefix: 'read.drawers.updateDailyCallsDrawer',
  })
  const { isAdmin } = AuthHooks.useJwt()

  const { eServiceTemplateId, eServiceTemplateVersionId } = useParams<typeof routeKey>()

  const { data: eserviceTemplate } = useSuspenseQuery(
    EServiceTemplateQueries.getSingle(eServiceTemplateId, eServiceTemplateVersionId)
  )

  const { isOpen, openDrawer, closeDrawer } = useDrawerState()

  const { mutate: updateEserviceTemplateQuotas } = EServiceTemplateMutations.useUpdateQuotas()

  const handleDailyCallsUpdate = (
    id: string,
    dailyCallsPerConsumer: number,
    dailyCallsTotal: number,
    versionId?: string
  ) => {
    updateEserviceTemplateQuotas(
      {
        eServiceTemplateId: id,
        eServiceTemplateVersionId: versionId!,
        voucherLifespan: eserviceTemplate.voucherLifespan,
        dailyCallsPerConsumer: dailyCallsPerConsumer,
        dailyCallsTotal: dailyCallsTotal,
      },
      { onSuccess: closeDrawer }
    )
  }

  const [editAttributeDrawerState, setEditAttributeDrawerState] = useState<{
    kind: AttributeKey
    isOpen: boolean
  }>({ isOpen: false, kind: 'certified' })

  const getAttributeSectionActions = (kind: AttributeKey): Array<ActionItemButton> | undefined => {
    if (eserviceTemplate.attributes[kind].length === 0 || !isAdmin) return

    return [
      {
        action: () => setEditAttributeDrawerState({ kind, isOpen: true }),
        label: tEServiceAttributes('addAttributes'),
        icon: AddIcon,
      },
    ]
  }

  return (
    <>
      <SectionContainer title={t('title')} description={t('description')}>
        <SectionContainer
          innerSection
          title={t('thresholds.title')}
          topSideActions={
            readonly
              ? undefined
              : [
                  {
                    action: openDrawer,
                    label: tCommon('actions.edit'),
                    icon: EditIcon,
                  },
                ]
          }
        >
          <Stack spacing={2}>
            <EServiceTemplateThresholds
              dailyCallsTotal={
                eserviceTemplate.dailyCallsTotal
                  ? `${formatThousands(eserviceTemplate.dailyCallsTotal)}`
                  : undefined
              }
              dailyCallsPerConsumer={
                eserviceTemplate.dailyCallsPerConsumer
                  ? `${eserviceTemplate.dailyCallsPerConsumer}`
                  : undefined
              }
              emptyMessage={t('noThresholds')}
              dailyCallsTotalLabel={t('thresholds.dailyCallsTotal.label')}
              dailyCallsPerConsumerLabel={t('thresholds.dailyCallsPerConsumer.label')}
            />
          </Stack>
        </SectionContainer>
        <Divider sx={{ my: 3 }} />
        <EServiceTemplateAttributes
          attributes={eserviceTemplate.attributes}
          readonly={readonly}
          getAttributeSectionActions={getAttributeSectionActions}
        />
      </SectionContainer>
      <UpdateDailyCallsDrawer
        isOpen={isOpen}
        onClose={closeDrawer}
        id={eserviceTemplate.eserviceTemplate.id}
        dailyCallsPerConsumer={eserviceTemplate.dailyCallsPerConsumer}
        dailyCallsTotal={eserviceTemplate.dailyCallsTotal}
        versionId={eServiceTemplateVersionId}
        subtitle={tDrawer('subtitle')}
        dailyCallsPerConsumerLabel={tDrawer('dailyCallsPerConsumerField.label')}
        dailyCallsTotalLabel={tDrawer('dailyCallsTotalField.label')}
        onSubmit={handleDailyCallsUpdate}
      />
      <UpdateAttributesDrawer
        isOpen={editAttributeDrawerState.isOpen}
        onClose={() => setEditAttributeDrawerState({ ...editAttributeDrawerState, isOpen: false })}
        attributeKey={editAttributeDrawerState.kind}
        attributes={eserviceTemplate.attributes}
        kind="ESERVICE_TEMPLATE"
      />
    </>
  )
}
