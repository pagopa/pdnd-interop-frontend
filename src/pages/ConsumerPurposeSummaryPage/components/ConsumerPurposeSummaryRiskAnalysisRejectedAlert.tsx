import { Alert, Button } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { ConsumerPurposeSummaryRiskAnalysisRejectionDrawer } from './ConsumerPurposeSummaryRiskAnalysisRejectionDrawer'

type ConsumerPurposeSummaryRiskAnalysisRejectedAlertProps = {
  rejectionReason: string
}

/**
 * Error alert shown at the top of the consumer purpose summary page when the reviewer
 * rejected the risk analysis. The "read reason" action opens a read-only drawer with the
 * rejection reason.
 */
export const ConsumerPurposeSummaryRiskAnalysisRejectedAlert: React.FC<
  ConsumerPurposeSummaryRiskAnalysisRejectedAlertProps
> = ({ rejectionReason }) => {
  const { t } = useTranslation('purpose', {
    keyPrefix: 'summary.riskAnalysisSection.reviewStatus.rejectedAlert',
  })

  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false)

  return (
    <>
      <Alert
        sx={{ mb: 3 }}
        severity="error"
        variant="outlined"
        action={
          <Button
            variant="naked"
            size="small"
            sx={{ fontWeight: 700 }}
            onClick={() => setIsDrawerOpen(true)}
          >
            {t('action')}
          </Button>
        }
      >
        {t('label')}
      </Alert>
      <ConsumerPurposeSummaryRiskAnalysisRejectionDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        rejectionReason={rejectionReason}
      />
    </>
  )
}
