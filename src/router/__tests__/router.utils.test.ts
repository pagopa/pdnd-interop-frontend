import {
  getLocalizedPath,
  getParentRoutes,
  getPathSegments,
  getRouteKeyFromPath,
  isEditPath,
  isProviderOrConsumerRoute,
} from '@/router/router.utils'
import { PUBLIC_URL } from '@/config/env'
import { throws } from 'assert'

describe('checks router utils functions behavior', () => {
  it('checks that getLocalizedPath returns the right string', () => {
    const result = getLocalizedPath('PROVIDE', 'it')

    expect(result).toEqual(`${PUBLIC_URL}/it/erogazione`)
  })

  it('checks that getRouteKeyFromPath returns the right routeKey - pathName with PUBLIC_URL', () => {
    const result = getRouteKeyFromPath(`${PUBLIC_URL}/it/erogazione`, 'it')

    expect(result).toEqual('PROVIDE')
  })

  it('checks that getRouteKeyFromPath returns the right routeKey - pathName without PUBLIC_URL', () => {
    const result = getRouteKeyFromPath('/it/erogazione', 'it')

    expect(result).toEqual('PROVIDE')
  })

  it('checks that getRouteKeyFromPath throws an error - pathName is not associated with a routeKey', () => {
    throws(() => {
      getRouteKeyFromPath('/it/lalala', 'it')
    })
  })

  it('checks that getPathSegments return the right segments', () => {
    const result = getPathSegments('/it/erogazione')

    expect(result).toEqual(['it', 'erogazione'])
  })

  it('checks that getParentRoutes match with the snapshot - two parents', () => {
    const result = getParentRoutes('PROVIDE_ESERVICE_CREATE')

    expect(result).toMatchInlineSnapshot(`
      [
        "PROVIDE",
        "PROVIDE_ESERVICE_LIST",
      ]
    `)
  })

  it('checks that getParentRoutes match with the snapshot - no parents', () => {
    const result = getParentRoutes('PROVIDE')

    expect(result).toMatchInlineSnapshot('[]')
  })

  it('checks that getParentRoutes match with the snapshot - one parent', () => {
    const result = getParentRoutes('PROVIDE_ESERVICE_LIST')

    expect(result).toMatchInlineSnapshot(`
      [
        "PROVIDE",
      ]
    `)
  })

  it('checks that isProviderOrConsumerRoute return the right string - if provider', () => {
    const result = isProviderOrConsumerRoute('PROVIDE')

    expect(result).toEqual('provider')
  })

  it('checks that isProviderOrConsumerRoute return the right string - if consumer', () => {
    const result = isProviderOrConsumerRoute('SUBSCRIBE')

    expect(result).toEqual('consumer')
  })

  it('checks that isProviderOrConsumerRoute return the right string - if nor provider or consumer', () => {
    const result = isProviderOrConsumerRoute('TOS')

    expect(result).toBeNull()
  })

  it('checks that isEditPath return the right value - false', () => {
    const result = isEditPath('PROVIDE')

    expect(result).toEqual(false)
  })

  it('checks that isEditPath return the right value - true', () => {
    const result = isEditPath('PROVIDE_ESERVICE_EDIT')

    expect(result).toEqual(true)
  })
})
