import React from 'react'
import { Alert, Button, Stack, Box, Typography } from '@mui/material'
import ArchiveIcon from '@mui/icons-material/Archive'
import { useTranslation } from 'react-i18next'
import type { ProducerEServiceDescriptor } from '@/api/api.generatedTypes'
import { Drawer } from '@/components/shared/Drawer'
import { useDialog } from '@/stores'
import { formatDateStringNumeric } from '@/utils/format.utils'

type ProviderEServiceArchivingAlertProps = {
  descriptor?: ProducerEServiceDescriptor
}

export const ProviderEServiceArchivingAlert: React.FC<ProviderEServiceArchivingAlertProps> = ({
  descriptor,
}) => {
  const [isArchivingRequestDrawerOpen, setIsArchivingRequestDrawerOpen] = React.useState(false)
  const { t } = useTranslation('eservice', { keyPrefix: 'read' })

  const { openDialog } = useDialog()

  if (!descriptor) return

  const request = descriptor.eservice.delegatedArchivingRequest

  if (!request || request.rejectedAt || request.acceptedAt) return

  // CASE I: Archiving request for e-service
  if (!request.descriptorId) {
    return (
      <Stack mb={3}>
        <Alert severity="warning">
          <Stack direction="row" spacing={5}>
            <Box>
              {t('alert.delegatorEServiceArchivingRequest', {
                date: formatDateStringNumeric(request.requestedAt),
                entity: descriptor.delegation?.delegate.name,
              })}
            </Box>
            <Button
              variant="naked"
              startIcon={<ArchiveIcon />}
              size="small"
              sx={{
                whiteSpace: 'nowrap',
              }}
              onClick={() => setIsArchivingRequestDrawerOpen(true)}
            >
              {t('alert.delegatorArchivingRequestAction')}
            </Button>
          </Stack>
        </Alert>
        <Drawer
          isOpen={isArchivingRequestDrawerOpen}
          onClose={() => setIsArchivingRequestDrawerOpen(false)}
          title={t('drawers.delegatedEServiceArchivingRequestDrawer.title')}
        >
          <Stack
            justifyContent="space-between"
            sx={{
              height: '100%',
              pb: 3,
            }}
          >
            <Stack spacing={1}>
              <Typography component="p" variant="body1">
                {t('drawers.delegatedEServiceArchivingRequestDrawer.firstParagraph')}
              </Typography>
              <Typography component="p" variant="body1">
                {request.archivingReason}
              </Typography>
              <Typography component="p" variant="body1">
                {t('drawers.delegatedEServiceArchivingRequestDrawer.secondParagraph')}
              </Typography>
              <Typography component="p" variant="body1">
                {t('drawers.delegatedEServiceArchivingRequestDrawer.thirdParagraph')}
              </Typography>
            </Stack>
            <Stack gap={1}>
              <Button
                variant="contained"
                size="small"
                onClick={() =>
                  openDialog({
                    type: 'delegatorConfirmArchivingEService',
                    eserviceId: descriptor.eservice.id,
                    delegatedName: descriptor.delegation?.delegate.name ?? '',
                    gracePeriodDays: request.gracePeriodDays,
                  })
                }
              >
                {t('drawers.delegatedEServiceArchivingRequestDrawer.archiveAction')}
              </Button>
              <Button
                variant="contained"
                size="small"
                color="error"
                sx={{
                  color: 'common.white',
                }}
                onClick={() =>
                  openDialog({
                    type: 'delegatorRejectArchivingEService',
                    eserviceId: descriptor.eservice.id,
                    delegatedName: descriptor.delegation?.delegate.name ?? '',
                  })
                }
              >
                {t('drawers.delegatedEServiceArchivingRequestDrawer.rejectAction')}
              </Button>
            </Stack>
          </Stack>
        </Drawer>
      </Stack>
    )
  }

  // CASE II: Archiving request for the current version
  if (request.descriptorId === descriptor.id) {
    return (
      <Stack mb={3}>
        <Alert severity="warning">
          <Stack direction="row" spacing={5}>
            <Box>
              {t('alert.delegatorDescriptorArchivingRequest', {
                date: formatDateStringNumeric(request.requestedAt),
                entity: descriptor?.delegation?.delegate.name,
              })}
            </Box>
            <Button
              variant="naked"
              startIcon={<ArchiveIcon />}
              size="small"
              sx={{
                whiteSpace: 'nowrap',
              }}
              onClick={() => setIsArchivingRequestDrawerOpen(true)}
            >
              {t('alert.delegatorArchivingRequestAction')}
            </Button>
          </Stack>
        </Alert>
        <Drawer
          isOpen={isArchivingRequestDrawerOpen}
          onClose={() => setIsArchivingRequestDrawerOpen(false)}
          title={t('drawers.delegatedEServiceDescriptorArchivingRequestDrawer.title')}
        >
          <Stack
            justifyContent="space-between"
            sx={{
              height: '100%',
              pb: 3,
            }}
          >
            <Stack spacing={1}>
              <Typography component="p" variant="body1">
                {t('drawers.delegatedEServiceDescriptorArchivingRequestDrawer.firstParagraph')}
              </Typography>
              <Typography component="p" variant="body1">
                {t('drawers.delegatedEServiceDescriptorArchivingRequestDrawer.secondParagraph')}
              </Typography>
              <Typography component="p" variant="body1">
                {t('drawers.delegatedEServiceDescriptorArchivingRequestDrawer.thirdParagraph')}
              </Typography>
            </Stack>
            <Stack gap={1}>
              <Button
                variant="contained"
                size="small"
                onClick={() =>
                  openDialog({
                    type: 'delegatorConfirmArchivingVersion',
                    eserviceId: descriptor.eservice.id,
                    descriptorId: descriptor.id,
                    delegatedName: descriptor.delegation?.delegate.name ?? '',
                    gracePeriodDays: request.gracePeriodDays,
                  })
                }
              >
                {t('drawers.delegatedEServiceDescriptorArchivingRequestDrawer.archiveAction')}
              </Button>
              <Button
                variant="contained"
                size="small"
                color="error"
                sx={{
                  color: 'common.white',
                }}
                onClick={() =>
                  openDialog({
                    type: 'delegatorRejectArchivingVersion',
                    eserviceId: descriptor.eservice.id,
                    descriptorId: descriptor.id,
                    delegatedName: descriptor.delegation?.delegate.name ?? '',
                  })
                }
              >
                {t('drawers.delegatedEServiceDescriptorArchivingRequestDrawer.rejectAction')}
              </Button>
            </Stack>
          </Stack>
        </Drawer>
      </Stack>
    )
  }

  // CASE III: Archiving request for version different from the current one
  return (
    <Stack mb={3}>
      <Alert severity="warning">
        {t('alert.delegatorDeprecatedDescriptorArchivingRequest', {
          entity: descriptor?.delegation?.delegate.name,
        })}
      </Alert>
    </Stack>
  )
}
