import { RouteConfig } from '../../../types'
import {
  belongsToTree,
  buildDynamicPath,
  buildDynamicRoute,
  decorateRouteWithParents,
  getBits,
  getLastBit,
  isProtectedRoute,
  isParentRoute,
  isProviderOrSubscriber,
  isSamePath,
} from '../router-utils'

describe('Location belongs to route tree', () => {
  it('belongs to route tree (aka has an ancestor in that route)', () => {
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

  it("doesn't belongs to route tree", () => {
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

describe('Path matches', () => {
  it('matches - static path', () => {
    expect(isSamePath('/erogazione/e-service/crea', '/erogazione/e-service/crea')).toBeTruthy()
  })

  it('matches - dynamic path', () => {
    expect(
      isSamePath(
        '/fruizione/client/dksfdskf-sdfksdfk-sdfksdf/operatori/ABCDEF44R33E333W',
        '/fruizione/client/:id/operatori/:operatorId'
      )
    ).toBeTruthy()
  })

  it("doesn't match - ancestor", () => {
    expect(
      isSamePath(
        '/fruizione/client/dksfdskf-sdfksdfk-sdfksdf/operatori/ABCDEF44R33E333W',
        '/fruizione/client/:id'
      )
    ).toBeFalsy()
  })

  it("doesn't match - different roots", () => {
    expect(
      isSamePath(
        '/fruizione/client/dksfdskf-sdfksdfk-sdfksdf',
        '/erogazione/client/dksfdskf-sdfksdfk-sdfksdf'
      )
    ).toBeFalsy()
  })
})

describe('Route descends from another route', () => {
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

describe('Route falls under the provider or subscriber view', () => {
  it('is a provider view', () => {
    const location = {
      pathname: '/erogazione/e-service/crea',
      search: '',
      state: {},
      hash: 'djsf-dsfjs-dsfj',
    }
    expect(isProviderOrSubscriber(location)).toBe('provider')
  })

  it('is a subscriber view', () => {
    const location = {
      pathname: '/fruizione/client/djsfidsj-dsjfdsij-sdfjsd',
      search: '',
      state: {},
      hash: 'djsf-dsfjs-dsfj',
    }
    expect(isProviderOrSubscriber(location)).toBe('subscriber')
  })

  it('is neither', () => {
    const location = {
      pathname: '/notifiche',
      search: '',
      state: {},
      hash: 'djsf-dsfjs-dsfj',
    }
    expect(isProviderOrSubscriber(location)).toBeNull()
  })
})

describe('Route guard', () => {
  it('is protected', () => {
    const location = {
      pathname: '/erogazione/e-service/crea',
      search: '',
      state: {},
      hash: 'djsf-dsfjs-dsfj',
    }
    expect(isProtectedRoute(location)).toBeTruthy()
  })

  it('is not protected', () => {
    const location = {
      pathname: '/aiuto',
      search: '',
      state: {},
      hash: 'djsf-dsfjs-dsfj',
    }
    expect(isProtectedRoute(location)).toBeFalsy()
  })
})

describe('Location path splitting', () => {
  it('is split correctly', () => {
    const location = {
      pathname: '/erogazione/e-service/crea',
      search: '',
      state: {},
      hash: 'djsf-dsfjs-dsfj',
    }
    expect(getBits(location)).toEqual(['erogazione', 'e-service', 'crea'])
  })

  it('returns last url bit correctly', () => {
    const location = {
      pathname: '/fruizione/client/sdfjs-dsfjsdik-werwer',
      search: '',
      state: {},
      hash: 'djsf-dsfjs-dsfj',
    }
    expect(getLastBit(location)).toBe('sdfjs-dsfjsdik-werwer')
  })
})

describe('Dynamic routes and paths building', () => {
  it('creates dynamic path from parameters', () => {
    const eserviceId = 'ewjfiw-sdfjsdiz-nifs'
    const descriptorId = 'weorjw-uuioew-weirjwe'

    expect(
      buildDynamicPath('/erogazione/e-service/:eserviceId/:descriptorId', {
        eserviceId,
        descriptorId,
      })
    ).toBe(`/erogazione/e-service/${eserviceId}/${descriptorId}`)
  })

  it('creates dynamic route from parameters', () => {
    const eserviceId = 'ewjfiw-sdfjsdiz-nifs'
    const descriptorId = 'weorjw-uuioew-weirjwe'

    const inputRoute: RouteConfig = {
      PATH: '/erogazione/e-service/:eserviceId/:descriptorId',
      EXACT: false,
      LABEL: 'Gestisci o visualizza e-service',
      COMPONENT: () => null,
      PUBLIC: false,
      AUTH_LEVELS: ['admin', 'api'],
      SPLIT_PATH: ['erogazione', 'e-service', ':eserviceId', ':descriptorId'],
    }
    const outputRoute = {
      ...inputRoute,
      PATH: `/erogazione/e-service/${eserviceId}/${descriptorId}`,
    }

    expect(buildDynamicRoute(inputRoute, { eserviceId, descriptorId })).toEqual(outputRoute)
  })
})

describe('Decorate route with parent routes creates parent tree correctly', () => {
  const routes: Record<string, RouteConfig> = {
    PROVIDE_ESERVICE_CREATE: {
      PATH: '/erogazione/e-service/crea',
      EXACT: true,
      LABEL: 'Crea e-service',
      COMPONENT: () => null,
      PUBLIC: false,
      AUTH_LEVELS: ['admin', 'api'],
      SPLIT_PATH: ['erogazione', 'e-service', 'crea'],
    },
    PROVIDE_ESERVICE_EDIT: {
      PATH: '/erogazione/e-service/:eserviceId/:descriptorId',
      EXACT: false,
      LABEL: 'Gestisci o visualizza e-service',
      COMPONENT: () => null,
      PUBLIC: false,
      AUTH_LEVELS: ['admin', 'api'],
      SPLIT_PATH: ['erogazione', 'e-service', ':eserviceId', ':descriptorId'],
    },
    PROVIDE_ESERVICE_LIST: {
      PATH: '/erogazione/e-service',
      EXACT: true,
      LABEL: 'I tuoi e-service',
      COMPONENT: () => null,
      PUBLIC: false,
      AUTH_LEVELS: ['admin', 'api'],
      SPLIT_PATH: ['erogazione', 'e-service'],
    },
    PROVIDE: {
      PATH: '/erogazione',
      LABEL: 'Erogazione',
      EXACT: true,
      REDIRECT: '/erogazione/e-service',
      COMPONENT: () => null,
      PUBLIC: false,
      AUTH_LEVELS: ['admin', 'api'],
      SPLIT_PATH: ['erogazione'],
    },
  }

  const decorated = decorateRouteWithParents(routes)

  expect(decorated.PROVIDE.PARENTS?.length).toBe(0)
  expect(decorated.PROVIDE_ESERVICE_LIST.PARENTS?.length).toBe(1)
  expect(decorated.PROVIDE_ESERVICE_CREATE.PARENTS?.length).toBe(2)
  expect(decorated.PROVIDE_ESERVICE_EDIT.PARENTS?.length).toBe(2)

  expect(decorated.PROVIDE_ESERVICE_EDIT.PARENTS?.[0].PATH).toBe(decorated.PROVIDE.PATH)
  expect(decorated.PROVIDE_ESERVICE_EDIT.PARENTS?.[1].PATH).toBe(
    decorated.PROVIDE_ESERVICE_LIST.PATH
  )
})
