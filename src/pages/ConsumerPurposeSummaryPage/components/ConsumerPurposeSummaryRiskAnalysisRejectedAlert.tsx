import { Alert, Button } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'

/**
 * Error alert shown at the top of the consumer purpose summary page when the reviewer
 * rejected the risk analysis. The "read reason" action will open a dedicated drawer
 * handled in a separate task.
 */
export const ConsumerPurposeSummaryRiskAnalysisRejectedAlert: React.FC = () => {
  const { t } = useTranslation('purpose', {
    keyPrefix: 'summary.riskAnalysisSection.reviewStatus.rejectedAlert',
  })

  const handleReadReason = () => {
    // TODO(PIN-10175): open the rejection reason drawer (separate task).
  }

  return (
    <Alert
      sx={{ mb: 3 }}
      severity="error"
      variant="outlined"
      action={
        <Button variant="naked" size="small" sx={{ fontWeight: 700 }} onClick={handleReadReason}>
          {t('action')}
        </Button>
      }
    >
      {t('label')}
    </Alert>
  )
}
