import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { StepActions } from '@/components/shared/StepActions'
import { Alert } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useCreateContext } from '../../CreateContext'
import { CreateStepPurposeAddPurposesTable } from './CreateStepPurposeAddPurposeTable'
import { CreateStepPurposeRiskAnalysis } from './CreateStepPurposeRiskAnalysis/CreateStepPurposeRiskAnalysis'

export const CreateStepPurpose: React.FC = () => {
  const { t } = useTranslation('eservice', { keyPrefix: 'create' }) //TODO

  const { descriptor, template, forward, back, riskAnalysisFormState } = useCreateContext()

  return (
    <>
      <Alert severity="warning" sx={{ mb: 3 }}>
        {t('stepPurpose.firstVersionOnlyEditableInfoAlert')}
      </Alert>
      {!riskAnalysisFormState.isOpen ? (
        <>
          <SectionContainer
            title={t('stepPurpose.purposeTableSection.title')}
            description={t('stepPurpose.purposeTableSection.description')}
          >
            <CreateStepPurposeAddPurposesTable />
          </SectionContainer>
          <StepActions
            back={{
              label: t('backWithoutSaveBtn'),
              type: 'button',
              onClick: back,
              startIcon: <ArrowBackIcon />,
            }}
            forward={{
              label: t('forwardWithoutSaveBtn'),
              type: 'button',
              onClick: forward,
              endIcon: <ArrowForwardIcon />,
              disabled: descriptor?.eservice?.riskAnalysis.length === 0,
              tooltip:
                descriptor?.eservice?.riskAnalysis.length === 0
                  ? t('stepPurpose.purposeTableSection.noSelectedPurposesTooltip')
                  : undefined,
            }}
          />
        </>
      ) : (
        <CreateStepPurposeRiskAnalysis />
      )}
    </>
  )
}

export const CreateStepPurposeSkeleton: React.FC = () => {
  const { t } = useTranslation('eservice', { keyPrefix: 'create.stepPurpose' })

  return (
    <>
      <Alert severity="warning" sx={{ mb: 3 }}>
        {t('firstVersionOnlyEditableInfoAlert')}
      </Alert>
      <SectionContainerSkeleton height={246} />
    </>
  )
}
