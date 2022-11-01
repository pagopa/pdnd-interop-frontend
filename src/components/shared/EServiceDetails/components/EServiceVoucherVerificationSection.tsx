import React from 'react'
import { Link, Stack, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import LaunchIcon from '@mui/icons-material/Launch'
import { SectionContainer } from '@/components/layout/containers'
import { verifyVoucherHelpLink } from '@/config/constants'
import { WELL_KNOWN_URLS } from '@/config/env'

const VoucherLink: React.FC<{ label: string; href: string }> = ({ label, href }) => {
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

export const EServiceVoucherVerificationSection: React.FC = () => {
  const { t } = useTranslation('eservice', {
    keyPrefix: 'read.sections.voucherVerification',
  })

  return (
    <SectionContainer>
      <SectionContainer.Title>{t('title')}</SectionContainer.Title>
      <SectionContainer.Content>
        <Typography>{t('description')}</Typography>
        <Stack sx={{ mt: 2 }} spacing={2}>
          <VoucherLink label={t('howLink')} href={verifyVoucherHelpLink} />
          <VoucherLink label={t('wellKnownLink')} href={WELL_KNOWN_URLS[0]} />
        </Stack>
      </SectionContainer.Content>
    </SectionContainer>
  )
}
