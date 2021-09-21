import React from 'react'
import { Link } from 'react-router-dom'
import { StyledIntro } from '../components/StyledIntro'
import { WhiteBackground } from '../components/WhiteBackground'

export function NotFound() {
  return (
    <WhiteBackground>
      <StyledIntro priority={2}>
        {{
          title: 'Spiacenti',
          description: (
            <>
              La pagina cercata purtroppo non esiste. Torna alla{' '}
              <Link to="/" className="link-default">
                home
              </Link>
              .
            </>
          ),
        }}
      </StyledIntro>
    </WhiteBackground>
  )
}
