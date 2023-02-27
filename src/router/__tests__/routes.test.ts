import { getKeys } from '@/utils/array.utils'
import { doesNotThrow, throws } from 'assert'
import identity from 'lodash/identity'
import isEqual from 'lodash/isEqual'
import type { LocalizedRoutes } from '../router.types'
import { getPathSegments } from '../router.utils'
import { routes } from '../routes'

/**
 * For each language path in a LocalizedRoute, the dynamic path segments must be equal.
 * This function does a runtime check and throws if this requirement is not met for any of the implemented LocalizedRoute.
 * Optionally accepts a LocalizedRoutes object as argument for testing purposes.
 *
 * @example Okkay!
 *
 * ```json
 * {
 *    "it": "/:foo/route-italiana/:bar",
 *    "en": "/:foo/english-route/:bar",
 * }
 * ```
 *
 * @example Not okkay!
 * ```json
 * {
 *    "it": "/:foo/route-italiana/:bar",
 *    "en": "/:baz/english-route/:foo",
 * }
 * ```
 *
 */
const checkLocalizedPathsConsistency = (routes: LocalizedRoutes) => {
  const getDynamicSegmentsFromPath = (path: string) => {
    return path
      .split('/')
      .filter(identity)
      .filter((subpath) => subpath.startsWith(':'))
      .map((param) => param.replace(':', ''))
  }

  getKeys(routes).forEach((routeKey) => {
    const paths = Object.values(routes[routeKey].PATH)
    const firstPathDynamicSegments = getDynamicSegmentsFromPath(paths[0])
    const firstPathSegmentNumber = getPathSegments(paths[0])

    const areLocalizedPathsConsistent = paths.every(
      (path) =>
        isEqual(getDynamicSegmentsFromPath(path), firstPathDynamicSegments) &&
        isEqual(getPathSegments(path).length, firstPathSegmentNumber.length)
    )

    if (!areLocalizedPathsConsistent)
      throw new Error(
        `All the dynamic path segments for all the localized path (in the PATH property) must be equal. Check the ${routeKey} paths.`
      )
  })
}

describe('tests if the routes object is correctly set', () => {
  it('Should not throw consistency path error on application route object', () => {
    doesNotThrow(() => {
      checkLocalizedPathsConsistency(routes)
    })
  })

  it('Should throw consistency path error if a given localized path has different dynamic segment names', () => {
    throws(() => {
      checkLocalizedPathsConsistency({
        TEST_ROUTE: {
          AUTH_LEVELS: ['admin'],
          COMPONENT: () => null,
          LABEL: { it: 'Test', en: 'test' },
          PATH: { it: '/:test/route-test', en: '/:testDifferentName/route-test' },
          PUBLIC: false,
        },
      })
    })
  })

  it('Should throw consistency path error if a given localized path has different number of segments', () => {
    throws(() => {
      checkLocalizedPathsConsistency({
        TEST_ROUTE: {
          AUTH_LEVELS: ['admin'],
          COMPONENT: () => null,
          LABEL: { it: 'Test', en: 'test' },
          PATH: { it: '/:test/route-test', en: '/:test/route-test/route-test' },
          PUBLIC: false,
        },
      })
    })
  })
})
