import React from 'react'
import { useParams } from 'react-router-dom'

type Params = {
  id: string | number
}

export function EServiceCatalogEntry() {
  const { id } = useParams() as Params

  return (
    <div>
      <div>Descrizione e-service: {id}</div>
    </div>
  )
}
