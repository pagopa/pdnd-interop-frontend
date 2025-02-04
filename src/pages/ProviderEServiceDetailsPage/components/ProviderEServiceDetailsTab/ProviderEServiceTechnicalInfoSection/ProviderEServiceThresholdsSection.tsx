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
import { useGetDelegationUserRole } from '@/hooks/useGetDelegationUserRole'
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

  const { jwt } = AuthHooks.useJwt()

  const { isDelegator } = useGetDelegationUserRole({
    eserviceId: descriptor.eservice.id,
    organizationId: jwt?.organizationId,
  })

  const voucherLifespan = secondsToMinutes(descriptor.voucherLifespan)

  const { isOpen, openDrawer, closeDrawer } = useDrawerState()

  const onEdit = () => {
    openDrawer()
  }

  const { mutate: updateVersion } = EServiceMutations.useUpdateVersion()

  const handleThresholdsUpdate = (
    id: string,
    voucherLifespan: number,
    dailyCallsPerConsumer: number,
    dailyCallsTotal: number,
    descriptorId?: string
  ) => {
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
        descriptorId={descriptor.id}
        voucherLifespan={descriptor.voucherLifespan}
        dailyCallsPerConsumer={descriptor.dailyCallsPerConsumer}
        dailyCallsTotal={descriptor.dailyCallsTotal}
        onSubmit={handleThresholdsUpdate}
      />
    </>
  )
}
