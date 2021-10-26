import React from 'react'
import { Layout } from '../components/Shared/Layout'
import { StyledIntro } from '../components/Shared/StyledIntro'
import { StyledLink } from '../components/Shared/StyledLink'

type NotFoundProps = {
  errorType?: 'not-found' | 'server-error'
}

export function NotFound({ errorType = 'not-found' }: NotFoundProps) {
  const DESCRIPTIONS = {
    'not-found': 'La pagina cercata purtroppo non esiste',
    'server-error': 'Si è verificato un errore temporaneo del server',
  }

  return (
    <Layout>
      <div className="bg-danger px-3 py-3">
        <StyledIntro priority={2}>
          {{
            title: 'Spiacenti',
            description: (
              <>
                {DESCRIPTIONS[errorType]}. Torna alla <StyledLink to="/">home</StyledLink>.
              </>
            ),
          }}
        </StyledIntro>
      </div>
    </Layout>
  )
}
