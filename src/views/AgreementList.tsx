import React from 'react'
import { ProviderOrSubscriber } from '../../types'
import { useMode } from '../hooks/useMode'
import { StyledIntro, StyledIntroChildrenProps } from '../components/Shared/StyledIntro'
import { TempFilters } from '../components/TempFilters'
import { PageTopFilters } from '../components/Shared/PageTopFilters'
import { AsyncTableAgreement } from '../components/Shared/AsyncTableAgreement'

export function AgreementList() {
  const mode = useMode()
  const currentMode = mode as ProviderOrSubscriber

  const INTRO: Record<ProviderOrSubscriber, StyledIntroChildrenProps> = {
    provider: {
      title: 'Richieste di fruizione',
      description:
        "In quest'area puoi gestire tutte le richieste di fruizione che ti sono state inoltrate da enti che intendono fruire dei tuoi E-Service",
    },
    subscriber: {
      title: 'Le tue richieste',
      description:
        "In quest'area puoi gestire tutte le richieste di fruizione che hai sottoscritto presso Enti Erogatori",
    },
  }

  return (
    <React.Fragment>
      <StyledIntro>{INTRO[currentMode]}</StyledIntro>

      <PageTopFilters>
        <TempFilters />
      </PageTopFilters>

      <AsyncTableAgreement />
    </React.Fragment>
  )
}
