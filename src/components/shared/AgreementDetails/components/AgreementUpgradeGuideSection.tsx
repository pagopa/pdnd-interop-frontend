import { SectionContainer } from '@/components/layout/containers'
import { Alert, Box, Button, Divider, Link, Stack } from '@mui/material'
import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import LaunchIcon from '@mui/icons-material/Launch'
import LinkIcon from '@mui/icons-material/Link'
import { useAgreementDetailsContext } from '../AgreementDetailsContext'
import { AgreementMutations } from '@/api/agreement'
import { RouterLink, useNavigateRouter } from '@/router'
import { agreementUpgradeGuideLink } from '@/config/constants'
import { useJwt } from '@/hooks/useJwt'
import { InformationContainer } from '@pagopa/interop-fe-commons'

export const AgreementUpgradeGuideSection: React.FC = () => {
  const { t } = useTranslation('agreement', { keyPrefix: 'read.updateGuide' })
  const { agreement, canBeUpgraded } = useAgreementDetailsContext()
  const { mutate: upgradeAgreement } = AgreementMutations.useUpgrade()
  const { navigate } = useNavigateRouter()
  const { isAdmin } = useJwt()

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

  if (!eservice || !canBeUpgraded || !isAdmin) return null

  return (
    <>
      <Alert sx={{ mt: 2 }} severity="warning">
        <Trans components={{ 1: <Box component="span" fontWeight={700} /> }}>
          {t('alertLabel', { eserviceName: eservice.name })}
        </Trans>
      </Alert>

      <SectionContainer
        title={t('title')}
        description={
          <Trans components={{ 1: <Box component="span" fontWeight={700} /> }}>
            {t('description', { eserviceName: eservice.name })}
          </Trans>
        }
      >
        <Stack spacing={2}>
          <InformationContainer
            content={
              <Stack spacing={1}>
                <Link
                  component="a"
                  href={agreementUpgradeGuideLink}
                  target="_blank"
                  variant="body2"
                  underline="hover"
                  sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                >
                  <LaunchIcon fontSize="small" sx={{ mr: 1 }} /> {t('upgradeGuideLinkLabel')}
                </Link>
                <RouterLink
                  to="SUBSCRIBE_CATALOG_VIEW"
                  params={{ eserviceId: eservice.id, descriptorId: eservice.activeDescriptor!.id }}
                  variant="body2"
                  underline="hover"
                  target="_blank"
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
                </RouterLink>
              </Stack>
            }
            label={t('linksLabel')}
          />
          <Divider />
          <Stack direction="row" justifyContent="center">
            <Button onClick={handleUpgrade} variant="outlined">
              {t('upgradeBtn')}
            </Button>
          </Stack>
        </Stack>
      </SectionContainer>
    </>
  )
}
