import React from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { InformationContainer } from '@/components/layout/containers'
import { DialogAttributeDetailsProps } from '@/types/dialog.types'
import { useDialog } from '@/contexts'
import { AttributeQueries } from '@/api/attribute'
import { InformationContainerSkeleton } from '../layout/containers/InformationContainer'

export const DialogAttributeDetails: React.FC<DialogAttributeDetailsProps> = ({ attribute }) => {
  const { t } = useTranslation('common')

  const dialogTitleId = React.useId()
  const { closeDialog } = useDialog()

  return (
    <Dialog aria-labelledby={dialogTitleId} open onClose={closeDialog} fullWidth>
      <DialogTitle id={dialogTitleId}>{attribute.name}</DialogTitle>

      <React.Suspense fallback={<AttributeDetailsSkeleton />}>
        <AttributeDetails attributeId={attribute.id} />
      </React.Suspense>

      <DialogActions>
        <Button variant="contained" onClick={closeDialog}>
          {t('closeBtn')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

const AttributeDetails: React.FC<{ attributeId: string }> = ({ attributeId }) => {
  const { t } = useTranslation('shared-components', {
    keyPrefix: 'dialogAttributeDetails',
  })
  const { data: attribute } = AttributeQueries.useGetSingle(attributeId)

  if (!attribute) return <AttributeDetailsSkeleton />

  return (
    <DialogContent>
      <Stack sx={{ mt: 1 }} spacing={2}>
        <InformationContainer direction="column" label={t('content.descriptionField.label')}>
          {attribute.description}
        </InformationContainer>
        {attribute.code && (
          <InformationContainer direction="column" label={t('content.codeField.label')}>
            {attribute.code}
          </InformationContainer>
        )}

        {attribute.origin && (
          <InformationContainer direction="column" label={t('content.originField.label')}>
            {attribute.origin}
          </InformationContainer>
        )}
      </Stack>
    </DialogContent>
  )
}

const AttributeDetailsSkeleton: React.FC = () => {
  return (
    <DialogContent>
      <Stack sx={{ mt: 1 }} spacing={2}>
        <InformationContainerSkeleton />
        <InformationContainerSkeleton />
        <InformationContainerSkeleton />
      </Stack>
    </DialogContent>
  )
}
