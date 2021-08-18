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
