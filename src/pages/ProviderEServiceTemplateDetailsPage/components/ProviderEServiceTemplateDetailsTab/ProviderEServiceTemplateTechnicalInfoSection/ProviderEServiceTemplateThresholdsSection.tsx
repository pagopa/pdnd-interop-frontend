import { SectionContainer } from '@/components/layout/containers'
import React from 'react'
import { useTranslation } from 'react-i18next'
import EditIcon from '@mui/icons-material/Edit'
import { Stack } from '@mui/material'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import { formatThousands, secondsToMinutes } from '@/utils/format.utils'
import { useDrawerState } from '@/hooks/useDrawerState'
import { AuthHooks } from '@/api/auth'
import { TemplateMutations } from '@/api/template'
import { UpdateThresholdsDrawer } from '@/components/shared/UpdateThresholdsDrawer'
import { EServiceTemplateVersionDetails } from '@/api/api.generatedTypes'
import { useParams } from '@/router'

type ProviderEServiceTemplateThresholdsSectionProps = {
  template: EServiceTemplateVersionDetails
}
export const ProviderEServiceThresholdsSection: React.FC<
  ProviderEServiceTemplateThresholdsSectionProps
> = ({ template }) => {
  const { t } = useTranslation('template', {
    keyPrefix: 'read.sections.technicalInformations',
  })
  const { t: tCommon } = useTranslation('common')
  const { t: tDrawer } = useTranslation('template', {
    keyPrefix: 'read.drawers.updateEServiceTemplateThresholdsDrawer',
  })

  const { jwt } = AuthHooks.useJwt() //TODO

  const voucherLifespan = secondsToMinutes(template.voucherLifespan)

  const { eServiceTemplateVersionId } = useParams<'PROVIDE_ESERVICE_TEMPLATE_DETAILS'>()

  const { isOpen, openDrawer, closeDrawer } = useDrawerState()

  const onEdit = () => {
    openDrawer()
  }

  const { mutate: updateEserviceTemplateQuotas } = TemplateMutations.useUpdateQuotas()

  const handleThresholdsUpdate = (
    id: string,
    versionId: string,
    voucherLifespan: number,
    dailyCallsPerConsumer: number,
    dailyCallsTotal: number
  ) => {
    updateEserviceTemplateQuotas(
      {
        eServiceTemplateId: id,
        eServiceTemplateVersionId: versionId,
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
        topSideActions={[
          {
            action: onEdit,
            label: tCommon('actions.edit'),
            icon: EditIcon,
          },
        ]} //TODO
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
              template.dailyCallsPerConsumer
                ? `${formatThousands(template.dailyCallsPerConsumer)}`
                : ''
            }
          />

          <InformationContainer
            label={t('thresholds.dailyCallsTotal.label')}
            labelDescription={t('thresholds.dailyCallsTotal.labelDescription')}
            content={template.dailyCallsTotal ? `${formatThousands(template.dailyCallsTotal)}` : ''}
          />
        </Stack>
      </SectionContainer>
      <UpdateThresholdsDrawer
        isOpen={isOpen}
        onClose={closeDrawer}
        id={template.id}
        voucherLifespan={template.voucherLifespan}
        dailyCallsPerConsumer={template.dailyCallsPerConsumer ?? 1} //TODO
        dailyCallsTotal={template.dailyCallsTotal ?? 1}
        versionId={eServiceTemplateVersionId}
        onSubmit={handleThresholdsUpdate}
        subtitle={tDrawer('subtitle')}
        dailyCallsPerConsumerLabel={tDrawer('dailyCallsPerConsumerLabel')}
        dailyCallsTotalLabel={tDrawer('dailyCallsTotalLabel')}
      />
    </>
  )
}
