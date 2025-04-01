import type { ProducerEServiceDescriptor } from '@/api/api.generatedTypes'
import { SectionContainer } from '@/components/layout/containers'
import React from 'react'
import { useTranslation } from 'react-i18next'
import EditIcon from '@mui/icons-material/Edit'
import { Stack } from '@mui/material'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import { formatThousands, secondsToMinutes } from '@/utils/format.utils'
import { useDrawerState } from '@/hooks/useDrawerState'
import { AuthHooks } from '@/api/auth'
import { useGetProducerDelegationUserRole } from '@/hooks/useGetProducerDelegationUserRole'
import { EServiceMutations } from '@/api/eservice'
import { UpdateThresholdsDrawer } from '@/components/shared/UpdateThresholdsDrawer'

type ProviderEServiceThresholdsSectionProps = {
  descriptor: ProducerEServiceDescriptor
}

export const ProviderEServiceThresholdsSection: React.FC<
  ProviderEServiceThresholdsSectionProps
> = ({ descriptor }) => {
  const { t } = useTranslation('eservice', {
    keyPrefix: 'read.sections.technicalInformations',
  })
  const { t: tCommon } = useTranslation('common')
  const { t: tDrawer } = useTranslation('eservice', {
    keyPrefix: 'read.drawers.updateThresholdsDrawer',
  })

  const { jwt } = AuthHooks.useJwt()

  const { isDelegator } = useGetProducerDelegationUserRole({
    eserviceId: descriptor.eservice.id,
    organizationId: jwt?.organizationId,
  })

  const voucherLifespan = secondsToMinutes(descriptor.voucherLifespan)

  const { isOpen, openDrawer, closeDrawer } = useDrawerState()
  const isEserviceFromTemplate = Boolean(descriptor?.templateRef)

  const onEdit = () => {
    openDrawer()
  }

  const { mutate: updateVersion } = EServiceMutations.useUpdateVersion()
  const { mutate: updateInstanceVersion } = EServiceMutations.useUpdateInstanceVersion()

  const handleThresholdsUpdate = (
    id: string,
    voucherLifespan: number,
    dailyCallsPerConsumer: number,
    dailyCallsTotal: number,
    descriptorId?: string
  ) => {
    if (isEserviceFromTemplate) {
      updateInstanceVersion(
        {
          eserviceId: id,
          descriptorId: descriptorId!,
          dailyCallsPerConsumer: dailyCallsPerConsumer,
          dailyCallsTotal: dailyCallsTotal,
        },
        { onSuccess: closeDrawer }
      )
      return
    }
    updateVersion(
      {
        eserviceId: id,
        descriptorId: descriptorId!,
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
          isDelegator
            ? []
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
            content={`${formatThousands(descriptor.dailyCallsPerConsumer)}`}
          />

          <InformationContainer
            label={t('thresholds.dailyCallsTotal.label')}
            labelDescription={t('thresholds.dailyCallsTotal.labelDescription')}
            content={`${formatThousands(descriptor.dailyCallsTotal)}`}
          />
        </Stack>
      </SectionContainer>
      <UpdateThresholdsDrawer
        isOpen={isOpen}
        onClose={closeDrawer}
        id={descriptor.eservice.id}
        versionId={descriptor.id}
        voucherLifespan={descriptor.voucherLifespan}
        dailyCallsPerConsumer={descriptor.dailyCallsPerConsumer}
        dailyCallsTotal={descriptor.dailyCallsTotal}
        subtitle={tDrawer('subtitle')}
        dailyCallsPerConsumerLabel={tDrawer('dailyCallsPerConsumerField.label')}
        dailyCallsTotalLabel={tDrawer('dailyCallsTotalField.label')}
        onSubmit={handleThresholdsUpdate}
        isEserviceFromTemplate={isEserviceFromTemplate}
      />
    </>
  )
}
