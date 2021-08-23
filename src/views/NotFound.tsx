import React from 'react'
import { Link } from 'react-router-dom'
import { WhiteBackground } from '../components/WhiteBackground'

export function NotFound() {
  return (
    <WhiteBackground>
      <h1>Spiacenti!</h1>
      <p>
        La pagina cercata purtroppo non esiste. Torna alla{' '}
        <Link to="/" className="link-default">
          home
        </Link>
        .
      </p>
    </WhiteBackground>
  )
}
