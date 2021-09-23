import React from 'react'
import { Link } from 'react-router-dom'
import { StyledIntro } from '../components/StyledIntro'
import { WhiteBackground } from '../components/WhiteBackground'

type NotFoundProps = {
  errorType?: 'not-found' | 'server-error'
}

export function NotFound({ errorType = 'not-found' }: NotFoundProps) {
  const DESCRIPTIONS = {
    'not-found': 'La pagina cercata purtroppo non esiste',
    'server-error': 'Si è verificato un errore temporaneo del server',
  }

  return (
    <WhiteBackground>
      <div className="bg-danger px-3 py-3">
        <StyledIntro priority={2}>
          {{
            title: 'Spiacenti',
            description: (
              <>
                {DESCRIPTIONS[errorType]}. Torna alla{' '}
                <Link to="/" className="link-default">
                  home
                </Link>
                .
              </>
            ),
          }}
        </StyledIntro>
      </div>
    </WhiteBackground>
  )
}
