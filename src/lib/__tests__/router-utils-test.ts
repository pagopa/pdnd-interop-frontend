import { RouteConfig } from '../../../types'
import {
  belongsToTree,
  isInPlatform,
  isParentRoute,
  isProviderOrSubscriber,
  isSamePath,
} from '../router-utils'

describe('Belongs to tree', () => {
  it('Current location belongs to route tree (aka has an ancestor in that route)', () => {
    const location = {
      pathname: '/erogazione/e-service/crea',
      search: '',
      state: {},
      hash: 'djsf-dsfjs-dsfj',
    }
    const route: RouteConfig = {
      PATH: '/erogazione',
      LABEL: 'Erogazione',
      EXACT: true,
      REDIRECT: '/erogazione/e-service',
      COMPONENT: () => null,
      PUBLIC: false,
      AUTH_LEVELS: ['admin', 'api'],
      SPLIT_PATH: ['erogazione'],
    }

    expect(belongsToTree(location, route)).toBeTruthy()
  })

  it("Current location doesn't belongs to route tree", () => {
    const location = {
      pathname: '/erogazione/e-service/crea',
      search: '',
      state: {},
      hash: 'djsf-dsfjs-dsfj',
    }
    const route: RouteConfig = {
      PATH: '/fruizione',
      LABEL: 'Fruizione',
      EXACT: true,
      REDIRECT: '/fruizione/catalogo-e-service',
      COMPONENT: () => null,
      PUBLIC: false,
      AUTH_LEVELS: ['admin', 'security'],
      SPLIT_PATH: ['fruizione'],
    }

    expect(belongsToTree(location, route)).toBeFalsy()
  })
})

describe('Test if path matches another patch', () => {
  it('Is same path - static path', () => {
    expect(isSamePath('/erogazione/e-service/crea', '/erogazione/e-service/crea')).toBeTruthy()
  })

  it('Is same path - dynamic path', () => {
    expect(
      isSamePath(
        '/fruizione/client/dksfdskf-sdfksdfk-sdfksdf/operatori/ABCDEF44R33E333W',
        '/fruizione/client/:id/operatori/:operatorId'
      )
    ).toBeTruthy()
  })

  it('It is not same path - ancestor', () => {
    expect(
      isSamePath(
        '/fruizione/client/dksfdskf-sdfksdfk-sdfksdf/operatori/ABCDEF44R33E333W',
        '/fruizione/client/:id'
      )
    ).toBeFalsy()
  })

  it('It is not same path - different roots', () => {
    expect(
      isSamePath(
        '/fruizione/client/dksfdskf-sdfksdfk-sdfksdf',
        '/erogazione/client/dksfdskf-sdfksdfk-sdfksdf'
      )
    ).toBeFalsy()
  })
})

describe('Test if route descends from another route', () => {
  it('It does', () => {
    const possibleParentRoute: RouteConfig = {
      PATH: '/erogazione',
      LABEL: 'Erogazione',
      EXACT: true,
      REDIRECT: '/erogazione/e-service',
      COMPONENT: () => null,
      PUBLIC: false,
      AUTH_LEVELS: ['admin', 'api'],
      SPLIT_PATH: ['erogazione'],
    }
    const currentRoute: RouteConfig = {
      PATH: '/erogazione/e-service',
      EXACT: true,
      LABEL: 'I tuoi e-service',
      COMPONENT: () => null,
      PUBLIC: false,
      AUTH_LEVELS: ['admin', 'api'],
      SPLIT_PATH: ['erogazione', 'e-service'],
    }

    expect(isParentRoute(possibleParentRoute, currentRoute)).toBeTruthy()
  })
})

describe('Test if route falls under the provider or subscriber view', () => {
  it('It is a provider view', () => {
    const location = {
      pathname: '/erogazione/e-service/crea',
      search: '',
      state: {},
      hash: 'djsf-dsfjs-dsfj',
    }
    expect(isProviderOrSubscriber(location)).toBe('provider')
  })

  it('It is a subscriber view', () => {
    const location = {
      pathname: '/fruizione/client/djsfidsj-dsjfdsij-sdfjsd',
      search: '',
      state: {},
      hash: 'djsf-dsfjs-dsfj',
    }
    expect(isProviderOrSubscriber(location)).toBe('subscriber')
  })

  it('It is neither', () => {
    const location = {
      pathname: '/notifiche',
      search: '',
      state: {},
      hash: 'djsf-dsfjs-dsfj',
    }
    expect(isProviderOrSubscriber(location)).toBeNull()
  })
})

describe('Test if route is part of the protected platform', () => {
  it('It is in platform', () => {
    const location = {
      pathname: '/erogazione/e-service/crea',
      search: '',
      state: {},
      hash: 'djsf-dsfjs-dsfj',
    }
    expect(isInPlatform(location)).toBeTruthy()
  })

  it('It is not in platform', () => {
    const location = {
      pathname: '/guida-ipa',
      search: '',
      state: {},
      hash: 'djsf-dsfjs-dsfj',
    }
    expect(isInPlatform(location)).toBeFalsy()
  })
})
