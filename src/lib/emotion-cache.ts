import createCache from '@emotion/cache'

type ExtendedWindow = Window & { nonce: string }
export const noncedCache = createCache({
  key: 'emotion-cache',
  nonce: (window as unknown as ExtendedWindow).nonce,
})
