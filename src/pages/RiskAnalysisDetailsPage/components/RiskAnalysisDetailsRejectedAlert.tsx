import { RiskAnalysisRejectionDrawer } from '@/components/shared/RiskAnalysisRejectionDrawer'
import { useDrawerState } from '@/hooks/useDrawerState'
import { Alert, Button } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'

type RiskAnalysisDetailsRejectedAlertProps = {
  rejectionReason: string
}

export const RiskAnalysisDetailsRejectedAlert: React.FC<RiskAnalysisDetailsRejectedAlertProps> = ({
  rejectionReason,
}) => {
  const { t } = useTranslation('purpose', { keyPrefix: 'riskAnalysisDetails' })
  const { isOpen, openDrawer, closeDrawer } = useDrawerState()

  return (
    <>
      <Alert
        sx={{ mb: 3 }}
        severity="error"
        action={
          <Button
            variant="naked"
            size="small"
            sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}
            onClick={openDrawer}
          >
            {t('rejectedAlert.action')}
          </Button>
        }
      >
        {t('rejectedAlert.label')}
      </Alert>
      <RiskAnalysisRejectionDrawer
        isOpen={isOpen}
        onClose={closeDrawer}
        rejectionReason={rejectionReason}
      />
    </>
  )
}
