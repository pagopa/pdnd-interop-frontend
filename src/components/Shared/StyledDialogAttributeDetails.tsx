import React, { FunctionComponent } from 'react'
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { StyledButton } from './StyledButton'
import { DialogAttributeDetailsProps } from '../../../types'
import { useCloseDialog } from '../../hooks/useCloseDialog'
import { useTranslation } from 'react-i18next'
import { DescriptionBlock } from '../DescriptionBlock'

export const StyledDialogAttributeDetails: FunctionComponent<DialogAttributeDetailsProps> = ({
  attribute,
}) => {
  const { t } = useTranslation('shared-components', { keyPrefix: 'styledDialogAttributeDetails' })
  const { closeDialog } = useCloseDialog()

  return (
    <Dialog open onClose={closeDialog} fullWidth>
      <DialogTitle>{attribute.name}</DialogTitle>

      <DialogContent>
        <DescriptionBlock label={t('content.descriptionField.label')}>
          {attribute.description}
        </DescriptionBlock>
        {attribute.code && (
          <DescriptionBlock label={t('content.codeField.label')}>{attribute.code}</DescriptionBlock>
        )}

        {attribute.origin && (
          <DescriptionBlock label={t('content.originField.label')}>
            {attribute.origin}
          </DescriptionBlock>
        )}
      </DialogContent>

      <DialogActions>
        <StyledButton variant="contained" onClick={closeDialog}>
          {t('actions.closeBtn')}
        </StyledButton>
      </DialogActions>
    </Dialog>
  )
}
