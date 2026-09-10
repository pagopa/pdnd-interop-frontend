import React from 'react'
import { Alert, Button, Stack, Box, Typography } from '@mui/material'
import ArchiveIcon from '@mui/icons-material/Archive'
import { useTranslation } from 'react-i18next'
import type { ProducerEServiceDescriptor } from '@/api/api.generatedTypes'
import { Drawer } from '@/components/shared/Drawer'
import { useDialog } from '@/stores'
import { formatDateStringNumeric } from '@/utils/format.utils'
import { AuthHooks } from '@/api/auth'
import { useNavigate } from '@/router'

type ProviderEServiceDelegatorArchivingAlertProps = {
  descriptor?: ProducerEServiceDescriptor
}

export const ProviderEServiceDelegatorArchivingAlert: React.FC<
  ProviderEServiceDelegatorArchivingAlertProps
> = ({ descriptor }) => {
  const { jwt } = AuthHooks.useJwt()
  const [isArchivingRequestDrawerOpen, setIsArchivingRequestDrawerOpen] = React.useState(false)
  const { t } = useTranslation('eservice', { keyPrefix: 'read' })
  const navigate = useNavigate()

  const { openDialog } = useDialog()

  if (!descriptor) return

  const isDelegator = Boolean(
    jwt?.organizationId &&
      descriptor.delegation?.delegator.id &&
      jwt.organizationId === descriptor.delegation.delegator.id
  )

  if (!isDelegator) return

  const request = descriptor.eservice.delegatedArchivingRequest

  if (!request || request.rejectedAt || request.acceptedAt) return

  let alert = ''
  let drawer = true
  let title = ''
  let firstParagraph = ''
  let secondParagraph = ''
  let thirdParagraph = ''
  let archive = ''
  let reject = ''

  if (!request.descriptorId) {
    // CASE I: Archiving request for e-service
    alert = t('alert.delegatorEServiceArchivingRequest', {
      date: formatDateStringNumeric(request.requestedAt),
      entity: descriptor.delegation?.delegate.name,
    })
    title = t('drawers.delegatedEServiceArchivingRequestDrawer.title')
    firstParagraph = t('drawers.delegatedEServiceArchivingRequestDrawer.firstParagraph')
    secondParagraph = t('drawers.delegatedEServiceArchivingRequestDrawer.secondParagraph')
    thirdParagraph = t('drawers.delegatedEServiceArchivingRequestDrawer.thirdParagraph')
    archive = t('drawers.delegatedEServiceArchivingRequestDrawer.archiveAction')
    reject = t('drawers.delegatedEServiceArchivingRequestDrawer.rejectAction')
  } else if (request.descriptorId === descriptor.id) {
    // CASE II: Archiving request for the current version
    alert = t('alert.delegatorDescriptorArchivingRequest', {
      date: formatDateStringNumeric(request.requestedAt),
      entity: descriptor?.delegation?.delegate.name,
    })
    title = t('drawers.delegatedEServiceDescriptorArchivingRequestDrawer.title')
    firstParagraph = t('drawers.delegatedEServiceDescriptorArchivingRequestDrawer.firstParagraph')
    secondParagraph = t('drawers.delegatedEServiceDescriptorArchivingRequestDrawer.secondParagraph')
    thirdParagraph = t('drawers.delegatedEServiceDescriptorArchivingRequestDrawer.thirdParagraph')
    archive = t('drawers.delegatedEServiceDescriptorArchivingRequestDrawer.archiveAction')
    reject = t('drawers.delegatedEServiceDescriptorArchivingRequestDrawer.rejectAction')
  } else {
    // CASE III: Archiving request for version different from the current one
    alert = t('alert.delegatorDeprecatedDescriptorArchivingRequest', {
      entity: descriptor?.delegation?.delegate.name,
    })
    drawer = false
  }

  return (
    <Stack mb={3}>
      <Alert severity="warning">
        <Stack direction="row" spacing={5}>
          <Box>{alert}</Box>
          <Button
            variant="naked"
            startIcon={<ArchiveIcon />}
            size="small"
            sx={{
              whiteSpace: 'nowrap',
            }}
            onClick={() => {
              if (request.descriptorId && request.descriptorId !== descriptor.id) {
                navigate('PROVIDE_ESERVICE_MANAGE', {
                  params: {
                    eserviceId: descriptor.eservice.id,
                    descriptorId: request.descriptorId ?? '',
                  },
                })
              } else {
                setIsArchivingRequestDrawerOpen(true)
              }
            }}
          >
            {t('alert.delegatorArchivingRequestAction')}
          </Button>
        </Stack>
      </Alert>
      {drawer && (
        <Drawer
          isOpen={isArchivingRequestDrawerOpen}
          onClose={() => setIsArchivingRequestDrawerOpen(false)}
          title={title}
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
                {firstParagraph}
              </Typography>
              {request.archivingReason && (
                <Typography component="p" variant="body1">
                  {request.archivingReason}
                </Typography>
              )}
              <Typography component="p" variant="body1">
                {secondParagraph}
              </Typography>
              <Typography component="p" variant="body1">
                {thirdParagraph}
              </Typography>
            </Stack>
            <Stack gap={1}>
              <Button
                variant="contained"
                size="small"
                onClick={() =>
                  openDialog({
                    type: 'delegatorConfirmArchiving',
                    eserviceId: descriptor.eservice.id,
                    descriptorId: request.descriptorId,
                    delegatedName: descriptor.delegation?.delegate.name ?? '',
                    gracePeriodDays: request.gracePeriodDays,
                  })
                }
              >
                {archive}
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
                    type: 'delegatorRejectArchiving',
                    eserviceId: descriptor.eservice.id,
                    descriptorId: request.descriptorId,
                    delegatedName: descriptor.delegation?.delegate.name ?? '',
                  })
                }
              >
                {reject}
              </Button>
            </Stack>
          </Stack>
        </Drawer>
      )}
    </Stack>
  )
}
