import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { StepActions } from '@/components/shared/StepActions'
import { Alert } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useEServiceCreateContext } from '../EServiceCreateContext'
import { EServiceCreateStepPurposeAddPurposesTable } from './EServiceCreateStepPurposeAddPurposesTable'
import { EServiceCreateStepPurposeRiskAnalysis } from './EServiceCreateStepPurposeRiskAnalysis/EServiceCreateStepPurposeRiskAnalysis'

export const EServiceCreateStepPurpose: React.FC = () => {
  const { t } = useTranslation('eservice', { keyPrefix: 'create' })

  const { eservice, forward, back, riskAnalysisFormState } = useEServiceCreateContext()

  return (
    <>
      <Alert severity="warning" sx={{ mb: 3 }}>
        {t('stepPurpose.firstVersionOnlyEditableInfoAlert')}
      </Alert>
      {!riskAnalysisFormState.isOpen ? (
        <>
          <SectionContainer
            newDesign
            title={t('stepPurpose.purposeTableSection.title')}
            description={t('stepPurpose.purposeTableSection.description')}
          >
            <EServiceCreateStepPurposeAddPurposesTable />
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
              disabled: eservice?.riskAnalysis.length === 0,
              tooltip:
                eservice?.riskAnalysis.length === 0
                  ? t('stepPurpose.purposeTableSection.noSelectedPurposesTooltip')
                  : undefined,
            }}
          />
        </>
      ) : (
        <EServiceCreateStepPurposeRiskAnalysis />
      )}
    </>
  )
}

export const EServiceCreateStepPurposeSkeleton: React.FC = () => {
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
