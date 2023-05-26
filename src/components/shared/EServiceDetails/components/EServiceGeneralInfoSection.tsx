import { SectionContainer } from '@/components/layout/containers'
import { useJwt } from '@/hooks/useJwt'
import { Link } from '@/router'
import { Stack } from '@mui/material'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useEServiceDetailsContext } from '../EServiceDetailsContext'

export const EServiceGeneralInfoSection: React.FC = () => {
  const { t } = useTranslation('eservice', {
    keyPrefix: 'read.sections.generalInformations',
  })
  const { descriptor, agreement } = useEServiceDetailsContext()
  const { isAdmin } = useJwt()

  const agreementPath =
    agreement?.state === 'DRAFT' ? 'SUBSCRIBE_AGREEMENT_EDIT' : 'SUBSCRIBE_AGREEMENT_READ'

  if (!descriptor) return null

  return (
    <SectionContainer title={t('title')}>
      <Stack spacing={2}>
        {isAdmin && agreement && (
          <InformationContainer
            content={
              <Link target="_blank" to={agreementPath} params={{ agreementId: agreement.id }}>
                {t('agreementField.link.label')}
              </Link>
            }
            label={t('agreementField.label')}
          />
        )}
        <InformationContainer content={descriptor.eservice.technology} label={t('technology')} />
      </Stack>
    </SectionContainer>
  )
}
