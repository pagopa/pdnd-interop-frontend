import { AgreementMutations } from '@/api/agreement'
import type { Agreement } from '@/api/api.generatedTypes'
import { agreementUpgradeGuideLink } from '@/config/constants'
import { Link as RouterLink, useNavigate } from '@/router'
import { useDialog } from '@/stores'
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Link as MUILink,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material'
import React from 'react'
import { Trans, useTranslation } from 'react-i18next'

type DialogUpgradeAgreementVersionProps = {
  agreement: Agreement
  hasMissingAttributes: boolean
}

export const DialogUpgradeAgreementVersion: React.FC<DialogUpgradeAgreementVersionProps> = ({
  agreement,
  hasMissingAttributes,
}) => {
  const { t } = useTranslation('shared-components', {
    keyPrefix: 'dialogUpgradeAgreementVersion',
    useSuspense: false,
  })
  const ariaLabelId = React.useId()
  const navigate = useNavigate()
  const { closeDialog } = useDialog()
  const { mutate: upgradeAgreement } = AgreementMutations.useUpgrade()

  const [checkboxesState, setCheckboxesState] = React.useState<{
    attributesCheck: boolean
    apiIntegrationCheck: boolean
    testEnvCheck: boolean
  }>({ attributesCheck: false, apiIntegrationCheck: false, testEnvCheck: false })

  const handleUpgrade = () => {
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
          closeDialog()
        },
      }
    )
  }

  const handleCheckBoxChange = (key: keyof typeof checkboxesState) => {
    setCheckboxesState((prev) => {
      return { ...prev, [key]: !prev[key] }
    })
  }

  const isUpgradeButtonDisabled =
    !checkboxesState.attributesCheck ||
    !checkboxesState.apiIntegrationCheck ||
    !checkboxesState.testEnvCheck

  return (
    <Dialog aria-labelledby={ariaLabelId} open onClose={closeDialog} fullWidth maxWidth="md">
      <DialogTitle id={ariaLabelId}>{t('title')}</DialogTitle>

      <DialogContent>
        <Stack spacing={3}>
          <Typography variant="body1">
            <Trans
              components={{
                1: (
                  <RouterLink
                    to="SUBSCRIBE_CATALOG_VIEW"
                    params={{
                      eserviceId: agreement.eservice.id,
                      descriptorId: agreement.eservice.activeDescriptor!.id,
                    }}
                    target="_blank"
                  />
                ),
              }}
            >
              {t('content.subtitle', {
                eservice: agreement.eservice.name,
                version: agreement.eservice.version,
                provider: agreement.producer.name,
              })}
            </Trans>
          </Typography>
          <Box>
            <Typography variant="body1" fontWeight={700}>
              {t('content.description.title')}
            </Typography>
            <Typography variant="body1">
              <Trans
                components={{
                  1: <MUILink underline="hover" href={agreementUpgradeGuideLink} target="_blank" />,
                }}
              >
                {t('content.description.content')}
              </Trans>
            </Typography>
          </Box>
          <Stack>
            <Typography variant="body1" fontWeight={700}>
              {t('content.checkboxesForm.title')}
            </Typography>
            <FormControlLabel
              key={'attributesCheck'}
              value={checkboxesState.attributesCheck}
              onChange={handleCheckBoxChange.bind(null, 'attributesCheck')}
              control={<Checkbox />}
              label={t('content.checkboxesForm.attributesCheckLabel')}
              sx={{ mx: 1 }}
            />

            <FormControlLabel
              key={'apiIntegrationCheck'}
              value={checkboxesState.apiIntegrationCheck}
              onChange={handleCheckBoxChange.bind(null, 'apiIntegrationCheck')}
              control={<Checkbox />}
              label={t('content.checkboxesForm.apiIntegrationCheckLabel')}
              sx={{ mx: 1 }}
            />

            <FormControlLabel
              key={'testEnvCheck'}
              value={checkboxesState.testEnvCheck}
              onChange={handleCheckBoxChange.bind(null, 'testEnvCheck')}
              control={<Checkbox />}
              label={t('content.checkboxesForm.testEnvCheckLabel')}
              sx={{ mx: 1 }}
            />
          </Stack>
          {hasMissingAttributes && (
            <Alert severity="warning">
              {t('content.missingVerifiedOrDeclaredAttributesAlert')}
            </Alert>
          )}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button type="button" variant="outlined" onClick={closeDialog} sx={{ mr: 2 }}>
          {t('actions.cancelLabel')}
        </Button>
        <Tooltip
          title={
            isUpgradeButtonDisabled ? t('actions.upgrade.notAllCheckboxCheckedTooltip') : undefined
          }
        >
          <span tabIndex={isUpgradeButtonDisabled ? 0 : undefined}>
            <Button disabled={isUpgradeButtonDisabled} variant="contained" onClick={handleUpgrade}>
              {t('actions.upgrade.label')}
            </Button>
          </span>
        </Tooltip>
      </DialogActions>
    </Dialog>
  )
}
