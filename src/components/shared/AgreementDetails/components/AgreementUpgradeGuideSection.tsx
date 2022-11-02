import { InformationContainer, SectionContainer } from '@/components/layout/containers'
import { Alert, Box, Button, Divider, Link, Stack } from '@mui/material'
import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Accordion, AccordionEntry } from '../../Accordion'
import LaunchIcon from '@mui/icons-material/Launch'
import LinkIcon from '@mui/icons-material/Link'
import { useAgreementDetailsContext } from '../AgreementDetailsContext'
import { AgreementMutations } from '@/api/agreement'
import { useNavigateRouter } from '@/router'

export const AgreementUpgradeGuideSection: React.FC = () => {
  const { t } = useTranslation('agreement', { keyPrefix: 'read.updateGuide' })
  const { agreement, canBeUpgraded } = useAgreementDetailsContext()
  const { mutate: upgradeAgreement } = AgreementMutations.useUpgrade()
  const { navigate } = useNavigateRouter()

  const accordionEntries: Array<AccordionEntry> = t('faq', { returnObjects: true })

  const handleUpgrade = async () => {
    if (!agreement?.id) return
    upgradeAgreement(
      { agreementId: agreement.id },
      {
        onSuccess() {
          navigate('SUBSCRIBE_AGREEMENT_LIST')
        },
      }
    )
  }

  const eservice = agreement?.eservice

  if (!eservice || !canBeUpgraded) return null

  return (
    <>
      <Alert severity="warning">
        <Trans components={{ 1: <Box component="span" fontWeight={700} /> }}>
          {t('alertLabel', { eserviceName: eservice.name })}
        </Trans>
      </Alert>

      <SectionContainer>
        <SectionContainer.Title>{t('title')}</SectionContainer.Title>
        <SectionContainer.Subtitle>
          <Trans components={{ 1: <Box component="span" fontWeight={700} /> }}>
            {t('description', { eserviceName: eservice.name })}
          </Trans>
        </SectionContainer.Subtitle>
        <SectionContainer.Content>
          <Stack spacing={2}>
            <InformationContainer label="FAQ">
              <Accordion entries={accordionEntries} />
            </InformationContainer>
            <InformationContainer label="Link utili">
              <Stack spacing={1}>
                <Link
                  component="a"
                  href="teste"
                  target="_blank"
                  variant="body2"
                  underline="hover"
                  sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                >
                  <LaunchIcon fontSize="small" sx={{ mr: 1 }} /> {t('upgradeGuideLinkLabel')}
                </Link>
                <Link
                  variant="body2"
                  underline="hover"
                  sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                >
                  <LinkIcon fontSize="small" sx={{ mr: 1 }} />{' '}
                  <span>
                    <Trans components={{ 1: <Box component="span" fontWeight={700} /> }}>
                      {t('eserviceLinkLabel', {
                        eserviceName: eservice.name,
                        version: eservice.activeDescriptor?.version,
                      })}
                    </Trans>
                  </span>
                </Link>
              </Stack>
            </InformationContainer>
            <Divider />
            <Stack direction="row" justifyContent="center">
              <Button onClick={handleUpgrade} variant="outlined">
                {t('upgradeBtn')}
              </Button>
            </Stack>
          </Stack>
        </SectionContainer.Content>
      </SectionContainer>
    </>
  )
}
