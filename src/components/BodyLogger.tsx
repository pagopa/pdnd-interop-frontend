import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Footer } from './Footer'
import { Header } from './Header'
import { Main } from './Main'
import { logAction } from '../lib/action-log'

export function BodyLogger() {
  const location = useLocation()

  useEffect(() => {
    logAction('Route change', location)
  }, [location])

  return (
    <React.Fragment>
      <Header />
      <Main />
      <Footer />
    </React.Fragment>
  )
}
