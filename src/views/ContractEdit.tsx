import React from 'react'
import { useParams } from 'react-router-dom'

type Params = {
  id: string | number
}

export function ContractEdit() {
  const { id } = useParams() as Params

  return <div>modifica accordo: {id}</div>
}
