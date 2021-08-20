import React from 'react'
import { useParams } from 'react-router-dom'
import { WhiteBackground } from '../components/WhiteBackground'

type Params = {
  id: string | number
}

export function EServiceCatalogEntry() {
  const { id } = useParams() as Params

  return (
    <WhiteBackground>
      <div>Descrizione e-service: {id}</div>
    </WhiteBackground>
  )
}
