import { vi, describe, it, expect, beforeEach } from 'vitest'
import type { CatalogFilterPayload } from '../../api.generatedTypes'
import { EServiceServices } from '../eservice.services'
import { EServiceQueries } from '../eservice.queries'

vi.mock('../eservice.services', () => ({
  EServiceServices: {
    queryCatalogList: vi.fn(),
    getFeaturedEServicesCatalog: vi.fn(),
  },
}))

describe('EServiceQueries.queryCatalogList', () => {
  const payload = { limit: 12, offset: 0 } as unknown as CatalogFilterPayload

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('builds the query key from the payload', () => {
    const options = EServiceQueries.queryCatalogList(payload)

    expect(options.queryKey).toEqual(['EServiceQueryCatalogList', payload])
  })

  it('produces different keys for different payloads', () => {
    const other = { limit: 12, offset: 12 } as unknown as CatalogFilterPayload

    expect(EServiceQueries.queryCatalogList(payload).queryKey).not.toEqual(
      EServiceQueries.queryCatalogList(other).queryKey
    )
  })

  it('calls EServiceServices.queryCatalogList with the payload and returns its result', async () => {
    const response = { results: [], pagination: { totalCount: 0 } }
    vi.mocked(EServiceServices.queryCatalogList).mockResolvedValue(response as never)

    const options = EServiceQueries.queryCatalogList(payload)
    const result = await (options.queryFn as () => Promise<unknown>)()

    expect(EServiceServices.queryCatalogList).toHaveBeenCalledWith(payload)
    expect(result).toBe(response)
  })
})

describe('EServiceQueries.getFeaturedEServicesCatalog', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('builds the query key', () => {
    const options = EServiceQueries.getFeaturedEServicesCatalog()

    expect(options.queryKey).toEqual(['EServiceGetFeaturedEServicesCatalog'])
  })

  it('calls EServiceServices.getFeaturedEServicesCatalog without parameters and returns its result', async () => {
    const response: Awaited<ReturnType<typeof EServiceServices.getFeaturedEServicesCatalog>> = []
    vi.mocked(EServiceServices.getFeaturedEServicesCatalog).mockResolvedValue(response)

    const options = EServiceQueries.getFeaturedEServicesCatalog()
    const result = await (options.queryFn as () => Promise<unknown>)()

    expect(EServiceServices.getFeaturedEServicesCatalog).toHaveBeenCalledWith()
    expect(result).toBe(response)
  })
})
