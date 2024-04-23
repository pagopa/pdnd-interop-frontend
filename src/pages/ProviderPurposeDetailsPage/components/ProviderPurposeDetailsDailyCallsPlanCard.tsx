import type { Purpose } from '@/api/api.generatedTypes'
import { IconLink } from '@/components/shared/IconLink'
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Stack,
  Typography,
} from '@mui/material'
import React from 'react'
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline'
import EditCalendarIcon from '@mui/icons-material/EditCalendar'
import CloseIcon from '@mui/icons-material/Close'
import { PurposeMutations } from '@/api/purpose'
import { AuthHooks } from '@/api/auth'
import { ProviderPurposeDetailsDailyCallsActivationDateDrawer } from './ProviderPurposeDetailsDailyCallsActivationDateDrawer'
import { Trans, useTranslation } from 'react-i18next'
import format from 'date-fns/format'
import { formatThousands } from '@/utils/format.utils'
import { useDrawerState } from '@/hooks/useDrawerState'
import { useDialog } from '@/stores'

type ProviderPurposeDetailsDailyCallsPlanCardProps = {
  purpose: Purpose
}

export const ProviderPurposeDetailsDailyCallsPlanCard: React.FC<
  ProviderPurposeDetailsDailyCallsPlanCardProps
> = ({ purpose }) => {
  const { t } = useTranslation('purpose', {
    keyPrefix: 'providerView.sections.loadEstimate.planCard',
  })
  const { isAdmin } = AuthHooks.useJwt()
  const { mutate: activateVersion } = PurposeMutations.useActivateVersion()

  const {
    isOpen: isActivationDateDrawerOpen,
    openDrawer: openActivationDateDrawer,
    closeDrawer: closeActivationDateDrawer,
  } = useDrawerState()

  const { openDialog } = useDialog()

  const isSuspended = purpose.currentVersion?.state === 'SUSPENDED'
  const isArchived = purpose.currentVersion?.state === 'ARCHIVED'

  const waitingForApprovalVersion = purpose.waitingForApprovalVersion
  const isChangePlanRequest = Boolean(waitingForApprovalVersion) && Boolean(purpose.currentVersion)

  const title = waitingForApprovalVersion
    ? t(`title.waitingForApprovalPlan.${isChangePlanRequest ? 'changePlan' : 'newPurpose'}`)
    : t('title.activePlan')

  const handleSetApprovalDate = () => {
    if (!waitingForApprovalVersion || !isAdmin) return null
    openActivationDateDrawer()
  }

  const handleConfirmUpdate = () => {
    if (!waitingForApprovalVersion || !isAdmin) return null
    activateVersion({ purposeId: purpose.id, versionId: waitingForApprovalVersion.id })
  }

  const handleRejectUpdate = () => {
    if (!waitingForApprovalVersion || !isAdmin) return null
    openDialog({
      type: 'rejectPurposeVersion',
      purposeId: purpose.id,
      versionId: waitingForApprovalVersion.id,
      isChangePlanRequest:
        Boolean(purpose?.waitingForApprovalVersion) && Boolean(purpose?.currentVersion),
    })
  }

  return (
    <>
      <Card
        elevation={8}
        sx={{
          display: 'flex',
          flex: 1,
          flexDirection: 'column',
        }}
      >
        <CardHeader
          titleTypographyProps={{ variant: 'sidenav' }}
          title={title}
          subheaderTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
          subheader={t('subtitle')}
          action={
            isChangePlanRequest && (
              <>
                <Button
                  onClick={handleRejectUpdate}
                  variant="naked"
                  size="small"
                  color="error"
                  startIcon={<CloseIcon />}
                  disabled={isSuspended || isArchived}
                  sx={{ mr: 2 }}
                >
                  {t('rejectVersionButtonLabel.label')}
                </Button>
                <Button
                  onClick={handleConfirmUpdate}
                  variant="naked"
                  size="small"
                  color="primary"
                  startIcon={<PlayCircleOutlineIcon />}
                  disabled={isSuspended || isArchived}
                  sx={{ mr: 1 }}
                >
                  {t('activateVersionButtonLabel.label')}
                </Button>
              </>
            )
          }
          sx={{ px: 3, pt: 3, pb: 1 }}
        />
        <CardContent sx={{ px: 3, pt: 1 }}>
          {waitingForApprovalVersion ? (
            <Stack direction="column" spacing={2}>
              <Stack direction="row" alignItems="space-between">
                <Box flex={1}>
                  <Typography variant="h4">
                    {formatThousands(waitingForApprovalVersion.dailyCalls)}
                  </Typography>
                  <Typography variant="body2">
                    {t(
                      `waitingForApprovalPlan.label.${
                        isChangePlanRequest ? 'changePlan' : 'newPurpose'
                      }`
                    )}
                  </Typography>
                </Box>

                {purpose.currentVersion && (
                  <Box flex={1}>
                    <Typography variant="h4" color="text.secondary" fontWeight={400}>
                      {formatThousands(purpose.currentVersion?.dailyCalls)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('currentPlan.label')}
                    </Typography>
                  </Box>
                )}
              </Stack>
              <Divider />
              {waitingForApprovalVersion.expectedApprovalDate && (
                <Typography variant="body2">
                  <Trans
                    components={{
                      strong: <Typography component="span" variant="inherit" fontWeight={700} />,
                    }}
                  >
                    {t('expectApprovalDateInfo', {
                      date: format(
                        new Date(waitingForApprovalVersion.expectedApprovalDate),
                        'dd/MM/yyyy'
                      ),
                    })}
                  </Trans>
                </Typography>
              )}
              <IconLink
                onClick={handleSetApprovalDate}
                component="button"
                disabled={isSuspended || isArchived}
                startIcon={<EditCalendarIcon />}
                alignSelf="start"
              >
                {waitingForApprovalVersion.expectedApprovalDate
                  ? t('setApprovalDateLink.modifyLabel')
                  : t('setApprovalDateLink.insertLabel')}
              </IconLink>
            </Stack>
          ) : (
            <Typography variant="h4">
              {formatThousands(purpose.currentVersion!.dailyCalls)}
            </Typography>
          )}
        </CardContent>
      </Card>
      <ProviderPurposeDetailsDailyCallsActivationDateDrawer
        isOpen={isActivationDateDrawerOpen}
        onClose={closeActivationDateDrawer}
        purpose={purpose}
      />
    </>
  )
}
