import type { Purpose } from '@/api/api.generatedTypes'
import { Box, Button, Card, CardContent, CardHeader, Stack, Typography } from '@mui/material'
import React from 'react'
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline'
import CloseIcon from '@mui/icons-material/Close'
import { PurposeMutations } from '@/api/purpose'
import { AuthHooks } from '@/api/auth'
import { useTranslation } from 'react-i18next'
import { formatThousands } from '@/utils/format.utils'
import { useDialog } from '@/stores'
import { DelegationQueries } from '@/api/delegation'
import { useQuery } from '@tanstack/react-query'

type ProviderPurposeDetailsDailyCallsPlanCardProps = {
  purpose: Purpose
}

export const ProviderPurposeDetailsDailyCallsPlanCard: React.FC<
  ProviderPurposeDetailsDailyCallsPlanCardProps
> = ({ purpose }) => {
  const { t } = useTranslation('purpose', {
    keyPrefix: 'providerView.sections.loadEstimate.planCard',
  })
  const { jwt, isAdmin } = AuthHooks.useJwt()
  const { mutate: activateVersion } = PurposeMutations.useActivateVersion()

  const { openDialog } = useDialog()

  const isSuspended = purpose.currentVersion?.state === 'SUSPENDED'
  const isArchived = purpose.currentVersion?.state === 'ARCHIVED'

  const waitingForApprovalVersion = purpose.waitingForApprovalVersion
  const isChangePlanRequest = Boolean(waitingForApprovalVersion) && Boolean(purpose.currentVersion)

  const rejectedVersion = purpose.rejectedVersion
  const isNewPurposeRejected = Boolean(rejectedVersion) && !Boolean(purpose.currentVersion)

  const { data: producerDelegation = [] } = useQuery({
    ...DelegationQueries.getList({
      limit: 1,
      offset: 0,
      eserviceIds: [purpose?.eservice.id as string],
      kind: 'DELEGATED_PRODUCER',
      states: ['ACTIVE'],
      delegateIds: [jwt?.organizationId as string],
    }),
    enabled: Boolean(jwt?.organizationId),
    select: ({ results }) => results ?? [],
  })

  const isThereProducerDelegation = Boolean(producerDelegation[0])

  const title = React.useMemo(() => {
    if (waitingForApprovalVersion)
      return t(`title.waitingForApprovalPlan.${isChangePlanRequest ? 'changePlan' : 'newPurpose'}`)

    if (isNewPurposeRejected) return t('title.rejectedPlan')

    return t('title.activePlan')
  }, [isChangePlanRequest, isNewPurposeRejected, t, waitingForApprovalVersion])

  const handleConfirmUpdate = () => {
    if (!waitingForApprovalVersion || !isAdmin) return null
    activateVersion({
      purposeId: purpose.id,
      versionId: waitingForApprovalVersion.id,
      ...(isThereProducerDelegation && { delegationId: producerDelegation[0].id }),
    })
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
          subheaderTypographyProps={{ variant: 'body2', color: 'text.secondary', mt: 1 }}
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
          {waitingForApprovalVersion && (
            <Stack direction="row" alignItems="space-between">
              {purpose.currentVersion && (
                <Box flex={1}>
                  <Typography variant="h4">
                    {formatThousands(purpose.currentVersion?.dailyCalls)}
                  </Typography>
                  <Typography variant="body2">{t('currentPlan.label')}</Typography>
                </Box>
              )}

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
            </Stack>
          )}
          {isNewPurposeRejected && (
            <Typography variant="h4">
              {formatThousands(purpose.rejectedVersion!.dailyCalls)}
            </Typography>
          )}
          {!waitingForApprovalVersion && !isNewPurposeRejected && (
            <Typography variant="h4">
              {formatThousands(purpose.currentVersion!.dailyCalls)}
            </Typography>
          )}
        </CardContent>
      </Card>
    </>
  )
}
