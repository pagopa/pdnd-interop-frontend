import React from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { Trans, useTranslation } from 'react-i18next'
import { PurposeMutations } from '@/api/purpose'
import { useDialog } from '@/stores'
import { useNavigate } from '@/router'
import type { DialogRequestRiskAnalysisCompilationProps } from '@/types/dialog.types'

export const DialogRequestRiskAnalysisCompilation: React.FC<
  DialogRequestRiskAnalysisCompilationProps
> = ({ purposeId, reviewerId, reviewerName }) => {
  const ariaLabelId = React.useId()

  const { t: tCommon } = useTranslation('common', { keyPrefix: 'actions' })
  const { t } = useTranslation('shared-components', {
    keyPrefix: 'dialogRequestRiskAnalysisCompilation',
  })

  const { closeDialog } = useDialog()
  const navigate = useNavigate()
  const { mutate: assignReviewer, isPending } = PurposeMutations.useAssignRiskAnalysisReviewer({
    showSuccessToast: true,
  })

  const handleConfirm = () => {
    assignReviewer(
      {
        purposeId,
        reviewMode: 'REVIEWER_WRITES_REVIEWER_SIGNS',
        reviewerIds: [reviewerId],
      },
      {
        onSuccess: () => {
          closeDialog()
          navigate('SUBSCRIBE_PURPOSE_SUMMARY', { params: { purposeId } })
        },
      }
    )
  }

  const handleClose = () => {
    if (isPending) return
    closeDialog()
  }

  return (
    <Dialog aria-labelledby={ariaLabelId} open onClose={handleClose} fullWidth>
      <DialogTitle id={ariaLabelId}>{t('title')}</DialogTitle>

      <DialogContent>
        <Typography variant="body2">
          <Trans
            components={{
              strong: <Typography variant="inherit" component="span" fontWeight={600} />,
            }}
          >
            {t('description', { reviewerName })}
          </Trans>
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" onClick={handleClose} disabled={isPending}>
          {tCommon('cancel')}
        </Button>
        <LoadingButton variant="contained" loading={isPending} onClick={handleConfirm}>
          {tCommon('confirm')}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  )
}
