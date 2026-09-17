import React from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import { match, P } from 'ts-pattern'
import { useDialog } from '@/stores'
import type { RiskAnalysisReviewMode } from '@/api/api.generatedTypes'
import type { DialogEditRiskAnalysisAssignmentProps } from '@/types/dialog.types'

const ReviewerNamesBlock: React.FC<{ label: string; names: Array<string> }> = ({
  label,
  names,
}) => (
  <Stack spacing={0.5}>
    <Typography variant="body2" fontWeight={600}>
      {label}
    </Typography>
    <Stack component="ul" spacing={0.5} sx={{ pl: 3, m: 0 }}>
      {names.map((name, index) => (
        <Typography component="li" variant="body2" key={`${index}-${name}`}>
          {name}
        </Typography>
      ))}
    </Stack>
  </Stack>
)

export const DialogEditRiskAnalysisAssignment: React.FC<DialogEditRiskAnalysisAssignmentProps> = ({
  fromMode,
  toMode,
  addedReviewerNames,
  removedReviewerNames,
  onConfirm,
}) => {
  const ariaLabelId = React.useId()
  const ariaDescriptionId = React.useId()

  const { closeDialog } = useDialog()
  const { t } = useTranslation('purpose', { keyPrefix: 'edit.stepAssignment' })
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'actions' })

  const getModeLabel = (mode: RiskAnalysisReviewMode) => t(`reviewModeField.options.${mode}`)

  const getModeChangeText = () => {
    if (fromMode === toMode) return undefined

    if (fromMode === 'ADMIN_WRITES_ADMIN_SIGNS') {
      return t('editAssignmentDialog.modeChosen', { mode: getModeLabel(toMode) })
    }
    return t('editAssignmentDialog.modeTransition', {
      from: getModeLabel(fromMode),
      to: getModeLabel(toMode),
    })
  }

  const losesRiskAnalysis = match({ fromMode, toMode })
    .returnType<boolean>()
    .with(
      {
        fromMode: P.union('ADMIN_WRITES_ADMIN_SIGNS', 'ADMIN_WRITES_REVIEWER_SIGNS'),
        toMode: P.union('ADMIN_WRITES_ADMIN_SIGNS', 'ADMIN_WRITES_REVIEWER_SIGNS'),
      },
      () => false
    )
    .with(
      { fromMode: 'REVIEWER_WRITES_REVIEWER_SIGNS', toMode: 'REVIEWER_WRITES_REVIEWER_SIGNS' },
      () => false
    )
    .with({ toMode: 'REVIEWER_WRITES_REVIEWER_SIGNS' }, () => true)
    .with({ fromMode: 'REVIEWER_WRITES_REVIEWER_SIGNS' }, () => true)
    .exhaustive()

  const modeChangeText = getModeChangeText()

  const handleConfirm = () => {
    onConfirm()
    closeDialog()
  }

  return (
    <Dialog
      open
      onClose={closeDialog}
      aria-labelledby={ariaLabelId}
      aria-describedby={ariaDescriptionId}
      fullWidth
    >
      <DialogTitle id={ariaLabelId}>{t('editAssignmentDialog.title')}</DialogTitle>

      <DialogContent>
        <Stack id={ariaDescriptionId} spacing={2}>
          {modeChangeText && <Typography variant="body2">{modeChangeText}</Typography>}
          {addedReviewerNames.length > 0 && (
            <ReviewerNamesBlock
              label={t('editAssignmentDialog.selectedReviewersLabel')}
              names={addedReviewerNames}
            />
          )}
          {removedReviewerNames.length > 0 && (
            <ReviewerNamesBlock
              label={t('editAssignmentDialog.removedReviewersLabel')}
              names={removedReviewerNames}
            />
          )}
          {losesRiskAnalysis && (
            <Typography variant="body2">
              {t('editAssignmentDialog.riskAnalysisLossWarning')}
            </Typography>
          )}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" onClick={closeDialog}>
          {tCommon('cancel')}
        </Button>
        <Button variant="contained" onClick={handleConfirm}>
          {tCommon('confirm')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
