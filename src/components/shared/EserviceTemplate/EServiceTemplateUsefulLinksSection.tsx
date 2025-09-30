import { SectionContainer } from '@/components/layout/containers'
import { IconLink } from '@/components/shared/IconLink'
import { WELL_KNOWN_URLS } from '@/config/env'
import { Stack } from '@mui/material'
import React from 'react'
import LaunchIcon from '@mui/icons-material/Launch'
import { useTranslation } from 'react-i18next'

export const EServiceTemplateUsefulLinksSection: React.FC = () => {
  const { t } = useTranslation('eserviceTemplate', {
    keyPrefix: 'read.sections.technicalInformations',
  })

  return (
    <SectionContainer innerSection title={t('usefulLinks.title')}>
      <Stack alignItems="start" mt={1} spacing={0.5}>
        <IconLink
          href="" //TODO: Link not yet available
          target="_blank"
          startIcon={<LaunchIcon fontSize="small" />}
        >
          {t('usefulLinks.implementAndManageEServiceTemplate')}
        </IconLink>
        <IconLink
          href="" //TODO: Link not yet available
          target="_blank"
          startIcon={<LaunchIcon fontSize="small" />}
        >
          {t('usefulLinks.updateEserviceInstance')}
        </IconLink>
        <IconLink
          href={WELL_KNOWN_URLS[0]}
          target="_blank"
          startIcon={<LaunchIcon fontSize="small" />}
        >
          {t('usefulLinks.wellKnown')}
        </IconLink>
      </Stack>
    </SectionContainer>
  )
}
