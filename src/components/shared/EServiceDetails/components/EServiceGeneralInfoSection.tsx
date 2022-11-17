import { InformationContainer, SectionContainer } from '@/components/layout/containers'
import { useJwt } from '@/hooks/useJwt'
import { RouterLink } from '@/router'
import { Stack } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useEServiceDetailsContext } from '../EServiceDetailsContext'

export const EServiceGeneralInfoSection: React.FC = () => {
  const { t } = useTranslation('eservice', {
    keyPrefix: 'read.sections.generalInformations',
  })
  const { eservice, agreement } = useEServiceDetailsContext()
  const { isAdmin } = useJwt()

  const agreementPath =
    agreement?.state === 'DRAFT' ? 'SUBSCRIBE_AGREEMENT_EDIT' : 'SUBSCRIBE_AGREEMENT_READ'

  if (!eservice) return null

  return (
    <SectionContainer title={t('title')}>
      <Stack spacing={2}>
        {isAdmin && agreement && (
          <InformationContainer label={t('agreementField.label')}>
            <RouterLink target="_blank" to={agreementPath} params={{ agreementId: agreement.id }}>
              {t('agreementField.link.label')}
            </RouterLink>
          </InformationContainer>
        )}
        <InformationContainer label={t('technology')}>{eservice.technology}</InformationContainer>
      </Stack>
    </SectionContainer>
  )
}
