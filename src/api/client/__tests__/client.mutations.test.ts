import axiosInstance from '@/config/axios'
import { BACKEND_FOR_FRONTEND_URL } from '@/config/env'
import { queryClient } from '@/config/query-client'
import { renderHookWithApplicationContext } from '@/utils/testing.utils'
import { ClientMutations } from '../client.mutations'
import { ClientServices } from '../client.services'

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}))

describe('Client metadata', () => {
  afterEach(() => vi.restoreAllMocks())

  it('PATCHes only the supplied metadata', async () => {
    const patch = vi.spyOn(axiosInstance, 'patch').mockResolvedValueOnce({ data: undefined })

    await expect(
      ClientServices.updateClient({ clientId: 'client-id', name: 'Updated name' })
    ).resolves.toBeUndefined()
    expect(patch).toHaveBeenCalledWith(`${BACKEND_FOR_FRONTEND_URL}/clients/client-id`, {
      name: 'Updated name',
    })
  })

  it.each([
    { fields: { name: 'Updated name' }, feedback: 'successName' },
    { fields: { description: 'Updated description' }, feedback: 'successDescription' },
    {
      fields: { name: 'Updated name', description: 'Updated description' },
      feedback: 'successNameAndDescription',
    },
  ])('selects $feedback and invalidates client queries', async ({ fields, feedback }) => {
    vi.spyOn(axiosInstance, 'patch').mockResolvedValueOnce({ data: undefined })
    const detailKey = ['ClientGetSingle', 'client-id']
    const listKey = ['ClientGetList', { offset: 0, limit: 10 }]
    queryClient.setQueryData(detailKey, {})
    queryClient.setQueryData(listKey, {})
    const { result } = renderHookWithApplicationContext(() => ClientMutations.useUpdateClient(), {
      withReactQueryContext: true,
    })

    await result.current.mutateAsync({ clientId: 'client-id', ...fields })

    const meta = queryClient.getMutationCache().getAll().at(-1)?.meta
    if (typeof meta?.successToastLabel !== 'function') throw new Error('Missing success label')
    expect(meta.successToastLabel(undefined, fields)).toBe(`outcome.${feedback}`)
    expect(meta.errorToastLabel).toBe('outcome.error')
    expect(queryClient.getQueryState(detailKey)?.isInvalidated).toBe(true)
    expect(queryClient.getQueryState(listKey)?.isInvalidated).toBe(true)
  })

  it('propagates PATCH errors', async () => {
    vi.spyOn(axiosInstance, 'patch').mockRejectedValueOnce(new Error('Network failure'))
    const { result } = renderHookWithApplicationContext(() => ClientMutations.useUpdateClient(), {
      withReactQueryContext: true,
    })

    await expect(
      result.current.mutateAsync({ clientId: 'client-id', name: 'Updated name' })
    ).rejects.toThrow('Network failure')
  })
})
