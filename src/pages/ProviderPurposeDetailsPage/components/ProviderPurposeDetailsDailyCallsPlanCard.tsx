import type { Purpose } from '@/api/api.generatedTypes'
import { IconLink } from '@/components/shared/IconLink'
import { Card, CardContent, CardHeader, Divider, Stack, Typography } from '@mui/material'
import React from 'react'
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline'
import EditCalendarIcon from '@mui/icons-material/EditCalendar'
import { PurposeMutations } from '@/api/purpose'
import { AuthHooks } from '@/api/auth'
import { ProviderPurposeDetailsDailyCallsActivationDateDrawer } from './ProviderPurposeDetailsDailyCallsActivationDateDrawer'
import { Trans, useTranslation } from 'react-i18next'
import format from 'date-fns/format'

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
        <CardHeader
          sx={{ px: 3, pt: 3, pb: 1 }}
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
        <CardContent sx={{ px: 3, pt: 1 }}>
          {waitingForApprovalVersion ? (
            <Stack direction="column" spacing={2}>
              <Stack direction="row" alignItems="end" spacing={1}>
                {purpose.currentVersion && (
                  <Typography variant="body2" sx={{ textDecorationLine: 'line-through' }}>
                    {purpose.currentVersion?.dailyCalls}
                  </Typography>
                )}
                <Typography variant="h4">{waitingForApprovalVersion.dailyCalls}</Typography>
              </Stack>
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
              <Divider />
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
              <IconLink
                onClick={handleConfirmUpdate}
                component="button"
                disabled={isSuspended || isArchived}
                startIcon={<PlayCircleOutlineIcon />}
                alignSelf="start"
              >
                {t('activateUpdateLink.label')}
              </IconLink>
            </Stack>
          ) : (
            <Typography variant="h4">{purpose.currentVersion?.dailyCalls}</Typography>
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
