import type { Purpose } from '@/api/api.generatedTypes'
import { IconLink } from '@/components/shared/IconLink'
import { Card, CardContent, CardHeader, Divider, Stack, Typography } from '@mui/material'
import React from 'react'
import PlusOneIcon from '@mui/icons-material/PlusOne'
import { AuthHooks } from '@/api/auth'
import { useTranslation } from 'react-i18next'
import { ConsumerPurposeDetailsDailyCallsUpdateDrawer } from './ConsumerPurposeDetailsDailyCallsUpdateDrawer'
import { Box } from '@mui/system'
import { formatThousands } from '@/utils/format.utils'
import { useDrawerState } from '@/hooks/useDrawerState'

type ConsumerPurposeDetailsDailyCallsPlanCardProps = {
  purpose: Purpose
}

export const ConsumerPurposeDetailsDailyCallsPlanCard: React.FC<
  ConsumerPurposeDetailsDailyCallsPlanCardProps
> = ({ purpose }) => {
  const { t } = useTranslation('purpose', {
    keyPrefix: 'consumerView.sections.loadEstimate.planCard',
  })
  const { isAdmin } = AuthHooks.useJwt()

  const { isOpen, openDrawer, closeDrawer } = useDrawerState()

  const isSuspended = purpose.currentVersion?.state === 'SUSPENDED'
  const isArchived = purpose.currentVersion?.state === 'ARCHIVED'

  const waitingForApprovalVersion = purpose.waitingForApprovalVersion
  const isNewPurposeWaitingForApproval =
    Boolean(waitingForApprovalVersion) && !Boolean(purpose.currentVersion)

  const rejectedVersion = purpose.rejectedVersion
  const isNewPurposeRejected = Boolean(rejectedVersion) && !Boolean(purpose.currentVersion)

  const title = React.useMemo(() => {
    if (waitingForApprovalVersion) return t(`title.waitingForApprovalPlan`)

    if (isNewPurposeRejected) return t('title.rejectedPlan')

    return t('title.activePlan')
  }, [isNewPurposeRejected, t, waitingForApprovalVersion])

  const dailyCalls = React.useMemo(() => {
    if (isNewPurposeWaitingForApproval) return waitingForApprovalVersion!.dailyCalls

    if (isNewPurposeRejected) return rejectedVersion!.dailyCalls

    return purpose.currentVersion!.dailyCalls
  }, [
    isNewPurposeRejected,
    isNewPurposeWaitingForApproval,
    purpose.currentVersion,
    rejectedVersion,
    waitingForApprovalVersion,
  ])

  const handleRequestPlanChange = () => {
    if (!isAdmin) return null
    openDrawer()
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
          titleTypographyProps={{ variant: 'sidenav' }}
          title={title}
          subheaderTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
          subheader={t('subtitle')}
        />
        <CardContent sx={{ px: 3, pt: 1, display: 'flex', flexGrow: 1 }}>
          <Stack direction="column" spacing={2} flexGrow={1}>
            <Box flexGrow={1}>
              <Typography variant="h4">{formatThousands(dailyCalls)}</Typography>
            </Box>
            {!(isSuspended || isArchived || waitingForApprovalVersion || isNewPurposeRejected) && (
              <>
                <Divider />
                <IconLink
                  onClick={handleRequestPlanChange}
                  component="button"
                  startIcon={<PlusOneIcon />}
                  alignSelf="start"
                >
                  {t('changePlanRequestLink.label')}
                </IconLink>
              </>
            )}
          </Stack>
        </CardContent>
      </Card>
      <ConsumerPurposeDetailsDailyCallsUpdateDrawer
        isOpen={isOpen}
        onClose={closeDrawer}
        purpose={purpose}
      />
    </>
  )
}
