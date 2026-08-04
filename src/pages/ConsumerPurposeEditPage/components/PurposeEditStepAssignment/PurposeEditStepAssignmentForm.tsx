import React from 'react'
import {
  Alert,
  Box,
  type FilterOptionsState,
  Link,
  Stack,
  Typography,
  createFilterOptions,
} from '@mui/material'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { match, P } from 'ts-pattern'
import { RHFAutocompleteMultiple, RHFRadioGroup } from '@/components/shared/react-hook-form-inputs'
import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { StepActions } from '@/components/shared/StepActions'
import type { ActiveStepProps } from '@/hooks/useActiveStep'
import type {
  CompactUser,
  Purpose,
  RiskAnalysisAssignmentSeed,
  RiskAnalysisReviewMode,
  User,
} from '@/api/api.generatedTypes'
import { PurposeMutations } from '@/api/purpose'
import { useDialog } from '@/stores'
import { useNavigate } from '@/router'
import SaveIcon from '@mui/icons-material/Save'
import SendIcon from '@mui/icons-material/Send'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

export type PurposeEditStepAssignmentFormValues = {
  reviewMode: RiskAnalysisReviewMode
  reviewerIds: Array<string>
}

type ReviewerOption = { label: string; value: string }

const getFullName = (user: Pick<CompactUser, 'name' | 'familyName'>) =>
  `${user.name} ${user.familyName}`.trim()

/** Modes other than self-compilation and self-approval require at least one reviewer. */
export const checkReviewModeNeedsReviewers = (reviewMode: RiskAnalysisReviewMode) =>
  match(reviewMode)
    .with('ADMIN_WRITES_ADMIN_SIGNS', () => false)
    .with(P.union('ADMIN_WRITES_REVIEWER_SIGNS', 'REVIEWER_WRITES_REVIEWER_SIGNS'), () => true)
    .exhaustive()

const filterReviewerOptions = createFilterOptions<ReviewerOption>()

type PurposeEditStepAssignmentFormProps = ActiveStepProps & {
  purpose: Purpose
  reviewers: Array<User>
  isDelegate: boolean
  selfcareUsersPageUrl?: string
  defaultValues: PurposeEditStepAssignmentFormValues
}

const PurposeEditStepAssignmentForm: React.FC<PurposeEditStepAssignmentFormProps> = ({
  purpose,
  reviewers,
  isDelegate,
  selfcareUsersPageUrl,
  defaultValues,
  forward,
  back,
}) => {
  const { t } = useTranslation('purpose', { keyPrefix: 'edit.stepAssignment' })
  const { t: tEdit } = useTranslation('purpose', { keyPrefix: 'edit' })
  const navigate = useNavigate()
  const { openDialog } = useDialog()

  // A purpose only carries a review mode once the assignment step has been completed, so its
  // absence marks the first compilation (this holds for purposes predating the reviewer feature
  // too). Saving an assignment that already exists is an edit instead, which asks for confirmation
  // through its own dialog and gives its own feedback.
  // The backend always sets `reviewMode` alongside `reviewerWorkflow`, so this single check is
  // enough to tell the two flows apart.
  const isEditing = purpose.reviewMode !== undefined

  const { mutate: assignReviewer } = PurposeMutations.useAssignRiskAnalysisReviewer({
    feedback: isEditing ? 'edit' : 'none',
  })

  const assignedReviewers = purpose.reviewerWorkflow?.reviewers ?? []
  const assignedReviewerIds = assignedReviewers.map(({ userId }) => userId)

  // Reviewers assigned by a previous release but no longer among the institution's users. They
  // must stay visible so the admin can see and drop them, but they block the submit.
  const removedReviewers = assignedReviewers.filter(
    (assigned) => !reviewers.some((user) => user.userId === assigned.userId)
  )
  const removedReviewerIds = removedReviewers.map(({ userId }) => userId)

  const hasNoReviewers = reviewers.length === 0

  const hasLostItsOnlyReviewers = !isDelegate && hasNoReviewers && removedReviewers.length > 0
  const isFormHidden = isDelegate || hasNoReviewers

  const formMethods = useForm<PurposeEditStepAssignmentFormValues>({ defaultValues })

  const reviewMode = formMethods.watch('reviewMode')
  const needsReviewers = checkReviewModeNeedsReviewers(reviewMode)
  const isRequestReviewerCompilation = reviewMode === 'REVIEWER_WRITES_REVIEWER_SIGNS'

  const getReviewerName = (userId: string) => {
    const user =
      reviewers.find((reviewer) => reviewer.userId === userId) ??
      assignedReviewers.find((reviewer) => reviewer.userId === userId)
    return user ? getFullName(user) : t('readOnly.reviewerUnknown')
  }

  const goToSummary = () => {
    navigate('SUBSCRIBE_PURPOSE_SUMMARY', { params: { purposeId: purpose.id } })
  }

  const onSubmit = ({ reviewMode, reviewerIds }: PurposeEditStepAssignmentFormValues) => {
    if (isFormHidden) {
      if (hasLostItsOnlyReviewers) {
        assignReviewer(
          {
            purposeId: purpose.id,
            reviewMode: 'ADMIN_WRITES_ADMIN_SIGNS',
            reviewerIds: undefined,
          },
          { onSuccess: forward }
        )
        return
      }
      forward()
      return
    }

    // Everything below is derived from the submitted values rather than from the watched ones,
    // so the payload can never drift from what the admin actually confirmed.
    const submittedNeedsReviewers = checkReviewModeNeedsReviewers(reviewMode)
    const submittedHandsOverToReviewer = reviewMode === 'REVIEWER_WRITES_REVIEWER_SIGNS'

    // A mode that involves no reviewer must not carry over the ones from the previous assignment.
    const nextReviewerIds = submittedNeedsReviewers ? reviewerIds : []

    const payload: { purposeId: string } & RiskAnalysisAssignmentSeed = {
      purposeId: purpose.id,
      reviewMode,
      reviewerIds: submittedNeedsReviewers ? nextReviewerIds : undefined,
    }

    const save = () => {
      assignReviewer(payload, {
        // Handing the compilation over to the reviewer leaves the admin no step 3 to fill in,
        // so that mode lands on the summary instead of moving forward.
        onSuccess: submittedHandsOverToReviewer ? goToSummary : forward,
      })
    }

    if (!isEditing) {
      // First compilation keeps the flow it had: the reviewer-compilation mode confirms through
      // its own dialog (which also owns the mutation), the other modes save straight away.
      if (submittedHandsOverToReviewer) {
        openDialog({
          type: 'requestRiskAnalysisCompilation',
          purposeId: purpose.id,
          reviewerIds: nextReviewerIds,
          reviewerNames: nextReviewerIds.map(getReviewerName),
        })
        return
      }
      save()
      return
    }

    // `isEditing` guarantees the purpose carries a persisted review mode.
    const fromMode = purpose.reviewMode as RiskAnalysisReviewMode

    const addedReviewerNames = nextReviewerIds
      .filter((userId) => !assignedReviewerIds.includes(userId))
      .map(getReviewerName)
    const removedReviewerNames = assignedReviewerIds
      .filter((userId) => !nextReviewerIds.includes(userId))
      .map(getReviewerName)

    const hasChanges =
      fromMode !== reviewMode || addedReviewerNames.length > 0 || removedReviewerNames.length > 0

    if (!hasChanges) {
      // Nothing was changed: there is nothing to confirm and nothing to persist.
      if (submittedHandsOverToReviewer) goToSummary()
      else forward()
      return
    }

    openDialog({
      type: 'editRiskAnalysisAssignment',
      fromMode,
      toMode: reviewMode,
      addedReviewerNames,
      removedReviewerNames,
      // The mutation must be triggered from here: running it inside the dialog would race
      // closeDialog(), and mutate() would silently no-op against a destroyed observer.
      onConfirm: save,
    })
  }

  // Reviewers no longer belonging to the institution are kept among the options so that their
  // chip still renders, but they are filtered out of the dropdown so they cannot be picked again.
  const reviewerOptions: Array<ReviewerOption> = [
    ...reviewers.map((user) => ({ label: getFullName(user), value: user.userId })),
    ...removedReviewers.map((user) => ({ label: getFullName(user), value: user.userId })),
  ]

  const filterOptions = (
    options: Array<ReviewerOption>,
    state: FilterOptionsState<ReviewerOption>
  ) =>
    filterReviewerOptions(
      options.filter((option) => !removedReviewerIds.includes(option.value)),
      state
    )

  const validateReviewerIds = (reviewerIds: Array<string>) => {
    if (reviewerIds.length === 0) return t('reviewerField.requiredError')

    const removed = reviewerIds.filter((userId) => removedReviewerIds.includes(userId))
    if (removed.length === 0) return true

    return t('reviewerField.removedError', {
      count: removed.length,
      names: removed.map(getReviewerName).join(', '),
    })
  }

  const reviewerLabelKey = isRequestReviewerCompilation
    ? 'REVIEWER_WRITES_REVIEWER_SIGNS'
    : 'ADMIN_WRITES_REVIEWER_SIGNS'

  return (
    <FormProvider {...formMethods}>
      <Box component="form" noValidate onSubmit={formMethods.handleSubmit(onSubmit)}>
        <SectionContainer title={t('title')} description={t('description')}>
          <Stack spacing={3}>
            {isDelegate && (
              <Alert severity="warning">
                {t('delegateAlert', {
                  name: purpose.eservice.name,
                })}
              </Alert>
            )}
            {!isDelegate && hasNoReviewers && (
              <Alert severity="info">
                {hasLostItsOnlyReviewers
                  ? t('noReviewersAlert.removedReviewerMessage', {
                      count: removedReviewers.length,
                    })
                  : t('noReviewersAlert.message')}{' '}
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
                      label: t('reviewModeField.options.ADMIN_WRITES_ADMIN_SIGNS'),
                      value: 'ADMIN_WRITES_ADMIN_SIGNS',
                    },
                    {
                      label: t('reviewModeField.options.ADMIN_WRITES_REVIEWER_SIGNS'),
                      value: 'ADMIN_WRITES_REVIEWER_SIGNS',
                    },
                    {
                      label: t('reviewModeField.options.REVIEWER_WRITES_REVIEWER_SIGNS'),
                      value: 'REVIEWER_WRITES_REVIEWER_SIGNS',
                    },
                  ]}
                />
                {needsReviewers && (
                  <>
                    <Typography variant="body2" fontWeight={600}>
                      {t(`reviewerField.label.${reviewerLabelKey}`)}
                    </Typography>
                    <RHFAutocompleteMultiple
                      name="reviewerIds"
                      label={t('reviewerField.inputLabel')}
                      options={reviewerOptions}
                      filterOptions={filterOptions}
                      rules={{
                        required: t('reviewerField.requiredError'),
                        validate: validateReviewerIds,
                      }}
                    />
                  </>
                )}
              </>
            )}
          </Stack>
        </SectionContainer>
        <StepActions
          back={{
            label: tEdit('backWithoutSaveBtn'),
            type: 'button',
            onClick: back,
            startIcon: <ArrowBackIcon />,
          }}
          forward={{
            label: isRequestReviewerCompilation
              ? t('requestReviewerCompilationBtn')
              : t('forwardBtn'),
            type: 'submit',
            startIcon: isRequestReviewerCompilation ? <SendIcon /> : <SaveIcon />,
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
