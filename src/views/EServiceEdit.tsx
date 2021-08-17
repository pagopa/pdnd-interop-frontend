import React from 'react'
import { useParams } from 'react-router-dom'

type Params = {
  id: string | number
}

export function EServiceEdit() {
  const { id } = useParams() as Params

  return <div>modifica e-service: {id}</div>
}
