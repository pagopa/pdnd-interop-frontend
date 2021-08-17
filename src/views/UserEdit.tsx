import React from 'react'
import { useParams } from 'react-router-dom'

type Params = {
  id: string | number
}

export function UserEdit() {
  const { id } = useParams() as Params

  return <div>modifica operatore: {id}</div>
}
