import { SectionContainer } from '@/components/layout/containers'
import { Link, Typography } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useEServiceDetailsContext } from '../EServiceDetailsContext'

export const EServiceProviderContacts: React.FC = () => {
  const { t } = useTranslation('eservice', {
    keyPrefix: 'read.sections.contacts',
  })
  const { descriptor } = useEServiceDetailsContext()

  if (!descriptor || !descriptor.eservice.mail) return null

  const mailAddress = descriptor.eservice.mail.address
  const description = descriptor.eservice.mail?.description

  return (
    <SectionContainer title={t('title')}>
      <Link href={`mailto:${mailAddress}`}>{mailAddress}</Link>
      {description && <Typography>{description}</Typography>}
    </SectionContainer>
  )
}
