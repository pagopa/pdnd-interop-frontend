import type { Purpose } from '@/api/api.generatedTypes'
import { IconLink } from '@/components/shared/IconLink'
import { Box, Card, CardContent, CardHeader, Divider, Stack, Typography } from '@mui/material'
import React from 'react'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import { AuthHooks } from '@/api/auth'
import { useTranslation } from 'react-i18next'
import { PurposeMutations } from '@/api/purpose'
import { formatThousands } from '@/utils/format.utils'

type ConsumerPurposeDetailsDailyCallsUpdatePlanCardProps = {
  purpose: Purpose
}

export const ConsumerPurposeDetailsDailyCallsUpdatePlanCard: React.FC<
  ConsumerPurposeDetailsDailyCallsUpdatePlanCardProps
> = ({ purpose }) => {
  const { t } = useTranslation('purpose', {
    keyPrefix: 'consumerView.sections.loadEstimate.updatePlanCard',
  })
  const { isAdmin } = AuthHooks.useJwt()
  const { mutate: deletePurposeVersion } = PurposeMutations.useDeleteVersion()

  const isSuspended = purpose.currentVersion?.state === 'SUSPENDED'

  const waitingForApprovalVersion = purpose.waitingForApprovalVersion

  if (!waitingForApprovalVersion || !isAdmin || !purpose.currentVersion) return null

  function handleDeleteDailyCallsUpdate() {
    if (!purpose?.waitingForApprovalVersion) return
    deletePurposeVersion({ purposeId: purpose.id, versionId: purpose.waitingForApprovalVersion.id })
  }

  return (
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
        title={t('title')}
        subheaderTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
        subheader={t('subtitle')}
      />
      <CardContent sx={{ px: 3, pt: 1, display: 'flex', flexGrow: 1 }}>
        <Stack direction="column" spacing={2} flexGrow={1}>
          <Box flexGrow={1}>
            <Typography variant="h4">
              {formatThousands(waitingForApprovalVersion.dailyCalls)}
            </Typography>
          </Box>
          <Divider />
          <IconLink
            onClick={handleDeleteDailyCallsUpdate}
            component="button"
            disabled={isSuspended}
            startIcon={<DeleteOutlineIcon />}
            alignSelf="start"
            color="error"
          >
            {t('removeChangePlanRequestLink.label')}
          </IconLink>
        </Stack>
      </CardContent>
    </Card>
  )
}
