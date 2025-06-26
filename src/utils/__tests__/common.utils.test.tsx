import { getAllFromPaginated } from '../common.utils'

describe('getAllFromPaginated', () => {
  it('should return all items on a single page using results.length for termination', async () => {
    const getPaginatedCall = vi.fn().mockResolvedValue({
      results: [{ id: 1 }, { id: 2 }],
    })

    const result = await getAllFromPaginated(getPaginatedCall)

    expect(result).toEqual([{ id: 1 }, { id: 2 }])
    expect(getPaginatedCall).toHaveBeenCalledTimes(1)
    expect(getPaginatedCall).toHaveBeenCalledWith(0, 50)
  })

  it('should return all items on a single page using pagination.totalCount for termination', async () => {
    const getPaginatedCall = vi.fn().mockResolvedValue({
      results: [{ id: 1 }, { id: 2 }, { id: 3 }],
      pagination: { totalCount: 3 },
    })

    const result = await getAllFromPaginated(getPaginatedCall)

    expect(result).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }])
    expect(getPaginatedCall).toHaveBeenCalledTimes(1)
    expect(getPaginatedCall).toHaveBeenCalledWith(0, 50)
  })

  it('should return all items from multiple pages, relying on results.length for termination', async () => {
    const getPaginatedCall = vi
      .fn()
      .mockResolvedValueOnce({
        results: Array.from({ length: 50 }, (_, i) => ({ id: i })),
      })
      .mockResolvedValueOnce({
        results: [{ id: 50 }, { id: 51 }],
      })

    const result = await getAllFromPaginated(getPaginatedCall)

    expect(result.length).toBe(52)
    expect(result[51]).toEqual({ id: 51 })
    expect(getPaginatedCall).toHaveBeenCalledTimes(2)
    expect(getPaginatedCall).toHaveBeenNthCalledWith(1, 0, 50)
    expect(getPaginatedCall).toHaveBeenNthCalledWith(2, 50, 50)
  })

  it('should handle multi-page fetching when totalCount is consistently provided', async () => {
    const getPaginatedCall = vi
      .fn()
      .mockResolvedValueOnce({
        results: Array.from({ length: 50 }, (_, i) => ({ id: i })),
        pagination: { totalCount: 75 },
      })
      .mockResolvedValueOnce({
        results: Array.from({ length: 25 }, (_, i) => ({ id: i + 50 })),
        pagination: { totalCount: 75 },
      })
      .mockResolvedValueOnce({
        results: [],
        pagination: { totalCount: 75 },
      })

    const result = await getAllFromPaginated(getPaginatedCall)

    expect(result.length).toBe(75)
    expect(result[74]).toEqual({ id: 74 })
    expect(getPaginatedCall).toHaveBeenCalledTimes(3)
    expect(getPaginatedCall).toHaveBeenNthCalledWith(1, 0, 50)
    expect(getPaginatedCall).toHaveBeenNthCalledWith(2, 50, 50)
    expect(getPaginatedCall).toHaveBeenNthCalledWith(3, 100, 50)
  })

  it('should return an empty array if there are no results', async () => {
    const getPaginatedCall = vi.fn().mockResolvedValue({
      results: [],
      pagination: { totalCount: 0 },
    })

    const result = await getAllFromPaginated(getPaginatedCall)

    expect(result).toEqual([])
    expect(getPaginatedCall).toHaveBeenCalledTimes(1)
  })
})
