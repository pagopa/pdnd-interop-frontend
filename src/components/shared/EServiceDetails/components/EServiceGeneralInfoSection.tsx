import { SectionContainer } from '@/components/layout/containers'
import { Link, useCurrentRoute } from '@/router'
import { Stack } from '@mui/material'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useEServiceDetailsContext } from '../EServiceDetailsContext'
import { AuthHooks } from '@/api/auth'
import type { CatalogEServiceDescriptor } from '@/api/api.generatedTypes'

export const EServiceGeneralInfoSection: React.FC = () => {
  const { t } = useTranslation('eservice', {
    keyPrefix: 'read.sections.generalInformations',
  })

  const { descriptor } = useEServiceDetailsContext()
  const { mode } = useCurrentRoute()

  if (!descriptor) return null

  return (
    <SectionContainer newDesign title={t('title')}>
      <Stack spacing={2}>
        {mode === 'consumer' && (
          <InformationContainer
            label={t('producer.label')}
            content={(descriptor as CatalogEServiceDescriptor).eservice.producer.name}
          />
        )}
        <InformationContainer
          label={t('eserviceDescription.label')}
          content={descriptor.eservice.description}
          direction="column"
        />
        <InformationContainer
          label={t('descriptorDescription.label')}
          content={descriptor.description ?? ''}
          direction="column"
        />
      </Stack>
    </SectionContainer>
  )
}
