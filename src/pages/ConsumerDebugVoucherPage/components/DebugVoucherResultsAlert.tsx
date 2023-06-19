import { Link } from '@/router'
import type { AlertColor } from '@mui/material'
import { Alert, AlertTitle, Typography } from '@mui/material'
import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useDebugVoucherContext } from '../DebugVoucherContext'
import type { TokenGenerationValidationSteps } from '@/api/api.generatedTypes'

const DebugVoucherResultsAlert: React.FC = () => {
  const { t } = useTranslation('voucher', { keyPrefix: 'consumerDebugVoucher.result' })

  const { response } = useDebugVoucherContext()

  const resultAlert: {
    text: string
    type: AlertColor
  } = {
    text: t('alert.description.failed'),
    type: 'error',
  }

  /**
   * isDebugVoucherPassed is true if every step has result PASSED
   * or clientKind is API and the first three step are PASSED and the last one is SKIPPED
   * this is a BE decision that when clientKind is API the last step is returned as SKIPPED and should be ignored
   */
  const isDebugVoucherPassed = Object.entries(response.steps).every(([key, step]) => {
    return (
      step?.result === 'PASSED' ||
      (response.clientKind === 'API' &&
        (key as keyof TokenGenerationValidationSteps) === 'platformStatesVerification' &&
        step.result === 'SKIPPED')
    )
  })

  if (isDebugVoucherPassed) {
    resultAlert.text =
      response.clientKind === 'CONSUMER'
        ? t('alert.description.consumerSuccess', {
            eserviceName: response.eservice?.name,
            eserviceVersion: response.eservice?.version,
          })
        : t('alert.description.apiSuccess')
    resultAlert.type = 'success'
  }

  return (
    <Alert severity={resultAlert.type}>
      <AlertTitle sx={{ fontWeight: 700 }}>{t('alert.title')}</AlertTitle>
      <Typography variant="body2">
        <Trans
          components={{
            strong: <Typography component="span" variant="inherit" fontWeight={700} />,
            1: response.eservice ? (
              <Link
                to="SUBSCRIBE_CATALOG_VIEW"
                params={{
                  eserviceId: response.eservice.id,
                  descriptorId: response.eservice.descriptorId,
                }}
              />
            ) : (
              <Typography component="span" variant="inherit" />
            ),
          }}
        >
          {resultAlert.text}
        </Trans>
      </Typography>
    </Alert>
  )
}

export default DebugVoucherResultsAlert
