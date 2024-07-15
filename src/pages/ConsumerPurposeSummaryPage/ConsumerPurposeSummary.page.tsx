import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from '@/router'
import { Alert, Button, Stack } from '@mui/material'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import CreateIcon from '@mui/icons-material/Create'
import PublishIcon from '@mui/icons-material/Publish'
import { PurposeMutations, PurposeQueries } from '@/api/purpose'
import {
  SummaryAccordion,
  SummaryAccordionSkeleton,
} from '../../components/shared/SummaryAccordion'
import { PageContainer } from '@/components/layout/containers'
import {
  ConsumerPurposeSummaryGeneralInformationAccordion,
  ConsumerPurposeSummaryRiskAnalysisAccordion,
} from './components'
import { useGetConsumerPurposeAlertProps } from './hooks/useGetConsumerPurposeAlertProps'
import { useCheckRiskAnalysisVersionMismatch } from '@/hooks/useCheckRiskAnalysisVersionMismatch'

const ConsumerPurposeSummaryPage: React.FC = () => {
  const { t } = useTranslation('purpose')
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'actions' })

  const { purposeId } = useParams<'SUBSCRIBE_PURPOSE_SUMMARY'>()

  const navigate = useNavigate()

  const { data: purpose, isInitialLoading } = PurposeQueries.useGetSingle(purposeId, {
    suspense: false,
  })

  const hasRiskAnalysisVersionMismatch = useCheckRiskAnalysisVersionMismatch(purpose)
  const alertProps = useGetConsumerPurposeAlertProps(purpose)

  const arePublishOrEditButtonsDisabled =
    hasRiskAnalysisVersionMismatch ||
    purpose?.agreement.state === 'ARCHIVED' ||
    purpose?.eservice.descriptor.state === 'ARCHIVED'

  const { mutate: deleteDraft } = PurposeMutations.useDeleteDraft()
  const { mutate: publishDraft } = PurposeMutations.useActivateVersion()

  const handleDeleteDraft = () => {
    deleteDraft(
      { purposeId },
      {
        onSuccess() {
          navigate('SUBSCRIBE_PURPOSE_LIST')
        },
      }
    )
  }

  const handleEditDraft = () => {
    navigate('SUBSCRIBE_PURPOSE_EDIT', {
      params: {
        purposeId,
      },
    })
  }

  const handlePublishDraft = () => {
    if (!purpose?.currentVersion) return
    publishDraft(
      { purposeId, versionId: purpose.currentVersion.id },
      {
        onSuccess() {
          navigate('SUBSCRIBE_PURPOSE_DETAILS', {
            params: {
              purposeId,
            },
          })
        },
      }
    )
  }

  return (
    <PageContainer
      title={purpose?.title}
      isLoading={isInitialLoading}
      backToAction={{
        label: t('backToListBtn'),
        to: 'SUBSCRIBE_PURPOSE_LIST',
      }}
      statusChip={purpose ? { for: 'purpose', purpose } : undefined}
    >
      {alertProps && <Alert sx={{ mb: 3 }} {...alertProps} />}

      <Stack spacing={3}>
        <React.Suspense fallback={<SummaryAccordionSkeleton />}>
          <SummaryAccordion headline="1" title={t('summary.generalInformationSection.title')}>
            <ConsumerPurposeSummaryGeneralInformationAccordion purposeId={purposeId} />
          </SummaryAccordion>
        </React.Suspense>
        <React.Suspense fallback={<SummaryAccordionSkeleton />}>
          <SummaryAccordion headline="2" title={t('summary.riskAnalysisSection.title')}>
            <ConsumerPurposeSummaryRiskAnalysisAccordion purposeId={purposeId} />
          </SummaryAccordion>
        </React.Suspense>
      </Stack>

      <Stack spacing={1} sx={{ mt: 4 }} direction="row" justifyContent="end">
        <Button
          startIcon={<DeleteOutlineIcon />}
          variant="text"
          color="error"
          onClick={handleDeleteDraft}
        >
          {tCommon('deleteDraft')}
        </Button>
        <Button
          disabled={arePublishOrEditButtonsDisabled}
          startIcon={<CreateIcon />}
          variant="text"
          onClick={handleEditDraft}
        >
          {tCommon('editDraft')}
        </Button>
        <Button
          disabled={arePublishOrEditButtonsDisabled}
          startIcon={<PublishIcon />}
          variant="contained"
          onClick={handlePublishDraft}
        >
          {tCommon('publish')}
        </Button>
      </Stack>
    </PageContainer>
  )
}

export default ConsumerPurposeSummaryPage
