import React from 'react'
import { API } from './src/lib/constants'

export type User = {
  name: string
  surname: string
  cf: string
  mail: string
}

export type Party = {
  status: 'Pending'
  description: string
  institutionId: string
  digitalAddress: string
}

export type Provider = 'provider'
export type Subscriber = 'subscriber'
export type ProviderOrSubscriber = Provider | Subscriber

export type ApiEndpointKey = keyof typeof API

export type StepperStepComponentProps = {
  stepForward?: () => void
  stepBack?: () => void
  setFormData?: React.Dispatch<React.SetStateAction<any>>
  setLegalEmail?: React.Dispatch<React.SetStateAction<any>>
}

export type StepperStep = {
  label: string
  Component: React.FunctionComponent<StepperStepComponentProps>
}

export type IPAParty = {
  description: string
  digitalAddress: string
  id: string
  managerName: string
  managerSurname: string
  o: string
  ou: string
}
