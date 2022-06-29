import createCache from '@emotion/cache'

type ExtendedWindow = Window & { nonce: string }
export const noncedCache = createCache({
  key: 'emotion-cache',
  nonce: (window as unknown as ExtendedWindow).nonce,
  prepend: false,
  container: document.body,
})

console.log('created nonced cache with nonce: ', (window as unknown as ExtendedWindow).nonce)
