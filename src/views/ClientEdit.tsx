import React from 'react'
import { useParams } from 'react-router-dom'

type Params = {
  id: string | number
}

export function ClientEdit() {
  const { id } = useParams() as Params

  return <div>modifica client: {id}</div>
}
