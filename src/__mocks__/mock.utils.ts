import { Paginated } from '../api/comon.api.types'
import cloneDeep from 'lodash/cloneDeep'

/**
 * Wraps the data passed in the pagination data structure
 * */
export function createPaginatedMockData<T>(
  data: Array<T>,
  pagination?: Partial<Paginated<T>['pagination']>
): Paginated<T> {
  return {
    results: data,
    pagination: {
      offset: pagination?.offset ?? 0,
      limit: pagination?.offset ?? 50,
      totalCount: pagination?.offset ?? data.length,
    },
  }
}

/**
 * Create and returns a mock factory function
 */
export function createMockFactory<T>(defaultValue: T) {
  return (overwrites: Partial<T> = {}) => {
    return cloneDeep({
      ...defaultValue,
      ...overwrites,
    }) as T
  }
}
