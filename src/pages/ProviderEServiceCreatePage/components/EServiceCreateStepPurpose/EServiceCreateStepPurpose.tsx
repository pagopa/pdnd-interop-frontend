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

  const { eservice, descriptor, forward, back, isRiskAnalysisFormOpen } = useEServiceCreateContext()

  return (
    <>
      <Alert severity="warning" sx={{ mb: 3 }}>
        {t('step1.firstVersionOnlyEditableInfo')} {/* TODO cambiare le stringhe */}
      </Alert>
      {!isRiskAnalysisFormOpen ? (
        <>
          <SectionContainer
            newDesign
            title={'TODO Finalità'}
            description={
              'TODO Indica i casi d’uso per i quali intendi raccogliere dati. Per ogni finalità dovrai compilare un’analisi del rischio.'
            }
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
                  ? 'TODO È necessario indicare almeno una finalità per proseguire'
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
  const { t } = useTranslation('eservice')

  return (
    <>
      <Alert severity="warning" sx={{ mb: 3 }}>
        {t('create.step1.firstVersionOnlyEditableInfo')}
      </Alert>
      <SectionContainerSkeleton height={246} />
    </>
  )
}
