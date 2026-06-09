import { Drawer } from '@/components/shared/Drawer'
import { Typography } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'

type RiskAnalysisRejectionDrawerProps = {
  isOpen: boolean
  onClose: VoidFunction
  rejectionReason: string
}

/**
 * Read-only drawer showing the reason the reviewer gave when rejecting the risk analysis.
 * Reused by the purpose summary page and the purpose edit risk-analysis step.
 */
export const RiskAnalysisRejectionDrawer: React.FC<RiskAnalysisRejectionDrawerProps> = ({
  isOpen,
  onClose,
  rejectionReason,
}) => {
  const { t } = useTranslation('purpose', { keyPrefix: 'riskAnalysisRejectionDrawer' })

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title={t('title')} subtitle={t('intro')}>
      <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
        {rejectionReason || t('noReason')}
      </Typography>
    </Drawer>
  )
}
