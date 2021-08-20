import React from 'react'
import { useParams } from 'react-router-dom'
import { WhiteBackground } from '../components/WhiteBackground'

type Params = {
  id: string | number
}

export function UserEdit() {
  const { id } = useParams() as Params

  return <WhiteBackground>modifica operatore: {id}</WhiteBackground>
}
