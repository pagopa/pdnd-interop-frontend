import React from 'react'
import { Alert, Box, Link, Stack } from '@mui/material'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { match } from 'ts-pattern'
import { RHFAutocompleteSingle, RHFRadioGroup } from '@/components/shared/react-hook-form-inputs'
import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { StepActions } from '@/components/shared/StepActions'
import type { ActiveStepProps } from '@/hooks/useActiveStep'
import type {
  Purpose,
  RiskAnalysisAssignmentSeed,
  RiskAnalysisReviewMode,
  User,
} from '@/api/api.generatedTypes'
import { PurposeMutations } from '@/api/purpose'
import { useNavigate } from '@/router'
import SaveIcon from '@mui/icons-material/Save'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'

export type ReviewModeOption =
  | 'selfWritesSelfSigns'
  | 'selfWritesReviewerSigns'
  | 'reviewerWritesReviewerSigns'

export type PurposeEditStepAssignmentFormValues = {
  reviewMode: ReviewModeOption
  reviewerId?: string
}

const reviewModeOptionToBeEnum = (option: ReviewModeOption): RiskAnalysisReviewMode | undefined =>
  match(option)
    .with('selfWritesSelfSigns', () => undefined)
    .with('selfWritesReviewerSigns', () => 'ADMIN_WRITES_REVIEWER_SIGNS' as const)
    .with('reviewerWritesReviewerSigns', () => 'REVIEWER_WRITES_REVIEWER_SIGNS' as const)
    .exhaustive()

type PurposeEditStepAssignmentFormProps = ActiveStepProps & {
  purpose: Purpose
  reviewers: Array<User>
  isDelegate: boolean
  selfcareUsersPageUrl?: string
  defaultValues: PurposeEditStepAssignmentFormValues
}

export const PurposeEditStepAssignmentForm: React.FC<PurposeEditStepAssignmentFormProps> = ({
  purpose,
  reviewers,
  isDelegate,
  selfcareUsersPageUrl,
  defaultValues,
  forward,
}) => {
  const { t } = useTranslation('purpose', { keyPrefix: 'edit.stepAssignment' })
  const { mutate: assignReviewer } = PurposeMutations.useAssignRiskAnalysisReviewer()
  const navigate = useNavigate()

  const hasNoReviewers = reviewers.length === 0
  const isFormHidden = isDelegate || hasNoReviewers

  const formMethods = useForm<PurposeEditStepAssignmentFormValues>({ defaultValues })

  const reviewMode = formMethods.watch('reviewMode')
  const needsReviewer =
    reviewMode === 'selfWritesReviewerSigns' || reviewMode === 'reviewerWritesReviewerSigns'
  const isRequestReviewerCompilation = reviewMode === 'reviewerWritesReviewerSigns'

  const goToSummary = () => {
    navigate('SUBSCRIBE_PURPOSE_SUMMARY', { params: { purposeId: purpose.id } })
  }

  const onSubmit = ({ reviewMode, reviewerId }: PurposeEditStepAssignmentFormValues) => {
    if (isFormHidden) {
      forward()
      return
    }

    const reviewModeEnum = reviewModeOptionToBeEnum(reviewMode)
    if (!reviewModeEnum || !reviewerId) {
      forward()
      return
    }

    const payload: { purposeId: string } & RiskAnalysisAssignmentSeed = {
      purposeId: purpose.id,
      reviewMode: reviewModeEnum,
      reviewerIds: [reviewerId],
    }

    // TODO[PIN-10138]: for reviewMode = REVIEWER_WRITES_REVIEWER_SIGNS the submit should
    // first open a confirmation dialog (tracked in a separate task) before calling the API.
    assignReviewer(payload, {
      onSuccess: isRequestReviewerCompilation ? goToSummary : forward,
    })
  }

  const reviewerOptions = reviewers.map((u) => ({
    label: `${u.name} ${u.familyName}`.trim(),
    value: u.userId,
  }))

  const reviewerLabelKey = isRequestReviewerCompilation
    ? 'reviewerWritesReviewerSigns'
    : 'selfWritesReviewerSigns'

  return (
    <FormProvider {...formMethods}>
      <Box component="form" noValidate onSubmit={formMethods.handleSubmit(onSubmit)}>
        <SectionContainer title={t('title')} description={t('description')}>
          <Stack spacing={3}>
            {isDelegate && <Alert severity="warning">{t('delegateAlert')}</Alert>}
            {!isDelegate && hasNoReviewers && (
              <Alert severity="info">
                {t('noReviewersAlert.message')}{' '}
                {selfcareUsersPageUrl && (
                  <Link href={selfcareUsersPageUrl} target="_blank" rel="noopener noreferrer">
                    {t('noReviewersAlert.linkLabel')}
                  </Link>
                )}
              </Alert>
            )}
            {!isFormHidden && (
              <>
                <RHFRadioGroup
                  name="reviewMode"
                  label={t('reviewModeField.label')}
                  required
                  rules={{ required: true }}
                  options={[
                    {
                      label: t('reviewModeField.options.selfWritesSelfSigns'),
                      value: 'selfWritesSelfSigns',
                    },
                    {
                      label: t('reviewModeField.options.selfWritesReviewerSigns'),
                      value: 'selfWritesReviewerSigns',
                    },
                    {
                      label: t('reviewModeField.options.reviewerWritesReviewerSigns'),
                      value: 'reviewerWritesReviewerSigns',
                    },
                  ]}
                />
                {needsReviewer && (
                  <RHFAutocompleteSingle
                    name="reviewerId"
                    label={t(`reviewerField.label.${reviewerLabelKey}`)}
                    options={reviewerOptions}
                    rules={{ required: t('reviewerField.requiredError') }}
                  />
                )}
              </>
            )}
          </Stack>
        </SectionContainer>
        <StepActions
          back={{ to: 'SUBSCRIBE_PURPOSE_LIST', label: t('backToListBtn'), type: 'link' }}
          forward={{
            label: isRequestReviewerCompilation
              ? t('requestReviewerCompilationBtn')
              : t('forwardBtn'),
            type: 'submit',
            startIcon: isRequestReviewerCompilation ? undefined : <SaveIcon />,
            endIcon: isRequestReviewerCompilation ? <ArrowForwardIcon /> : undefined,
          }}
        />
      </Box>
    </FormProvider>
  )
}

export const PurposeEditStepAssignmentFormSkeleton: React.FC = () => {
  return <SectionContainerSkeleton height={400} />
}

export default PurposeEditStepAssignmentForm
