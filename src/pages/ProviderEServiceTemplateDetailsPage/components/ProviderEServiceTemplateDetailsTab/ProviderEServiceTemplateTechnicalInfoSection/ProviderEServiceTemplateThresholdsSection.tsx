import { SectionContainer } from '@/components/layout/containers'
import React from 'react'
import { useTranslation } from 'react-i18next'
import EditIcon from '@mui/icons-material/Edit'
import { Stack } from '@mui/material'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import { formatThousands, secondsToMinutes } from '@/utils/format.utils'
import { useDrawerState } from '@/hooks/useDrawerState'
import { AuthHooks } from '@/api/auth'

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

  const { jwt } = AuthHooks.useJwt()

  const voucherLifespan = secondsToMinutes(template.versions[0].voucherLifespan) //TODO

  const { isOpen, openDrawer, closeDrawer } = useDrawerState()

  const onEdit = () => {
    openDrawer()
  }

  return (
    <>
      <SectionContainer
        innerSection
        title={t('thresholds.title')}
        topSideActions={['']} //TODO
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
      {/*<ProviderEServiceUpdateThresholdsDrawer
        isOpen={isOpen}
        onClose={closeDrawer}
        template={template}
        />*/}
    </>
  )
}
