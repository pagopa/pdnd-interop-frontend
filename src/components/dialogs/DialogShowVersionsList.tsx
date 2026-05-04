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
  Tooltip,
  Typography,
} from '@mui/material'
import ArchiveIcon from '@mui/icons-material/Archive'
import { useTranslation } from 'react-i18next'
import type { DialogShowVersionsListProps } from '@/types/dialog.types'
import { useDialog } from '@/stores'
import { Link } from '@/router'
import { StatusChip } from '@/components/shared/StatusChip'
import type { EServiceDescriptorState } from '@/api/api.generatedTypes'
import type { EServiceDescriptorStateExtended } from '@/types/eservice.types'
import { formatDateString } from '@/utils/format.utils'

const MAX_VISIBLE_ROWS = 6
const ROW_HEIGHT = 56

// TODO: finalize chip mapping for the new ARCHIVING state once UX is confirmed with the team. Currently it falls back to PUBLISHED (no badge).
const mapToChipState = (state: EServiceDescriptorStateExtended): EServiceDescriptorState => {
  if (state === 'ARCHIVING_SUSPENDED') return 'SUSPENDED'
  if (state === 'ARCHIVING') return 'PUBLISHED'
  return state
}

export const DialogShowVersionsList: React.FC<DialogShowVersionsListProps> = ({
  eserviceId,
  eserviceName,
  descriptors,
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
            {visibleDescriptors.map((descriptor) => {
              const chipState = mapToChipState(descriptor.state)
              const archivingSchedule =
                descriptor.state === 'ARCHIVING_SUSPENDED'
                  ? descriptor.archivingSchedule
                  : undefined
              return (
                <Stack
                  key={descriptor.id}
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{ minHeight: ROW_HEIGHT, py: 1 }}
                >
                  <Link
                    to={routeKey}
                    params={{ eserviceId, descriptorId: descriptor.id }}
                    onClick={closeDialog}
                    underline="hover"
                  >
                    {t('versionRowLabel', { version: descriptor.version })}
                  </Link>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <StatusChip for="eservice" state={chipState} size="small" />
                    {archivingSchedule && (
                      <Tooltip
                        title={t('scheduledArchivalTooltip', {
                          date: formatDateString(archivingSchedule.archivableOn),
                        })}
                        arrow
                      >
                        <ArchiveIcon color="primary" fontSize="small" />
                      </Tooltip>
                    )}
                  </Stack>
                </Stack>
              )
            })}
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
