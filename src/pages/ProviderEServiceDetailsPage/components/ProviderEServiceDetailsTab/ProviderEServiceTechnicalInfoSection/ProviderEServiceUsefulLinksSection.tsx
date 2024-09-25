import { SectionContainer } from '@/components/layout/containers'
import { IconLink } from '@/components/shared/IconLink'
import {
  implementAndManageEServiceGuideLink,
  voucherVerificationGuideLink,
} from '@/config/constants'
import { WELL_KNOWN_URLS } from '@/config/env'
import { Stack } from '@mui/material'
import React from 'react'
import LaunchIcon from '@mui/icons-material/Launch'
import { useTranslation } from 'react-i18next'

export const ProviderEServiceUsefulLinksSection: React.FC = () => {
  const { t } = useTranslation('eservice', {
    keyPrefix: 'read.sections.technicalInformations',
  })

  return (
    <SectionContainer innerSection title={t('usefulLinks.title')}>
      <Stack alignItems="start" mt={1} spacing={0.5}>
        <IconLink
          href={implementAndManageEServiceGuideLink}
          target="_blank"
          startIcon={<LaunchIcon fontSize="small" />}
        >
          {t('usefulLinks.implementAndManageEService')}
        </IconLink>
        <IconLink
          href={voucherVerificationGuideLink}
          target="_blank"
          startIcon={<LaunchIcon fontSize="small" />}
        >
          {t('usefulLinks.verifyVoucher')}
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
