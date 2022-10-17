import React, { FunctionComponent } from 'react'
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { StyledButton } from './StyledButton'
import { BackendAttributeContent, DialogAttributeDetailsProps } from '../../../types'
import { useCloseDialog } from '../../hooks/useCloseDialog'
import { useTranslation } from 'react-i18next'
import { DescriptionBlock } from '../DescriptionBlock'
import { useAsyncFetch } from '../../hooks/useAsyncFetch'
import { LoadingWithMessage } from './LoadingWithMessage'

export const StyledDialogAttributeDetails: FunctionComponent<DialogAttributeDetailsProps> = ({
  attributeId,
  name,
}) => {
  const { t } = useTranslation('shared-components', {
    keyPrefix: 'styledDialogAttributeDetails',
    useSuspense: false,
  })
  const { closeDialog } = useCloseDialog()

  const { data: attribute, isLoading } = useAsyncFetch<BackendAttributeContent>({
    path: { endpoint: 'ATTRIBUTE_GET_SINGLE', endpointParams: { attributeId: attributeId } },
  })

  return (
    <Dialog open onClose={closeDialog} fullWidth>
      <DialogTitle>{name}</DialogTitle>

      {isLoading && <LoadingWithMessage label={t('loading')} />}

      {attribute && (
        <DialogContent>
          <DescriptionBlock label={t('content.descriptionField.label')}>
            {attribute.description}
          </DescriptionBlock>
          {attribute.code && (
            <DescriptionBlock label={t('content.codeField.label')}>
              {attribute.code}
            </DescriptionBlock>
          )}

          {attribute.origin && (
            <DescriptionBlock label={t('content.originField.label')}>
              {attribute.origin}
            </DescriptionBlock>
          )}
        </DialogContent>
      )}

      <DialogActions>
        <StyledButton variant="contained" onClick={closeDialog}>
          {t('actions.closeBtn')}
        </StyledButton>
      </DialogActions>
    </Dialog>
  )
}
