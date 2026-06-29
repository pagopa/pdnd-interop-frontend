import { renderHookWithApplicationContext } from '@/utils/testing.utils'
import { useProductUpdatesBanner } from '../bannerHooks/useProductUpdatesBanner'
import { useQuery } from '@tanstack/react-query'
import type * as ReactQuery from '@tanstack/react-query'
import { useBaseBanner } from '../bannerHooks/useBaseBanner'
import { vi } from 'vitest'

vi.mock('@tanstack/react-query', async (importOriginal) => {
  const actual = await importOriginal<typeof ReactQuery>()

  return {
    ...actual,
    useQuery: vi.fn(),
  }
})

vi.mock('../bannerHooks/useBaseBanner', () => ({
  useBaseBanner: vi.fn(),
}))

const bannerData = {
  start: { date: '2026-06-11', time: '00:00' },
  end: { date: '2026-06-12', time: '23:59' },
}

describe('useProductUpdatesBanner', () => {
  beforeEach(() => {
    vi.mocked(useQuery).mockReturnValue({ data: bannerData } as ReturnType<typeof useQuery>)
    vi.mocked(useBaseBanner).mockReturnValue({
      isOpen: true,
      closeBanner: vi.fn(),
      bannerInfo: {
        startString: '2026-06-11T00:00:00',
        endString: '2026-06-12T23:59:00',
        startTimestamp: new Date('2026-06-11T00:00:00').getTime(),
        endTimestamp: new Date('2026-06-12T23:59:00').getTime(),
        durationInHours: 48,
        durationType: 'days',
      },
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('returns product updates banner content and base banner state', () => {
    const { result } = renderHookWithApplicationContext(() => useProductUpdatesBanner(), {
      withReactQueryContext: true,
    })

    expect(result.current).toMatchObject({
      title: 'title',
      text: 'body',
      action1Label: 'action1Label',
      action2Label: 'action2Label',
      action1AriaLabel: 'action1AriaLabel',
      action2AriaLabel: 'action2AriaLabel',
      isOpen: true,
    })
    expect(useBaseBanner).toHaveBeenCalledWith({
      data: bannerData,
      storageKey: 'productUpdatesBannerDismissedUntil',
      bannerKey: 'productUpdates',
      priority: 2,
    })
  })
})
