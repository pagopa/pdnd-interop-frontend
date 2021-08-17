export type User = {
  name: string
  surname: string
  cf: string
  mail: string
}

export type Party = {
  name: string
  mail: string
}

export type Provider = 'provider'
export type Subscriber = 'subscriber'
export type ProviderOrSubscriber = Provider | Subscriber
