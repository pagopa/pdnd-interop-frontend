import React from 'react'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  Typography,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import type { DialogShowEserviceVersionsListProps } from '@/types/dialog.types'
import { useDialog } from '@/stores'
import { EserviceVersionRow, ROW_HEIGHT } from './EserviceVersionRow'

const MAX_VISIBLE_ROWS = 6

export const DialogShowEserviceVersionsList: React.FC<DialogShowEserviceVersionsListProps> = ({
  eserviceId,
  eserviceName,
  descriptors,
  activeDescriptor,
  routeKey,
}) => {
  const { t } = useTranslation('eservice', { keyPrefix: 'read.versionListModal' })
  const { t: tCommon } = useTranslation('common')
  const { closeDialog } = useDialog()

  const ariaLabelId = React.useId()

  const visibleDescriptors = [...descriptors]
    .filter((d) => d.state !== 'DRAFT' && d.state !== 'WAITING_FOR_APPROVAL')
    .sort((a, b) => Number(a.version) - Number(b.version))

  return (
    <Dialog aria-labelledby={ariaLabelId} open onClose={closeDialog} fullWidth maxWidth="xs">
      <DialogTitle id={ariaLabelId}>{t('title')}</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {eserviceName}
        </Typography>
        <Box sx={{ maxHeight: ROW_HEIGHT * MAX_VISIBLE_ROWS, overflowY: 'auto' }}>
          <Stack divider={<Divider flexItem />}>
            {visibleDescriptors.map((descriptor) => (
              <EserviceVersionRow
                key={descriptor.id}
                descriptor={descriptor}
                activeDescriptor={activeDescriptor}
                eserviceId={eserviceId}
                routeKey={routeKey}
                onNavigate={closeDialog}
              />
            ))}
          </Stack>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={closeDialog}>
          {tCommon('closeBtn')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
