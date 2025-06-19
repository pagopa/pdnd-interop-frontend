import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { StepActions } from '@/components/shared/StepActions'
import React from 'react'
import { useTranslation } from 'react-i18next'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { EServiceTemplateCreateStepPurposeRiskAnalysis } from './EServiceTemplateCreateStepPurposeRiskAnalysis/EServiceTemplateCreateStepPurposeRiskAnalysis'
import { useEServiceTemplateCreateContext } from '../ProviderEServiceTemplateContext'
import { EServiceTemplateCreateStepPurposeAddPurposesTable } from './EServiceTemplateCreateStepPurposeAddPurposeTable'

export const EServiceTemplateCreateStepPurpose: React.FC = () => {
  const { t } = useTranslation('eservice', { keyPrefix: 'create' })

  const { templateVersion, forward, back, riskAnalysisFormState } =
    useEServiceTemplateCreateContext()

  return (
    <>
      {!riskAnalysisFormState.isOpen ? (
        <>
          <SectionContainer
            title={t('stepPurpose.purposeTableSection.title')}
            description={t('stepPurpose.purposeTableSection.description')}
          >
            <EServiceTemplateCreateStepPurposeAddPurposesTable />
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
              disabled: templateVersion?.eserviceTemplate.riskAnalysis.length === 0,
              tooltip:
                templateVersion?.eserviceTemplate.riskAnalysis.length === 0
                  ? t('stepPurpose.purposeTableSection.noSelectedPurposesTooltip')
                  : undefined,
            }}
          />
        </>
      ) : (
        <EServiceTemplateCreateStepPurposeRiskAnalysis />
      )}
    </>
  )
}

export const EServiceTemplateCreateStepPurposeSkeleton: React.FC = () => {
  return (
    <>
      <SectionContainerSkeleton height={246} />
    </>
  )
}
