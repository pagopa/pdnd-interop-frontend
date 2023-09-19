import type { Purpose } from '@/api/api.generatedTypes'
import { IconLink } from '@/components/shared/IconLink'
import { Card, CardContent, CardHeader, Divider, Stack, Typography } from '@mui/material'
import React from 'react'
import PlusOneIcon from '@mui/icons-material/PlusOne'
import { AuthHooks } from '@/api/auth'
import { useTranslation } from 'react-i18next'
import { ConsumerPurposeDetailsDailyCallsUpdateDrawer } from './ConsumerPurposeDetailsDailyCallsUpdateDrawer'
import { Box } from '@mui/system'

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

  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false)

  const isSuspended = purpose.currentVersion?.state === 'SUSPENDED'
  const isArchived = purpose.currentVersion?.state === 'ARCHIVED'

  const handleRequestPlanChange = () => {
    if (!isAdmin) return null
    setIsDrawerOpen(true)
  }

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false)
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
              <Typography variant="sidenav">{t('title')}</Typography>
              <Typography color="text.secondary" variant="body2">
                {t('subtitle')}
              </Typography>
            </Stack>
          }
        />
        <CardContent sx={{ px: 3, pt: 1, display: 'flex', flexGrow: 1 }}>
          <Stack direction="column" spacing={2} flexGrow={1}>
            <Box flexGrow={1}>
              <Typography variant="h4">
                {purpose.currentVersion?.dailyCalls ??
                  purpose.waitingForApprovalVersion?.dailyCalls}
              </Typography>
            </Box>
            <Divider />
            <IconLink
              onClick={handleRequestPlanChange}
              component="button"
              disabled={isSuspended || isArchived}
              startIcon={<PlusOneIcon />}
              alignSelf="start"
            >
              {t('changePlanRequestLink.label')}
            </IconLink>
          </Stack>
        </CardContent>
      </Card>
      <ConsumerPurposeDetailsDailyCallsUpdateDrawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        purpose={purpose}
      />
    </>
  )
}
