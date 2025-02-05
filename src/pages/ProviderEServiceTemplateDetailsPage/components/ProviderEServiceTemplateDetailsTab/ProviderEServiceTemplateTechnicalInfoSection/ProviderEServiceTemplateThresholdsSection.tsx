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

type ProviderEServiceTemplateThresholdsSectionProps = {
  template: //ProducerEServiceTemplate TODO
  {
    id: string
    name: string
    versions: [
      {
        id: string
        version: string
        description: string
        state: string
        voucherLifespan: number
        dailyCallsPerConsumer: number
        dailyCallsTotal: number
        //attributes: EServiceAttributes,
      },
    ]
    state: string
    eserviceDescription: string
    audienceDescription: string
    creatorId: string
    technology: string
    mode: string
    isSignalHubEnabled: boolean
    attributes: [
      {
        certified: ['']
        verified: ['']
        declared: ['']
      },
    ]
  }
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

  const { jwt } = AuthHooks.useJwt()

  const voucherLifespan = secondsToMinutes(template.versions[0].voucherLifespan) //TODO

  const { isOpen, openDrawer, closeDrawer } = useDrawerState()

  const onEdit = () => {
    openDrawer()
  }

  const { mutate: updateEserviceTemplateQuotas } = TemplateMutations.useUpdateQuotas()

  const handleThresholdsUpdate = (
    id: string,
    voucherLifespan: number,
    dailyCallsPerConsumer: number,
    dailyCallsTotal: number
  ) => {
    updateEserviceTemplateQuotas(
      {
        eserviceTemplateId: id,
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
            content={`${formatThousands(template.versions[0].dailyCallsPerConsumer)}`}
          />

          <InformationContainer
            label={t('thresholds.dailyCallsTotal.label')}
            labelDescription={t('thresholds.dailyCallsTotal.labelDescription')}
            content={`${formatThousands(template.versions[0].dailyCallsTotal)}`}
          />
        </Stack>
      </SectionContainer>
      <UpdateThresholdsDrawer
        isOpen={isOpen}
        onClose={closeDrawer}
        id={template.id}
        voucherLifespan={template.versions[0].voucherLifespan}
        dailyCallsPerConsumer={template.versions[0].dailyCallsPerConsumer}
        dailyCallsTotal={template.versions[0].dailyCallsTotal}
        onSubmit={handleThresholdsUpdate}
        subtitle={tDrawer('subtitle')}
        dailyCallsPerConsumerLabel={tDrawer('dailyCallsPerConsumerLabel')}
        dailyCallsTotalLabel={tDrawer('dailyCallsTotalLabel')}
      />
    </>
  )
}
