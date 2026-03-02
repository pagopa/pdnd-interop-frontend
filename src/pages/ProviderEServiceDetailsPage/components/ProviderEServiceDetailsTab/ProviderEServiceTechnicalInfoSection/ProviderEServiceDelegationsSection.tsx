import type { ProducerEServiceDescriptor } from '@/api/api.generatedTypes'
import { SectionContainer } from '@/components/layout/containers'
import { useDrawerState } from '@/hooks/useDrawerState'
import { Stack } from '@mui/system'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import React from 'react'
import { useTranslation } from 'react-i18next'
import EditIcon from '@mui/icons-material/Edit'
import { ProviderEServiceUpdateDelegationFlagsDrawer } from './ProviderEServiceUpdateDelegationFlagsDrawer'

type ProviderEServiceDelegationsSectionProps = {
  descriptor: ProducerEServiceDescriptor
}

export const ProviderEServiceDelegationsSection: React.FC<
  ProviderEServiceDelegationsSectionProps
> = ({ descriptor }) => {
  const { t } = useTranslation('eservice', {
    keyPrefix: 'read.sections.technicalInformations.delegationSection',
  })
  const { t: tCommon } = useTranslation('common')

  const { isOpen, openDrawer, closeDrawer } = useDrawerState()

  const onEdit = () => {
    openDrawer()
  }

  const isConsumerDelegable = descriptor.eservice.isConsumerDelegable
  const isClientAccessDelegable = descriptor.eservice.isClientAccessDelegable

  return (
    <>
      <SectionContainer
        innerSection
        title={t('title')}
        topSideActions={[
          {
            action: onEdit,
            label: tCommon('actions.edit'),
            icon: EditIcon,
          },
        ]}
      >
        <Stack spacing={2}>
          <InformationContainer
            label={t('isConsumerDelegable.label')}
            content={t(`isConsumerDelegable.value.${isConsumerDelegable}`)}
          />
          <InformationContainer
            label={t('isClientAccessDelegable.label')}
            content={t(`isClientAccessDelegable.value.${isClientAccessDelegable}`)}
          />
        </Stack>
      </SectionContainer>
      <ProviderEServiceUpdateDelegationFlagsDrawer
        isOpen={isOpen}
        onClose={closeDrawer}
        descriptor={descriptor}
      />
    </>
  )
}
