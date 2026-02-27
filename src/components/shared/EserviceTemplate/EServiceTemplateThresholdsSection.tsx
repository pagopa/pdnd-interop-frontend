import { SectionContainer } from '@/components/layout/containers'
import React from 'react'
import { useTranslation } from 'react-i18next'
import EditIcon from '@mui/icons-material/Edit'
import { Stack } from '@mui/material'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import { formatThousands, secondsToMinutes } from '@/utils/format.utils'
import { useDrawerState } from '@/hooks/useDrawerState'
import { EServiceTemplateMutations } from '@/api/eserviceTemplate'
import { UpdateThresholdsVoucherDrawer } from '@/components/shared/UpdateThresholdsVoucherDrawer'
import type { EServiceTemplateVersionDetails } from '@/api/api.generatedTypes'
import { useParams } from '@/router'

type EServiceTemplateThresholdsSectionProps = {
  readonly: boolean
  eserviceTemplate: EServiceTemplateVersionDetails
}
export const EServiceTemplateThresholdsSection: React.FC<
  EServiceTemplateThresholdsSectionProps
> = ({ eserviceTemplate, readonly }) => {
  const { t } = useTranslation('eserviceTemplate', {
    keyPrefix: 'read.sections.technicalInformations',
  })
  const { t: tCommon } = useTranslation('common')
  const { t: tDrawer } = useTranslation('eserviceTemplate', {
    keyPrefix: 'read.drawers.updateEServiceTemplateThresholdsDrawer',
  })

  const voucherLifespan = secondsToMinutes(eserviceTemplate.voucherLifespan)

  const { eServiceTemplateVersionId } = useParams<'PROVIDE_ESERVICE_TEMPLATE_DETAILS'>()

  const { isOpen, openDrawer, closeDrawer } = useDrawerState()

  const onEdit = () => {
    openDrawer()
  }

  const { mutate: updateEserviceTemplateQuotas } = EServiceTemplateMutations.useUpdateQuotas()

  const handleThresholdsVoucherUpdate = (
    id: string,
    voucherLifespan: number,
    dailyCallsPerConsumer: number,
    dailyCallsTotal: number,
    versionId?: string
  ) => {
    updateEserviceTemplateQuotas(
      {
        eServiceTemplateId: id,
        eServiceTemplateVersionId: versionId!,
        voucherLifespan: voucherLifespan,
        dailyCallsPerConsumer: dailyCallsPerConsumer,
        dailyCallsTotal: dailyCallsTotal,
      },
      { onSuccess: closeDrawer }
    )
  }

  return (
    <>
      <SectionContainer
        innerSection
        title={t('thresholds.title')}
        topSideActions={
          readonly
            ? undefined
            : [
                {
                  action: onEdit,
                  label: tCommon('actions.edit'),
                  icon: EditIcon,
                },
              ]
        }
      >
        <Stack spacing={2}>
          <InformationContainer
            label={t('thresholds.voucherLifespan.label')}
            labelDescription={t('thresholds.voucherLifespan.labelDescription')}
            content={`${voucherLifespan} ${tCommon('time.minute', {
              count: voucherLifespan,
            })}`}
          />

          <InformationContainer
            label={t('thresholds.dailyCallsPerConsumer.label')}
            labelDescription={t('thresholds.dailyCallsPerConsumer.labelDescription')}
            content={
              eserviceTemplate.dailyCallsPerConsumer
                ? `${formatThousands(eserviceTemplate.dailyCallsPerConsumer)}`
                : ''
            }
          />

          <InformationContainer
            label={t('thresholds.dailyCallsTotal.label')}
            labelDescription={t('thresholds.dailyCallsTotal.labelDescription')}
            content={
              eserviceTemplate.dailyCallsTotal
                ? `${formatThousands(eserviceTemplate.dailyCallsTotal)}`
                : ''
            }
          />
        </Stack>
      </SectionContainer>
      <UpdateThresholdsVoucherDrawer
        isOpen={isOpen}
        onClose={closeDrawer}
        id={eserviceTemplate.eserviceTemplate.id}
        voucherLifespan={eserviceTemplate.voucherLifespan}
        dailyCallsPerConsumer={eserviceTemplate.dailyCallsPerConsumer}
        dailyCallsTotal={eserviceTemplate.dailyCallsTotal}
        versionId={eServiceTemplateVersionId}
        subtitle={tDrawer('subtitle')}
        dailyCallsPerConsumerLabel={tDrawer('dailyCallsPerConsumerLabel')}
        dailyCallsTotalLabel={tDrawer('dailyCallsTotalLabel')}
        onSubmit={handleThresholdsVoucherUpdate}
      />
    </>
  )
}
