import React, { useState } from 'react'
import { WhiteBackground } from '../components/WhiteBackground'
import { LoadingOverlay } from '../components/LoadingOverlay'
import { useParams } from 'react-router-dom'

type Params = {
  token: string
  screenName?: string
}

export function CompleteRegistration() {
  const [loading, setLoading] = useState(false)
  const { token, screenName }: Params = useParams()

  console.log({ token, screenName })

  return (
    <LoadingOverlay isLoading={loading} loadingText="Stiamo verificando i tuoi dati">
      <WhiteBackground>
        <div className="form-max-width">ciao</div>
      </WhiteBackground>
    </LoadingOverlay>
  )
}
