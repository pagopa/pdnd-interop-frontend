import { isProviderOrConsumerRoute } from '@/router/router.utils'

describe('checks router utils functions behavior', () => {
  it('checks that isProviderOrConsumerRoute return the right string - if provider', () => {
    const result = isProviderOrConsumerRoute('/erogazione/test/1')

    expect(result).toEqual('provider')
  })

  it('checks that isProviderOrConsumerRoute return the right string - if consumer', () => {
    const result = isProviderOrConsumerRoute('/fruizione/test/1')

    expect(result).toEqual('consumer')
  })

  it('checks that isProviderOrConsumerRoute return the right string - if nor provider or consumer', () => {
    const result = isProviderOrConsumerRoute('/test/1')

    expect(result).toBeNull()
  })
})
