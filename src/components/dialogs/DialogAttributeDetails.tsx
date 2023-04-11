import React from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack } from '@mui/material'
import { useTranslation } from 'react-i18next'
import type { DialogAttributeDetailsProps } from '@/types/dialog.types'
import { useDialog } from '@/stores'
import { AttributeQueries } from '@/api/attribute'
import { InformationContainer, InformationContainerSkeleton } from '@pagopa/interop-fe-commons'

export const DialogAttributeDetails: React.FC<DialogAttributeDetailsProps> = ({ attribute }) => {
  const { t } = useTranslation('common')

  const ariaLabelId = React.useId()
  const { closeDialog } = useDialog()

  return (
    <Dialog aria-labelledby={ariaLabelId} open onClose={closeDialog} fullWidth>
      <DialogTitle id={ariaLabelId}>{attribute.name}</DialogTitle>

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
        <InformationContainer
          content={attribute.description}
          direction="column"
          label={t('content.descriptionField.label')}
        />
      </Stack>
    </DialogContent>
  )
}

const AttributeDetailsSkeleton: React.FC = () => {
  return (
    <DialogContent>
      <Stack sx={{ mt: 1 }} spacing={2}>
        <InformationContainerSkeleton />
      </Stack>
    </DialogContent>
  )
}
