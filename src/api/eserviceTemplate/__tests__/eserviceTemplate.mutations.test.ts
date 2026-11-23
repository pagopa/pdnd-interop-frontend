import axiosInstance from '@/config/axios'
import { BACKEND_FOR_FRONTEND_URL } from '@/config/env'
import { queryClient } from '@/config/query-client'
import { renderHookWithApplicationContext } from '@/utils/testing.utils'
import { EServiceTemplateMutations } from '../eserviceTemplate.mutations'
import { EServiceTemplateServices } from '../eserviceTemplate.services'

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}))

describe('EService template metadata', () => {
  afterEach(() => vi.restoreAllMocks())

  it('PATCHes the supplied metadata and returns the response body', async () => {
    const data = { id: 'template-id' }
    const patch = vi.spyOn(axiosInstance, 'patch').mockResolvedValueOnce({ data })

    expect(
      await EServiceTemplateServices.patchUpdateEServiceTemplate({
        eServiceTemplateId: 'template-id',
        intendedTarget: 'Updated target',
      })
    ).toEqual(data)
    expect(patch).toHaveBeenCalledWith(
      `${BACKEND_FOR_FRONTEND_URL}/eservices/templates/template-id`,
      { intendedTarget: 'Updated target' }
    )
  })

  it.each([
    { fields: { name: 'Updated name' }, feedback: 'successName' },
    { fields: { description: 'Updated description' }, feedback: 'successDescription' },
    { fields: { intendedTarget: 'Updated target' }, feedback: 'successTarget' },
    {
      fields: { name: 'Updated name', description: 'Updated description' },
      feedback: 'successMetadata',
    },
    {
      fields: { name: 'Updated name', intendedTarget: 'Updated target' },
      feedback: 'successMetadata',
    },
    {
      fields: { description: 'Updated description', intendedTarget: 'Updated target' },
      feedback: 'successMetadata',
    },
    {
      fields: {
        name: 'Updated name',
        description: 'Updated description',
        intendedTarget: 'Updated target',
      },
      feedback: 'successMetadata',
    },
  ])('selects $feedback and invalidates template details', async ({ fields, feedback }) => {
    const data = { id: 'template-id' }
    vi.spyOn(axiosInstance, 'patch').mockResolvedValueOnce({ data })
    const versionKey = ['EServiceTemplateGetSingle', data.id, 'version-id']
    const detailKey = ['EServiceTemplateGetSingleByEServiceTemplateId', data.id]
    queryClient.setQueryData(versionKey, {})
    queryClient.setQueryData(detailKey, {})
    const { result } = renderHookWithApplicationContext(
      () => EServiceTemplateMutations.usePatchUpdateEServiceTemplate(),
      { withReactQueryContext: true }
    )

    await result.current.mutateAsync({ eServiceTemplateId: data.id, ...fields })

    const meta = queryClient.getMutationCache().getAll().at(-1)?.meta
    expect(typeof meta?.successToastLabel).toBe('function')
    if (typeof meta?.successToastLabel !== 'function') throw new Error('Missing success label')
    expect(meta.successToastLabel(data, fields)).toBe(`outcome.${feedback}`)
    expect(meta.errorToastLabel).toBe('outcome.error')
    expect(queryClient.getQueryState(versionKey)?.isInvalidated).toBe(true)
    expect(queryClient.getQueryState(detailKey)?.isInvalidated).toBe(true)
  })

  it('propagates PATCH errors', async () => {
    vi.spyOn(axiosInstance, 'patch').mockRejectedValueOnce(new Error('Network failure'))
    const { result } = renderHookWithApplicationContext(
      () => EServiceTemplateMutations.usePatchUpdateEServiceTemplate(),
      { withReactQueryContext: true }
    )
    await expect(
      result.current.mutateAsync({ eServiceTemplateId: 'template-id', name: 'Updated name' })
    ).rejects.toThrow('Network failure')
  })
})
