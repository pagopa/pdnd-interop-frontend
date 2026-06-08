import { Drawer } from '@/components/shared/Drawer'
import { Typography } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'

type ConsumerPurposeSummaryRiskAnalysisRejectionDrawerProps = {
  isOpen: boolean
  onClose: VoidFunction
  rejectionReason: string
}

/**
 * Read-only drawer showing the reason the reviewer gave when rejecting the risk analysis.
 * Opened from the "read reason" link of the rejected error alert on the summary page.
 */
export const ConsumerPurposeSummaryRiskAnalysisRejectionDrawer: React.FC<
  ConsumerPurposeSummaryRiskAnalysisRejectionDrawerProps
> = ({ isOpen, onClose, rejectionReason }) => {
  const { t } = useTranslation('purpose', {
    keyPrefix: 'summary.riskAnalysisSection.reviewStatus.rejectionDrawer',
  })

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title={t('title')} subtitle={t('intro')}>
      <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
        {rejectionReason}
      </Typography>
    </Drawer>
  )
}
