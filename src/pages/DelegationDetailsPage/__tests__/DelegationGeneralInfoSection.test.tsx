import { type Delegation } from '@/api/api.generatedTypes'
import { BACKEND_FOR_FRONTEND_URL } from '@/config/env'
import { setupServer } from 'msw/node'
import { rest } from 'msw'
import { createMockDelegation } from '../../../../__mocks__/data/delegation.mocks'
import {
  mockEnvironmentParams,
  mockUseGetActiveUserParty,
  mockUseJwt,
  renderWithApplicationContext,
} from '@/utils/testing.utils'
import { DelegationGeneralInfoSection } from '../components/DelegationGeneralInfoSection'
import { fireEvent, waitFor } from '@testing-library/react'
const delegationId = 'delegation-id-123'

mockUseGetActiveUserParty()
mockUseJwt()

vi.mock('react-i18next', () => ({
  useTranslation: (namespace: string, options?: { keyPrefix?: string }) => {
    return {
      t: (key: string, params?: Record<string, unknown>) => {
        if (params) {
          let translation = ''

          Object.entries(params).forEach(([_paramKey, value]) => {
            translation += `${value}`
          })

          return translation
        } else {
          const keyPrefix = options?.keyPrefix || ''
          const fullKey = keyPrefix ? `${keyPrefix}.${key}` : key
          return `${namespace}.${fullKey}`
        }
      },
      i18n: {
        language: 'it',
        changeLanguage: vi.fn(),
      },
    }
  },
}))

vi.mock('@pagopa/interop-fe-commons', async () => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const actual = await vi.importActual<typeof import('@pagopa/interop-fe-commons')>(
    '@pagopa/interop-fe-commons'
  )

  return {
    ...actual,
    InformationContainer: ({ label, content }: { label: string; content: string }) => (
      <div>
        <span data-testid="label">{label}</span>
        <span data-testid="content">{content}</span>
      </div>
    ),
  }
})

const mockDownloadSignedContract = vi.fn()
const mockDownloadContract = vi.fn()

vi.mock('@/api/delegation', async () => {
  const actual = await vi.importActual<typeof import('@/api/delegation')>('@/api/delegation')

  return {
    ...actual,
    DelegationDownloads: {
      useDownloadDelegationContract: () => mockDownloadContract,
      useDownloadSignedDelegationContract: () => mockDownloadSignedContract,
    },
  }
})

const server = setupServer(
  rest.get(`${BACKEND_FOR_FRONTEND_URL}/delegations/${delegationId}`, (_, res, ctx) => {
    return res(
      ctx.json<Delegation>(
        createMockDelegation({
          activationContract: {
            id: 'contract-id-123',
            prettyName: 'Delegation Contract',
          },
          activationSignedContract: {
            id: 'contract-signed-id-123',
            prettyName: 'Delegation Contract Signed',
          },
        })
      )
    )
  })
)

beforeAll(() => server.listen())

afterEach(() => {
  // This will remove any runtime request handlers
  // after each test, ensuring isolated network behavior.
  server.resetHandlers()
})

describe('DelegationGeneralInfoSection', () => {
  it('should render correctly', async () => {
    const screen = renderWithApplicationContext(
      <DelegationGeneralInfoSection delegationId={delegationId} />,
      {
        withReactQueryContext: true,
        withRouterContext: true,
      }
    )

    await waitFor(() => {
      expect(screen).toBeDefined()
    })
  })

  describe('FEATURE_FLAG_USE_SIGNED_DOCUMENT', () => {
    it('should able to download delegation signed document when feature flag is enabled', async () => {
      const screen = renderWithApplicationContext(
        <DelegationGeneralInfoSection delegationId={delegationId} />,
        {
          withReactQueryContext: true,
          withRouterContext: true,
        }
      )

      await waitFor(() => {
        const button = screen.getByRole('button', {
          name: /party.delegations.details.generalInfoSection.downloadContractAction.label/i,
        })
        fireEvent.click(button)
        expect(mockDownloadSignedContract).toHaveBeenCalled()
      })
    })

    it('should able to download normal delegation document when feature flag is disabled', async () => {
      mockEnvironmentParams('FEATURE_FLAG_USE_SIGNED_DOCUMENT', false)
      const screen = renderWithApplicationContext(
        <DelegationGeneralInfoSection delegationId={delegationId} />,
        {
          withReactQueryContext: true,
          withRouterContext: true,
        }
      )

      await waitFor(() => {
        const button = screen.getByRole('button', {
          name: /party.delegations.details.generalInfoSection.downloadContractAction.label/i,
        })
        fireEvent.click(button)
        expect(mockDownloadContract).toHaveBeenCalled()
      })
    })
  })
})
