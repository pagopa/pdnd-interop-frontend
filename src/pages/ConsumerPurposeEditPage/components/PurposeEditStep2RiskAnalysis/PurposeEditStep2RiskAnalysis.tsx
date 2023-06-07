import React from 'react'
import type { ActiveStepProps } from '@/hooks/useActiveStep'
import { RiskAnalysisForm, RiskAnalysisFormSkeleton } from './RiskAnalysisForm'
import { useNavigate, useParams } from '@/router'
import { PurposeQueries } from '@/api/purpose'
import { NotFoundError } from '@/utils/errors.utils'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { useTranslation } from 'react-i18next'

export const PurposeEditStep2RiskAnalysis: React.FC<ActiveStepProps> = (props) => {
  const { purposeId } = useParams<'SUBSCRIBE_PURPOSE_EDIT'>()
  const navigate = useNavigate()
  const [shouldProceedWithVersionMismatch, setShouldProceedWithVersionMismatch] =
    React.useState(false)

  const { data: purpose, isLoading: isLoadingPurpose } = PurposeQueries.useGetSingle(purposeId, {
    suspense: false,
  })

  const { data: riskAnalysis } = PurposeQueries.useGetRiskAnalysisLatest({
    suspense: false,
  })

  if (isLoadingPurpose || !riskAnalysis) {
    return <RiskAnalysisFormSkeleton />
  }

  if (!purpose) {
    throw new NotFoundError()
  }

  const hasVersionMismatch =
    purpose.riskAnalysisForm && riskAnalysis.version !== purpose.riskAnalysisForm.version

  if (!shouldProceedWithVersionMismatch && hasVersionMismatch) {
    return (
      <RiskAnalysisVersionMismatchDialog
        onProceed={() => {
          setShouldProceedWithVersionMismatch(true)
        }}
        onRefuse={() => {
          navigate('SUBSCRIBE_PURPOSE_LIST')
        }}
      />
    )
  }

  return <RiskAnalysisForm purpose={purpose} riskAnalysis={riskAnalysis} {...props} />
}

const RiskAnalysisVersionMismatchDialog: React.FC<{
  onProceed: VoidFunction
  onRefuse: VoidFunction
}> = ({ onProceed, onRefuse }) => {
  const { t } = useTranslation('purpose', { keyPrefix: 'edit.step2.versionMismatchDialog' })
  const ariaLabelId = React.useId()
  const ariaDescriptionId = React.useId()

  return (
    <Dialog open aria-labelledby={ariaLabelId} aria-describedby={ariaDescriptionId}>
      <DialogTitle id={ariaLabelId}>{t('title')}</DialogTitle>

      <DialogContent aria-describedby={ariaDescriptionId}>{t('description')}</DialogContent>

      <DialogActions>
        <Button variant="outlined" onClick={onRefuse}>
          {t('cancelButtonLabel')}
        </Button>
        <Button variant="contained" onClick={onProceed}>
          {t('proceedButtonLabel')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
