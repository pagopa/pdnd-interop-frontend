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
import type { DialogShowEserviceVersionsListProps } from '@/types/dialog.types'
import { useDialog } from '@/stores'
import { Link } from '@/router'
import { StatusChip } from '@/components/shared/StatusChip'
import type { EServiceDescriptorState } from '@/api/api.generatedTypes'
import { formatDateString } from '@/utils/format.utils'

const MAX_VISIBLE_ROWS = 6
const ROW_HEIGHT = 56

const mapToChipState = (
  state: EServiceDescriptorState,
  isLatest: boolean
): EServiceDescriptorState => {
  if (state === 'ARCHIVING') return isLatest ? 'PUBLISHED' : 'DEPRECATED'
  if (state === 'ARCHIVING_SUSPENDED') return 'SUSPENDED'
  return state
}

export const DialogShowEserviceVersionsList: React.FC<DialogShowEserviceVersionsListProps> = ({
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

  const latestDescriptorId = visibleDescriptors[visibleDescriptors.length - 1]?.id

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
              const isLatest = descriptor.id === latestDescriptorId
              const chipState = mapToChipState(descriptor.state, isLatest)
              const archivingSchedule =
                descriptor.state === 'ARCHIVING' || descriptor.state === 'ARCHIVING_SUSPENDED'
                  ? descriptor.archivingSchedule
                  : undefined
              const tooltipKey =
                archivingSchedule?.scope === 'EService'
                  ? 'scheduledArchivalTooltipEservice'
                  : 'scheduledArchivalTooltipDescriptor'
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
                        title={t(tooltipKey, {
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
