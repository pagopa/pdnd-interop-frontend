import React from 'react'
import type { Agreement } from '@/api/api.generatedTypes'
import { Drawer } from '@/components/shared/Drawer'
import { Trans, useTranslation } from 'react-i18next'
import { Box, Stack, Typography, Link as MUILink, TextField, Alert } from '@mui/material'
import { Link, useNavigate } from '@/router'
import { agreementUpgradeGuideLink } from '@/config/constants'
import { AgreementMutations } from '@/api/agreement'

type AgreementUpgradeDrawerProps = {
  agreement: Agreement
  isOpen: boolean
  onClose: () => void
  hasMissingAttributes: boolean
}

export const AgreementUpgradeDrawer: React.FC<AgreementUpgradeDrawerProps> = ({
  agreement,
  isOpen,
  onClose,
  hasMissingAttributes,
}) => {
  const { t } = useTranslation('agreement', { keyPrefix: 'read.updateDrawer' })
  const navigate = useNavigate()

  const [confirmationText, setConfirmationText] = React.useState('')
  const { mutate: upgradeAgreement } = AgreementMutations.useUpgrade()

  const isUpgradeButtonEnabled = confirmationText.toLowerCase() === t('upgradeBtn').toLowerCase()

  const handleUpgrade = async () => {
    if (!agreement?.id) return
    upgradeAgreement(
      { agreementId: agreement.id },
      {
        onSuccess(data) {
          /**
           * When the subscriber is missing one or more verified/declared attributes,
           * the new agreement is created as a DRAFT instead of being submitted to
           * the provider. When this happens, the subscriber should be presented with
           * the "draft edit" view of the agreement.
           */
          const agreementView =
            data.state === 'DRAFT' ? 'SUBSCRIBE_AGREEMENT_EDIT' : 'SUBSCRIBE_AGREEMENT_READ'

          navigate(agreementView, {
            params: {
              agreementId: data.id,
            },
          })
        },
      }
    )
  }

  return (
    <Drawer
      title={t('title')}
      subtitle={t('subtitle')}
      isOpen={isOpen}
      closeAction={onClose}
      buttonAction={{
        label: t('upgradeBtn'),
        action: handleUpgrade,
        disabled: !isUpgradeButtonEnabled,
      }}
    >
      <Stack spacing={4} sx={{ height: '100%' }}>
        <Box>
          <Typography variant="body2" fontWeight={600}>
            {t('eserviceNewVersion.title')}
          </Typography>
          <Typography sx={{ mt: 1.5 }} variant="body2">
            <Trans
              components={{
                1: (
                  <Link
                    to="SUBSCRIBE_CATALOG_VIEW"
                    params={{
                      eserviceId: agreement.eservice.id,
                      descriptorId: agreement.descriptorId,
                    }}
                  />
                ),
              }}
            >
              {t('eserviceNewVersion.content', { eserviceName: agreement.eservice.name })}
            </Trans>
          </Typography>
        </Box>

        <Stack spacing={2}>
          <Typography variant="body2" fontWeight={600}>
            {t('meaning.title')}
          </Typography>
          <Typography variant="body2">{t('meaning.paragraph1')}</Typography>
          <Typography variant="body2">{t('meaning.paragraph2')}</Typography>
          <Typography variant="body2">
            <Trans components={{ 1: <MUILink href={agreementUpgradeGuideLink} target="_blank" /> }}>
              {t('meaning.paragraph3')}
            </Trans>
          </Typography>
        </Stack>

        {hasMissingAttributes && (
          <Alert severity="info" sx={{ mt: 1 }}>
            {t('noAttributesAlert')}
          </Alert>
        )}

        <Stack sx={{ flexGrow: 1, justifyContent: 'end' }}>
          <TextField
            autoFocus
            size="small"
            onChange={(e) => setConfirmationText(e.target.value)}
            sx={{ '& .MuiFormLabel-root': { fontSize: '16px' } }}
            label={t('upgradeTextFieldLabel')}
          />
        </Stack>
      </Stack>
    </Drawer>
  )
}
