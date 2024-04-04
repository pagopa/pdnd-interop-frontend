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
import { PurposeMutations } from '@/api/purpose'
import { AuthHooks } from '@/api/auth'
import { ProviderPurposeDetailsDailyCallsActivationDateDrawer } from './ProviderPurposeDetailsDailyCallsActivationDateDrawer'
import { Trans, useTranslation } from 'react-i18next'
import format from 'date-fns/format'
import { formatThousands } from '@/utils/format.utils'

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

  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false)

  const isSuspended = purpose.currentVersion?.state === 'SUSPENDED'
  const isArchived = purpose.currentVersion?.state === 'ARCHIVED'

  const waitingForApprovalVersion = purpose.waitingForApprovalVersion

  const title = waitingForApprovalVersion
    ? t('title.waitingForApprovalPlan')
    : t('title.activePlan')

  const handleSetApprovalDate = () => {
    if (!waitingForApprovalVersion || !isAdmin) return null
    setIsDrawerOpen(true)
  }

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false)
  }

  const handleConfirmUpdate = () => {
    if (!waitingForApprovalVersion || !isAdmin) return null
    activateVersion({ purposeId: purpose.id, versionId: waitingForApprovalVersion.id })
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
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <CardHeader
            sx={{ px: 3, pt: 3, pb: 1 }} // TODO metterli nello stack sopra
            disableTypography={true}
            title={
              <Stack spacing={1}>
                <Typography variant="sidenav">{title}</Typography>
                <Typography color="text.secondary" variant="body2">
                  {t('subtitle')}
                </Typography>
              </Stack>
            }
          />
          {/* TODO mettere il margin/padding nello stack sopra */}
          {waitingForApprovalVersion && (
            <Stack direction="row" spacing={2} sx={{ mr: 3 }}>
              <Button
                onClick={handleConfirmUpdate}
                variant="naked"
                size="small"
                color="primary"
                startIcon={<PlayCircleOutlineIcon />}
                disabled={isSuspended || isArchived}
              >
                {t('activateUpdateButtonLabel.label')}
              </Button>
            </Stack>
          )}
        </Stack>
        <CardContent sx={{ px: 3, pt: 1 }}>
          {waitingForApprovalVersion ? (
            <Stack direction="column" spacing={2}>
              <Stack direction="row" alignItems="space-between">
                <Box flex={1}>
                  <Typography variant="h4">
                    {formatThousands(waitingForApprovalVersion.dailyCalls)}
                  </Typography>
                  <Typography variant="body2">{t('waitingForApprovalPlan.label')}</Typography>
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
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        purpose={purpose}
      />
    </>
  )
}
