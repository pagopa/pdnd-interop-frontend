import { PageContainer, SectionContainer } from '@/components/layout/containers'
import { useNavigate } from '@/router'
import { Stack } from '@mui/material'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DelegationCreateCards } from './components/DelegationCreateCards'
import { StepActions } from '@/components/shared/StepActions'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { match } from 'ts-pattern'
import { DelegationCreateForm } from './components/DelegationCreateForm'
import { DelegationKind } from '@/api/api.generatedTypes'

/***
 * It shows the cards component to choose delegation kind or the form component based on the state KIND or FORM
 */
export const DelegationCreatePage: React.FC = () => {
  const { t } = useTranslation('party')
  const navigate = useNavigate()
  const [delegationKind, setDelegationKind] = useState<DelegationKind>()
  const [activeStep, setActiveStep] = useState<'KIND' | 'FORM'>('KIND')
  const sectionTitle = match({ activeStep, delegationKind })
    .with({ activeStep: 'KIND' }, () => t('delegations.create.kindSectionTitle'))
    .with({ activeStep: 'FORM', delegationKind: 'DELEGATED_PRODUCER' }, () =>
      t('delegations.create.provideDelegationTitle')
    )
    .otherwise(() => t('delegations.create.consumeDelegationTitle'))

  return (
    <PageContainer
      title={t('delegations.create.title')}
      backToAction={{
        label: t('delegations.actions.backToDelegations'),
        to: 'DELEGATIONS',
      }}
    >
      <SectionContainer title={sectionTitle}>
        <Stack spacing={2}>
          <SectionContainer innerSection>
            {activeStep === 'KIND' && (
              <Stack spacing={2} direction="row" sx={{ width: '100%' }}>
                <div style={{ flex: 1 }}>
                  <DelegationCreateCards
                    delegationKind="DELEGATED_CONSUMER"
                    onClick={() => setDelegationKind('DELEGATED_CONSUMER')}
                    isClicked={delegationKind === 'DELEGATED_CONSUMER'}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <DelegationCreateCards
                    delegationKind="DELEGATED_PRODUCER"
                    onClick={() => setDelegationKind('DELEGATED_PRODUCER')}
                    isClicked={delegationKind === 'DELEGATED_PRODUCER'}
                  />
                </div>
              </Stack>
            )}
            {activeStep === 'FORM' && delegationKind != null && (
              <DelegationCreateForm delegationKind={delegationKind} setActiveStep={setActiveStep} />
            )}
          </SectionContainer>
        </Stack>
      </SectionContainer>
      {activeStep === 'KIND' && (
        <StepActions
          back={{
            label: t('delegations.create.cancelBtn'),
            type: 'button',
            onClick: () => navigate('DELEGATIONS'),
          }}
          forward={{
            label: t('delegations.create.forwardWithSaveBtn'),
            type: 'button',
            endIcon: <ArrowForwardIcon />,
            onClick: () => {
              delegationKind != null && setActiveStep('FORM')
            },
          }}
        />
      )}
    </PageContainer>
  )
}
