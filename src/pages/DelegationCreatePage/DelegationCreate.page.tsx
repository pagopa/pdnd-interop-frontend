import { PageContainer, SectionContainer } from '@/components/layout/containers'
import { useNavigate } from '@/router'
import { Stack } from '@mui/material'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DelegationCreateCards } from './components/DelegationCreateCards'
import { StepActions } from '@/components/shared/StepActions'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
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

  const changeDelegationKind = (delegationKind: DelegationKind) => {
    setDelegationKind(delegationKind)
  }

  return (
    <PageContainer
      title={t('delegations.create.title')}
      backToAction={{
        label: t('delegations.actions.backToDelegations'),
        to: 'DELEGATIONS',
      }}
    >
      <Stack spacing={2}>
        {activeStep === 'KIND' && (
          <SectionContainer title={t('delegations.create.kindSectionTitle')}>
            <Stack spacing={2} direction="row" sx={{ width: '100%' }}>
              <DelegationCreateCards
                delegationKind={delegationKind}
                changeDelegationKind={changeDelegationKind}
              />
            </Stack>
          </SectionContainer>
        )}
        {activeStep === 'FORM' && delegationKind != null && (
          <DelegationCreateForm delegationKind={delegationKind} setActiveStep={setActiveStep} />
        )}
      </Stack>
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
