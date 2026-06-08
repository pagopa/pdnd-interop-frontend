import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from '@/router'
import { Alert, Button, Stack, Tooltip } from '@mui/material'
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
  ConsumerPurposeSummaryAssignmentAccordion,
  ConsumerPurposeSummaryGeneralInformationAccordion,
  ConsumerPurposeSummaryRiskAnalysisAccordion,
  ConsumerPurposeSummaryRiskAnalysisRejectedAlert,
} from './components'
import { useGetConsumerPurposeAlertProps } from './hooks/useGetConsumerPurposeAlertProps'
import { useGetPurposeRiskAnalysisReviewStatus } from './hooks/useGetPurposeRiskAnalysisReviewStatus'
import { useQuery } from '@tanstack/react-query'
import { AuthHooks } from '@/api/auth'
import { checkIsRulesetExpired } from '@/utils/purpose.utils'
import { ConsumerPurposeSummaryRiskAnalysisAlertContainer } from './components/ConsumerPurposeSummaryRiskAnalysisAlertContainer'

const ConsumerPurposeSummaryPage: React.FC = () => {
  const { t } = useTranslation('purpose')
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'actions' })

  const { purposeId } = useParams<'SUBSCRIBE_PURPOSE_SUMMARY'>()

  const { jwt } = AuthHooks.useJwt()

  const navigate = useNavigate()

  const { data: purpose, isLoading } = useQuery(PurposeQueries.getSingle(purposeId))

  const isEserviceDeliverMode = purpose?.eservice.mode === 'DELIVER'

  const expirationDate = purpose?.rulesetExpiration

  const isRulesetExpired = checkIsRulesetExpired(expirationDate)

  const alertProps = useGetConsumerPurposeAlertProps(purpose)

  const {
    chip: riskAnalysisChip,
    isAwaitingCompilation: isRiskAnalysisAwaitingCompilation,
    isRejected: isRiskAnalysisRejected,
    isPublishDisabledByReview,
    infoAlertText: riskAnalysisInfoAlertText,
  } = useGetPurposeRiskAnalysisReviewStatus(purpose)

  const eservicePersonalData = purpose?.eservice.personalData

  const checkIncompatibleAnswerValue = () => {
    const userAnswer = purpose?.riskAnalysisForm?.answers['usesPersonalData']?.[0]
    const isYes = userAnswer === 'YES'
    const isNo = userAnswer === 'NO'

    const incompatible =
      (isYes && eservicePersonalData !== true) || (isNo && eservicePersonalData !== false)

    return incompatible
  }

  const isPublishButtonDisabled =
    (purpose?.riskAnalysisForm &&
      eservicePersonalData !== undefined &&
      checkIncompatibleAnswerValue()) ||
    (isEserviceDeliverMode && isRulesetExpired)

  // Tooltip explaining why "Publish" is disabled, with the personal-data reason taking precedence.
  let publishDisabledTooltip = ''
  if (isPublishButtonDisabled) {
    publishDisabledTooltip = t('summary.publishBtnDisabled')
  } else if (isPublishDisabledByReview) {
    publishDisabledTooltip = t('summary.publishBtnDisabledByReview')
  }

  const arePublishOrEditButtonsDisabled =
    purpose?.agreement.state === 'ARCHIVED' || purpose?.eservice.descriptor.state === 'ARCHIVED'

  const { mutate: deleteDraft } = PurposeMutations.useDeleteDraft()
  const { mutate: publishDraft } = PurposeMutations.useActivateVersion()

  const isThereConsumerDelegation = Boolean(purpose?.delegation)
  const isDelegationMine =
    isThereConsumerDelegation && purpose?.delegation?.delegate.id === jwt?.organizationId //consumer side delegation

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
    if (purpose?.purposeTemplate?.id) {
      navigate('SUBSCRIBE_PURPOSE_FROM_TEMPLATE_EDIT', {
        params: {
          purposeId,
          purposeTemplateId: purpose.purposeTemplate.id,
        },
      })
    } else {
      navigate('SUBSCRIBE_PURPOSE_EDIT', {
        params: {
          purposeId,
        },
      })
    }
  }

  const handlePublishDraft = () => {
    if (!purpose?.currentVersion) return
    publishDraft(
      {
        purposeId,
        versionId: purpose.currentVersion.id,
        ...(isDelegationMine && { delegationId: purpose.delegation?.id }),
      },
      {
        onSuccess() {
          navigate('SUBSCRIBE_PURPOSE_PUBLISH_THANK_YOU', { params: { purposeId } })
        },
      }
    )
  }

  return (
    <PageContainer
      title={t('summary.title')}
      isLoading={isLoading}
      backToAction={{
        label: t('backToListBtn'),
        to: 'SUBSCRIBE_PURPOSE_LIST',
      }}
      statusChip={purpose ? { for: 'purpose', purpose } : undefined}
    >
      {alertProps && <Alert sx={{ mb: 3 }} {...alertProps} />}
      {isRiskAnalysisRejected && (
        <ConsumerPurposeSummaryRiskAnalysisRejectedAlert
          rejectionReason={purpose?.reviewerWorkflow?.rejectionReason ?? ''}
        />
      )}
      <Stack spacing={3}>
        <React.Suspense fallback={<SummaryAccordionSkeleton />}>
          <SummaryAccordion
            headline="1"
            title={t('summary.generalInformationSection.title')}
            defaultExpanded={true}
          >
            <ConsumerPurposeSummaryGeneralInformationAccordion purposeId={purposeId} />
          </SummaryAccordion>
        </React.Suspense>
        <React.Suspense fallback={<SummaryAccordionSkeleton />}>
          <SummaryAccordion headline="2" title={t('summary.assignmentSection.title')}>
            <ConsumerPurposeSummaryAssignmentAccordion purposeId={purposeId} />
          </SummaryAccordion>
        </React.Suspense>
        <React.Suspense fallback={<SummaryAccordionSkeleton />}>
          <SummaryAccordion
            headline="3"
            title={t('summary.riskAnalysisSection.title')}
            statusChip={riskAnalysisChip}
            hideBody={isRiskAnalysisAwaitingCompilation}
          >
            <ConsumerPurposeSummaryRiskAnalysisAccordion purposeId={purposeId} />
          </SummaryAccordion>
        </React.Suspense>
      </Stack>
      {isEserviceDeliverMode && (
        <ConsumerPurposeSummaryRiskAnalysisAlertContainer
          expirationDate={expirationDate}
          isRulesetExpired={isRulesetExpired}
        />
      )}
      {riskAnalysisInfoAlertText && (
        <Alert sx={{ mt: 3 }} severity="info">
          {riskAnalysisInfoAlertText}
        </Alert>
      )}
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

        <Tooltip title={publishDisabledTooltip} arrow>
          <span>
            <Button
              disabled={
                arePublishOrEditButtonsDisabled ||
                isPublishButtonDisabled ||
                isPublishDisabledByReview
              }
              startIcon={<PublishIcon />}
              variant="contained"
              onClick={handlePublishDraft}
            >
              {t('summary.publishBtn')}
            </Button>
          </span>
        </Tooltip>
      </Stack>
    </PageContainer>
  )
}

export default ConsumerPurposeSummaryPage
