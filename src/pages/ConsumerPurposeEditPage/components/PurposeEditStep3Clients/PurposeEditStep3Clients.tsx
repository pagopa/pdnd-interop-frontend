import { SectionContainer } from '@/components/layout/containers'
import { StepActions } from '@/components/shared/StepActions'
import type { ActiveStepProps } from '@/hooks/useActiveStep'
import { useNavigate, useParams } from '@/router'
import React from 'react'
import { useTranslation } from 'react-i18next'
import {
  PurposeEditStep3AddClientsTable,
  PurposeEditStep3AddClientsTableSkeleton,
} from './PurposeEditStep3AddClientsTable'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

export const PurposeEditStep3Clients: React.FC<ActiveStepProps> = ({ back }) => {
  const { t } = useTranslation('purpose', { keyPrefix: 'edit' })
  const { purposeId } = useParams<'SUBSCRIBE_PURPOSE_EDIT'>()
  const navigate = useNavigate()

  const goToSummary = () => {
    navigate('SUBSCRIBE_PURPOSE_SUMMARY', {
      params: {
        purposeId: purposeId,
      },
    })
  }

  return (
    <>
      <SectionContainer newDesign title={t('step3.title')}>
        <React.Suspense fallback={<PurposeEditStep3AddClientsTableSkeleton />}>
          <PurposeEditStep3AddClientsTable purposeId={purposeId} />
        </React.Suspense>
      </SectionContainer>
      <StepActions
        back={{
          label: t('backWithoutSaveBtn'),
          type: 'button',
          onClick: back,
          startIcon: <ArrowBackIcon />,
        }}
        forward={{
          label: t('endWithSaveBtn'),
          type: 'button',
          onClick: goToSummary,
          endIcon: <ArrowForwardIcon />,
        }}
      />
    </>
  )
}
