import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { StepActions } from '@/components/shared/StepActions'
import type { FC } from 'react'
import React, { Suspense, useState } from 'react'
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

export const EServiceTemplateCreateStepPurpose: FC = () => {
  const { t } = useTranslation('eservice', { keyPrefix: 'create' })
  const { eserviceTemplateVersion, forward, back } = useEServiceTemplateCreateContext()


  const [riskAnalysisFormState, setRiskAnalysisFormState] = useState<
    | { type: null }
    | {
        type: 'edit'
        riskAnalysis: EServiceTemplateRiskAnalysis
      }
    | {
        type: 'add'
        selectedTenantKind: TenantKind
      }
  >({ type: null })


  const handleOpenEditRiskAnalysisForm = (riskAnalysis: EServiceTemplateRiskAnalysis) => {
    setRiskAnalysisFormState({
      type: 'edit',
      riskAnalysis,
    })
  }

  const handleOpenAddRiskAnalysisForm = (selectedTenantKind: TenantKind) => {
    setRiskAnalysisFormState({
      type: 'add',
      selectedTenantKind,
    })
  }

  const closeRiskAnalysisForm = () => {
    setRiskAnalysisFormState({ type: null })
  }

  // Disable the forward button if there are no risk analyses inserted
  const isForwardButtonDisabled =
    eserviceTemplateVersion?.eserviceTemplate.riskAnalysis.length === 0
  
  return (
    <>
      {eserviceTemplateVersion && riskAnalysisFormState.type !== null ? (
        <Suspense fallback={<RiskAnalysisFormSkeleton />}>
          {match(riskAnalysisFormState)
            .with({ type: 'edit' }, ({ riskAnalysis }) => (
              <EServiceTemplateCreateStepEditRiskAnalysis
                eserviceTemplateId={eserviceTemplateVersion.eserviceTemplate.id}
                riskAnalysis={riskAnalysis}
                onClose={closeRiskAnalysisForm}
              />
            ))
            .with({ type: 'add' }, ({ selectedTenantKind }) => (
              <EServiceTemplateCreateStepAddRiskAnalysis
                eserviceTemplateId={eserviceTemplateVersion.eserviceTemplate.id}
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
              disabled: isForwardButtonDisabled,
              tooltip: isForwardButtonDisabled
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
  return <SectionContainerSkeleton height={246} />
}
