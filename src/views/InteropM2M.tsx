import React from 'react'
import { StyledIntro } from '../components/Shared/StyledIntro'
import { ClientList } from './ClientList'

export function InteropM2M() {
  return (
    <React.Fragment>
      <StyledIntro>
        {{
          title: 'InteropM2M',
          description:
            'Gestisci i client per l’API machine-to-machine che ti permette di fruire di Interoperabilità al di fuori della web app',
        }}
      </StyledIntro>

      <ClientList clientKind="API" />
    </React.Fragment>
  )
}
