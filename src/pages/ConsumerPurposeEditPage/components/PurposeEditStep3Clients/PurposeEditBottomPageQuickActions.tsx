import React from 'react'
import { PurposeMutations, PurposeQueries } from '@/api/purpose'
import { Button, Stack } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useNavigateRouter } from '@/router'
import {
  PageBottomActionsCardContainer,
  PageBottomActionsCardContainerSkeleton,
} from '@/components/layout/containers/PageBottomCardContainer'

interface PurposeEditBottomPageQuickActionsProps {
  purposeId: string
}

export const PurposeEditBottomPageQuickActions: React.FC<
  PurposeEditBottomPageQuickActionsProps
> = ({ purposeId }) => {
  const { t } = useTranslation('purpose', { keyPrefix: 'edit' })
  const { navigate } = useNavigateRouter()
  const { data: purpose } = PurposeQueries.useGetSingle(purposeId)
  const { mutate: deleteDraft } = PurposeMutations.useDeleteDraft()
  const { mutate: publishDraft } = PurposeMutations.useActivateVersion()

  const handleDeleteDraft = () => {
    if (!purpose) return
    deleteDraft(
      { purposeId },
      {
        onSuccess() {
          navigate('SUBSCRIBE_PURPOSE_LIST')
        },
      }
    )
  }

  const handlePublishDraft = () => {
    if (!purpose || !purpose.currentVersion) return
    publishDraft(
      { purposeId, versionId: purpose.currentVersion.id },
      {
        onSuccess() {
          navigate('SUBSCRIBE_PURPOSE_LIST')
        },
      }
    )
  }

  return (
    <PageBottomActionsCardContainer
      title={t('quickPublish.title')}
      description={t('quickPublish.description')}
    >
      <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
        <Button variant="outlined" onClick={handleDeleteDraft}>
          {t('quickPublish.deleteBtn')}
        </Button>
        <Button variant="contained" onClick={handlePublishDraft}>
          {t('quickPublish.publishBtn')}
        </Button>
      </Stack>
    </PageBottomActionsCardContainer>
  )
}

export const PurposeEditBottomPageQuickActionsSkeleton: React.FC = () => {
  return <PageBottomActionsCardContainerSkeleton height={240} />
}
