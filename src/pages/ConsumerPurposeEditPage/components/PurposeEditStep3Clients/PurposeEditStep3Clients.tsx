import { SectionContainer } from '@/components/layout/containers'
import { StepActions } from '@/components/shared/StepActions'
import { useToastNotification } from '@/stores'
import { ActiveStepProps } from '@/hooks/useActiveStep'
import { useNavigateRouter, useRouteParams } from '@/router'
import { Typography } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import {
  PurposeEditBottomPageQuickActions,
  PurposeEditBottomPageQuickActionsSkeleton,
} from './PurposeEditBottomPageQuickActions'
import {
  PurposeEditStep3AddClientsTable,
  PurposeEditStep3AddClientsTableSkeleton,
} from './PurposeEditStep3AddClientsTable'

export const PurposeEditStep3Clients: React.FC<ActiveStepProps> = ({ back }) => {
  const { t } = useTranslation('purpose', { keyPrefix: 'edit' })
  const { t: tMutations } = useTranslation('mutations-feedback', {
    keyPrefix: 'purpose.updateDraft.outcome',
  })
  const { purposeId } = useRouteParams<'SUBSCRIBE_PURPOSE_EDIT'>()
  const { showToast } = useToastNotification()
  const { navigate } = useNavigateRouter()

  const goToPurposeList = () => {
    showToast(tMutations('success'), 'success')
    navigate('SUBSCRIBE_PURPOSE_LIST')
  }

  return (
    <>
      <SectionContainer>
        <Typography sx={{ mb: 4 }} component="h2" variant="h5">
          {t('step3.title')}
        </Typography>
        <React.Suspense fallback={<PurposeEditStep3AddClientsTableSkeleton />}>
          <PurposeEditStep3AddClientsTable purposeId={purposeId} />
        </React.Suspense>
      </SectionContainer>
      <StepActions
        back={{ label: t('backWithoutSaveBtn'), type: 'button', onClick: back }}
        forward={{ label: t('endWithSaveBtn'), type: 'button', onClick: goToPurposeList }}
      />
      <React.Suspense fallback={<PurposeEditBottomPageQuickActionsSkeleton />}>
        <PurposeEditBottomPageQuickActions purposeId={purposeId} />
      </React.Suspense>
    </>
  )
}
