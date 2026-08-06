import type { Purpose, Reviewer } from '@/api/api.generatedTypes'
import { AuthHooks } from '@/api/auth'
import { SectionContainer } from '@/components/layout/containers'
import { formatDateStringNumeric } from '@/utils/format.utils'
import { Stack } from '@mui/material'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { match } from 'ts-pattern'
import type { ConcludedSigningState } from '../types'

type RiskAnalysisDetailsAssignmentSectionProps = {
  purpose: Purpose
  signingState: ConcludedSigningState
}

const EMPTY_FIELD = '-'

const getReviewerFullName = (reviewer: Reviewer) => `${reviewer.name} ${reviewer.familyName}`.trim()

const formatDate = (date: string | undefined) =>
  date ? formatDateStringNumeric(date) : EMPTY_FIELD

export const RiskAnalysisDetailsAssignmentSection: React.FC<
  RiskAnalysisDetailsAssignmentSectionProps
> = ({ purpose, signingState }) => {
  const { t } = useTranslation('purpose', { keyPrefix: 'riskAnalysisDetails' })
  const { jwt } = AuthHooks.useJwt()

  const reviewerWorkflow = purpose.reviewerWorkflow
  const reviewers = reviewerWorkflow?.reviewers ?? []

  const assignedAt = reviewers.find((reviewer) => reviewer.userId === jwt?.uid)?.sentToReviewerAt

  const fields = match(signingState)
    .with('SIGNED', () => {
      const signer = reviewers.find((reviewer) => reviewer.userId === reviewerWorkflow?.signedBy)

      return [
        { label: t('assignmentSection.assignedAt.label'), content: formatDate(assignedAt) },
        {
          label: t('assignmentSection.signedAt.label'),
          content: formatDate(reviewerWorkflow?.signedAt),
        },
        {
          label: t('assignmentSection.signedBy.label'),
          content: signer ? getReviewerFullName(signer) : EMPTY_FIELD,
        },
      ]
    })
    .with('REJECTED', () => [
      { label: t('assignmentSection.assignedAt.label'), content: formatDate(assignedAt) },
      {
        label: t('assignmentSection.assignedTo.label'),
        content: reviewers.map(getReviewerFullName).join(', ') || EMPTY_FIELD,
      },
    ])
    .exhaustive()

  return (
    <SectionContainer title={t('assignmentSection.title')}>
      <Stack spacing={3}>
        {fields.map(({ label, content }) => (
          <InformationContainer key={label} label={label} content={content} />
        ))}
      </Stack>
    </SectionContainer>
  )
}
