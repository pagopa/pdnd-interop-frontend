import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

const useQueryMock = vi.fn()
const useSubmitDraftMock = vi.fn()
const submitAgreementDraftMock = vi.fn()
const navigateMock = vi.fn()
const getDescriptorCatalogMock = vi.fn()

vi.mock('@tanstack/react-query', async (importOriginal) => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const actual = await importOriginal<typeof import('@tanstack/react-query')>()
  return {
    ...actual,
    useQuery: (options: unknown) => useQueryMock(options),
  }
})

vi.mock('@/api/auth', () => ({
  AuthHooks: {
    useJwt: () => ({ jwt: { organizationId: 'organization-id' } }),
  },
}))

vi.mock('@/api/agreement', () => ({
  AgreementQueries: {
    getSingle: (agreementId: string) => ['AgreementGetSingle', agreementId],
  },
  AgreementMutations: {
    useSubmitDraft: (isDelegated: boolean, isAsyncExchange: boolean) =>
      useSubmitDraftMock(isDelegated, isAsyncExchange),
    useUpdateDraft: () => ({ mutate: vi.fn() }),
    useDeleteDraft: () => ({ mutate: vi.fn() }),
  },
}))

vi.mock('@/api/eservice', () => ({
  EServiceServices: {
    getDescriptorCatalog: getDescriptorCatalogMock,
  },
}))

vi.mock('@/components/layout/containers', () => ({
  PageContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

vi.mock('@/router', () => ({
  Link: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useNavigate: () => navigateMock,
  useParams: () => ({ agreementId: 'agreement-id' }),
}))

vi.mock('@/hooks/useDescriptorAttributesPartyOwnership', () => ({
  useDescriptorAttributesPartyOwnership: () => ({
    hasAllCertifiedAttributes: true,
    hasAllDeclaredAttributes: true,
  }),
}))

vi.mock('@/utils/agreement.utils', () => ({
  isNewEServiceVersionAvailable: () => false,
}))

vi.mock('../components/ConsumerAgreementCreateContent', () => ({
  ConsumerAgreementCreateContent: () => <div>agreement content</div>,
  ConsumerAgreementCreateContentSkeleton: () => <div>loading agreement content</div>,
}))

vi.mock('../hooks/useGetConsumerAgreementCreateAlertProps', () => ({
  useGetConsumerAgreementCreateAlertProps: () => undefined,
}))

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
  Trans: ({ children }: { children: React.ReactNode }) => children,
}))

describe('ConsumerAgreementCreatePage', () => {
  beforeEach(() => {
    navigateMock.mockReset()
    submitAgreementDraftMock.mockReset()
    useSubmitDraftMock.mockReset()
    useSubmitDraftMock.mockReturnValue({ mutate: submitAgreementDraftMock })
    getDescriptorCatalogMock.mockReset()
    getDescriptorCatalogMock.mockResolvedValue({ eservice: { asyncExchange: true } })

    const agreement = {
      id: 'agreement-id',
      consumerNotes: 'consumer notes',
      delegation: { id: 'delegation-id' },
      consumer: {
        id: 'consumer-id',
        name: 'Consumer name',
        contactMail: { address: 'consumer@example.com' },
      },
      descriptorId: 'descriptor-id',
      eservice: {
        id: 'eservice-id',
        activeDescriptor: { state: 'PUBLISHED' },
      },
    }

    useQueryMock.mockReset()
    useQueryMock.mockImplementation((options: unknown) => {
      if (Array.isArray(options) && options[0] === 'AgreementGetSingle') {
        return { data: agreement }
      }

      return { data: { eservice: { asyncExchange: true } } }
    })
  })

  it('should submit the draft with the async exchange confirmation enabled', async () => {
    const user = userEvent.setup()
    const { default: ConsumerAgreementCreatePage } = await import('../ConsumerAgreementCreate.page')

    render(<ConsumerAgreementCreatePage />)

    expect(useSubmitDraftMock).toHaveBeenCalledWith(true, true)

    await user.click(screen.getByRole('button', { name: 'edit.submitBtn' }))

    expect(submitAgreementDraftMock).toHaveBeenCalledWith(
      {
        agreementId: 'agreement-id',
        consumerNotes: 'consumer notes',
        delegatorName: 'Consumer name',
      },
      expect.objectContaining({ onSuccess: expect.any(Function) })
    )
  })

  it('should fetch the descriptor catalog with the agreement e-service and descriptor ids', async () => {
    const { default: ConsumerAgreementCreatePage } = await import('../ConsumerAgreementCreate.page')

    render(<ConsumerAgreementCreatePage />)

    const descriptorQueryOptions = useQueryMock.mock.calls[1]?.[0]

    expect(
      typeof descriptorQueryOptions === 'object' &&
        descriptorQueryOptions !== null &&
        'queryFn' in descriptorQueryOptions &&
        typeof descriptorQueryOptions.queryFn === 'function' &&
        (await descriptorQueryOptions.queryFn())
    ).toEqual({ eservice: { asyncExchange: true } })
    expect(getDescriptorCatalogMock).toHaveBeenCalledWith('eservice-id', 'descriptor-id')
  })

  it('should not fetch the descriptor catalog without an agreement', async () => {
    useQueryMock.mockImplementation((options: unknown) => {
      if (Array.isArray(options) && options[0] === 'AgreementGetSingle') {
        return { data: undefined }
      }

      return { data: undefined }
    })
    const { default: ConsumerAgreementCreatePage } = await import('../ConsumerAgreementCreate.page')

    render(<ConsumerAgreementCreatePage />)

    const descriptorQueryOptions = useQueryMock.mock.calls[1]?.[0]

    expect(() => {
      if (
        typeof descriptorQueryOptions === 'object' &&
        descriptorQueryOptions !== null &&
        'queryFn' in descriptorQueryOptions &&
        typeof descriptorQueryOptions.queryFn === 'function'
      ) {
        descriptorQueryOptions.queryFn()
      }
    }).toThrow('Agreement is required to fetch descriptor')
  })
})
