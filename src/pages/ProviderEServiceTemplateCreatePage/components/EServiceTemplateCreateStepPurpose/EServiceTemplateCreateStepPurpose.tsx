import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { StepActions } from '@/components/shared/StepActions'
import React, { Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useEServiceTemplateCreateContext } from '../ProviderEServiceTemplateContext'
import { EServiceTemplateCreateStepPurposeAddPurposesTable } from './EServiceTemplateCreateStepPurposeAddPurposeTable'
import { RiskAnalysisFormSkeleton } from '@/components/shared/CreateStepPurposeRiskAnalysisForm'
import { match } from 'ts-pattern'
import { EServiceTemplateCreateStepEditRiskAnalysis } from './EServiceTemplateCreateStepEditRiskAnalysis'
import { EServiceTemplateCreateStepAddRiskAnalysis } from './EServiceTemplateCreateStepAddRiskAnalysis'
import type { EServiceTemplateRiskAnalysis, TenantKind } from '@/api/api.generatedTypes'

type RiskAnalysisFormState =
  | {
      type: null
    }
  | {
      type: 'edit'
      riskAnalysis: EServiceTemplateRiskAnalysis
    }
  | {
      type: 'add'
      selectedTenantKind: TenantKind
    }

export const EServiceTemplateCreateStepPurpose: React.FC = () => {
  const { t } = useTranslation('eservice', { keyPrefix: 'create' })
  const { templateVersion, forward, back } = useEServiceTemplateCreateContext()

  const [riskAnalysisFormState, setRiskAnalysisFormState] = React.useState<RiskAnalysisFormState>({
    type: null,
  })

  const handleOpenEditRiskAnalysisForm = (riskAnalysis: EServiceTemplateRiskAnalysis) => {
    setRiskAnalysisFormState({
      type: 'edit',
      riskAnalysis: riskAnalysis,
    })
  }

  const handleOpenAddRiskAnalysisForm = (selectedTenantKind: TenantKind) => {
    setRiskAnalysisFormState({
      type: 'add',
      selectedTenantKind,
    })
  }

  const closeRiskAnalysisForm = () => {
    setRiskAnalysisFormState({
      type: null,
    })
  }

  return (
    <>
      {templateVersion && riskAnalysisFormState.type !== null ? (
        <Suspense fallback={<RiskAnalysisFormSkeleton />}>
          {match(riskAnalysisFormState)
            .with({ type: 'edit' }, ({ riskAnalysis }) => (
              <EServiceTemplateCreateStepEditRiskAnalysis
                eserviceTemplateId={templateVersion.eserviceTemplate.id}
                riskAnalysis={riskAnalysis}
                onClose={closeRiskAnalysisForm}
              />
            ))
            .with({ type: 'add' }, ({ selectedTenantKind }) => (
              <EServiceTemplateCreateStepAddRiskAnalysis
                eserviceTemplateId={templateVersion.eserviceTemplate.id}
                selectedTenantKind={selectedTenantKind}
                onClose={closeRiskAnalysisForm}
              />
            ))
            .exhaustive()}
        </Suspense>
      ) : (
        <>
          <SectionContainer
            title={t('stepPurpose.purposeTableSection.title')}
            description={t('stepPurpose.purposeTableSection.description')}
          >
            <EServiceTemplateCreateStepPurposeAddPurposesTable
              onOpenEditRiskAnalysisForm={handleOpenEditRiskAnalysisForm}
              onOpenAddRiskAnalysisForm={handleOpenAddRiskAnalysisForm}
            />
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
