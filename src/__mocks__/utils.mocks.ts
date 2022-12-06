import { Paginated } from './../api/comon.api.types'

/** Wraps the data passed in the pagination data structure */
export function createPaginatedMockData<T>(
  data: Array<T>,
  pagination?: Partial<Paginated<T>['pagination']>
): Paginated<T> {
  return {
    results: data,
    pagination: {
      offset: pagination?.offset ?? 0,
      limit: pagination?.offset ?? 50,
      totalResults: pagination?.offset ?? data.length,
    },
  }
}
