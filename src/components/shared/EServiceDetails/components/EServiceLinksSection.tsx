import React from 'react'
import { Link, Stack } from '@mui/material'
import { useTranslation } from 'react-i18next'
import LaunchIcon from '@mui/icons-material/Launch'
import { SectionContainer } from '@/components/layout/containers'
import { manageEServiceGuideLink, verifyVoucherGuideLink } from '@/config/constants'
import { WELL_KNOWN_URLS } from '@/config/env'

const EServiceLink: React.FC<{ label: string; href: string }> = ({ label, href }) => {
  return (
    <Link
      component="a"
      href={href}
      target="_blank"
      variant="body2"
      sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
    >
      <LaunchIcon sx={{ mr: 1 }} /> {label}
    </Link>
  )
}

export const EServiceLinksSection: React.FC = () => {
  const { t } = useTranslation('eservice', {
    keyPrefix: 'read.sections.usefulLinks',
  })

  return (
    <SectionContainer title={t('title')}>
      <Stack sx={{ mt: 2 }} spacing={2}>
        <EServiceLink label={t('verifyVoucherGuideLink')} href={verifyVoucherGuideLink} />
        <EServiceLink label={t('wellKnownLink')} href={WELL_KNOWN_URLS[0]} />
        <EServiceLink label={t('manageEServiceGuideLink')} href={manageEServiceGuideLink} />
      </Stack>
    </SectionContainer>
  )
}
