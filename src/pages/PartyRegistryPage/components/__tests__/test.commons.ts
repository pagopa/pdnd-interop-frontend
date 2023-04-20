import { PartyQueries } from '@/api/party/party.hooks'
import type { RemappedTenant } from '@/types/party.types'
import { vi } from 'vitest'

export const mockGetActiveUserPartySpy = (result: RemappedTenant | undefined) => {
  vi.spyOn(PartyQueries, 'useGetActiveUserParty').mockReturnValue({
    data: result,
  } as unknown as ReturnType<typeof PartyQueries.useGetActiveUserParty>)
}
