import type { Purpose } from '@/api/api.generatedTypes'
import { IconLink } from '@/components/shared/IconLink'
import { Card, CardContent, CardHeader, Divider, Stack, Typography } from '@mui/material'
import React from 'react'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import { AuthHooks } from '@/api/auth'
import { Trans, useTranslation } from 'react-i18next'
import format from 'date-fns/format'
import { PurposeMutations } from '@/api/purpose'

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
      <CardContent sx={{ px: 3, pt: 1 }}>
        <Stack direction="column" spacing={2}>
          <Typography variant="h4">{waitingForApprovalVersion.dailyCalls}</Typography>
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
