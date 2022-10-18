import { MappedRouteConfig } from '../../../types'
import {
  buildDynamicPath,
  buildDynamicRoute,
  getBits,
  getDecoratedRoutes,
  getLastBit,
  isParentRoute,
  isProviderOrSubscriber,
  isSamePath,
} from '../router-utils'

describe('Location belongs to route tree', () => {
  // it('belongs to route tree (aka has an ancestor in that route)', () => {
  //   const location = {
  //     pathname: '/erogazione/e-service/crea',
  //     search: '',
  //     state: {},
  //     hash: 'djsf-dsfjs-dsfj',
  //   }
  //   const route: MappedRouteConfig = {
  //     PATH: '/erogazione',
  //     LABEL: 'Erogazione',
  //     EXACT: true,
  //     REDIRECT: '/erogazione/e-service',
  //     COMPONENT: () => null,
  //     PUBLIC: false,
  //     AUTH_LEVELS: ['admin', 'api'],
  //     SPLIT_PATH: ['erogazione'],
  //   }
  //   expect(belongsToTree(location, route)).toBeTruthy()
  // })
  // it("doesn't belongs to route tree", () => {
  //   const location = {
  //     pathname: '/erogazione/e-service/crea',
  //     search: '',
  //     state: {},
  //     hash: 'djsf-dsfjs-dsfj',
  //   }
  //   const route: MappedRouteConfig = {
  //     PATH: '/fruizione',
  //     LABEL: 'Fruizione',
  //     EXACT: true,
  //     REDIRECT: '/fruizione/catalogo-e-service',
  //     COMPONENT: () => null,
  //     PUBLIC: false,
  //     AUTH_LEVELS: ['admin', 'security'],
  //     SPLIT_PATH: ['fruizione'],
  //   }
  //   expect(belongsToTree(location, route)).toBeFalsy()
  // })
})

describe('Path matches', () => {
  it('matches - static path', () => {
    expect(
      isSamePath('/it/erogazione/e-service/crea', '/it/erogazione/e-service/crea')
    ).toBeTruthy()
  })

  it('matches - dynamic path', () => {
    expect(
      isSamePath(
        '/it/fruizione/client/dksfdskf-sdfksdfk-sdfksdf/operatori/ABCDEF44R33E333W',
        '/it/fruizione/client/:id/operatori/:operatorId'
      )
    ).toBeTruthy()
  })

  it("doesn't match - ancestor", () => {
    expect(
      isSamePath(
        '/it/fruizione/client/dksfdskf-sdfksdfk-sdfksdf/operatori/ABCDEF44R33E333W',
        '/it/fruizione/client/:id'
      )
    ).toBeFalsy()
  })

  it("doesn't match - different roots", () => {
    expect(
      isSamePath(
        '/it/fruizione/client/dksfdskf-sdfksdfk-sdfksdf',
        '/it/erogazione/client/dksfdskf-sdfksdfk-sdfksdf'
      )
    ).toBeFalsy()
  })
})

describe('Route descends from another route', () => {
  const possibleParentRoute: MappedRouteConfig = {
    PATH: '/erogazione',
    LABEL: 'Erogazione',
    EXACT: true,
    REDIRECT: '/erogazione/e-service',
    COMPONENT: () => null,
    PUBLIC: false,
    AUTH_LEVELS: ['admin', 'api'],
    SPLIT_PATH: ['erogazione'],
  }
  const currentRoute: MappedRouteConfig = {
    PATH: '/erogazione/e-service',
    EXACT: true,
    LABEL: 'I tuoi ',
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

// describe('Route guard', () => {
//   it('is protected', () => {
//     const location = {
//       pathname: '/erogazione/e-service/crea',
//       search: '',
//       state: {},
//       hash: 'djsf-dsfjs-dsfj',
//     }
//     expect(isProtectedRoute(location)).toBeTruthy()
//   })

//   it('is not protected', () => {
//     const location = {
//       pathname: '/aiuto',
//       search: '',
//       state: {},
//       hash: 'djsf-dsfjs-dsfj',
//     }
//     expect(isProtectedRoute(location)).toBeFalsy()
//   })
// })

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

    const inputRoute: MappedRouteConfig = {
      PATH: '/erogazione/e-service/:eserviceId/:descriptorId',
      EXACT: false,
      LABEL: 'Gestisci o visualizza ',
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
  const allRoutes = getDecoratedRoutes()
  const routes = allRoutes['it']

  expect(routes.PROVIDE.PARENTS?.length).toBe(0)
  expect(routes.PROVIDE_ESERVICE_LIST.PARENTS?.length).toBe(1)
  expect(routes.PROVIDE_ESERVICE_CREATE.PARENTS?.length).toBe(2)
  expect(routes.PROVIDE_ESERVICE_EDIT.PARENTS?.length).toBe(2)

  expect(routes.PROVIDE_ESERVICE_EDIT.PARENTS?.[0].PATH).toBe(routes.PROVIDE.PATH)
  expect(routes.PROVIDE_ESERVICE_EDIT.PARENTS?.[1].PATH).toBe(routes.PROVIDE_ESERVICE_LIST.PATH)
})
