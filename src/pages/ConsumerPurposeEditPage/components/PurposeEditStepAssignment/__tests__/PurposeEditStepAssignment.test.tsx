import React from 'react'
import { render, screen } from '@testing-library/react'
import type { Mock } from 'vitest'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useQuery } from '@tanstack/react-query'
import { PurposeEditStepAssignment } from '../PurposeEditStepAssignment'
import PurposeEditStepAssignmentForm from '../PurposeEditStepAssignmentForm'
import PurposeEditStepAssignmentReadOnly from '../PurposeEditStepAssignmentReadOnly'
import { NotFoundError } from '@/utils/errors.utils'
import { createMockPurpose } from '@/../__mocks__/data/purpose.mocks'
import type {
  Purpose,
  PurposeVersionState,
  RiskAnalysisReviewMode,
  User,
} from '@/api/api.generatedTypes'

vi.mock('@/router', () => ({
  useParams: () => ({ purposeId: 'purpose-123' }),
}))

vi.mock('@tanstack/react-query', async () => {
  const actual =
    await vi.importActual<typeof import('@tanstack/react-query')>('@tanstack/react-query')
  return {
    ...actual,
    useQuery: vi.fn(),
  }
})

vi.mock('@/api/purpose', () => ({
  PurposeQueries: {
    getSingle: (purposeId: string) => ({ queryKey: ['PurposeGetSingle', purposeId] }),
  },
}))

vi.mock('@/api/tenant', () => ({
  TenantQueries: {
    getPartyUsersList: (params: unknown) => ({
      queryKey: ['PartyGetPartyUsersList', params],
    }),
  },
}))

const useJwtMock = vi.fn()
vi.mock('@/api/auth', () => ({
  AuthHooks: {
    useJwt: () => useJwtMock(),
  },
}))

vi.mock('@/hooks/useCurrentLanguage', () => ({
  default: () => 'it',
}))

vi.mock('@/config/env', async () => {
  const actual = await vi.importActual<typeof import('@/config/env')>('@/config/env')
  return {
    ...actual,
    SELFCARE_BASE_URL: 'https://selfcare.test',
    SELFCARE_PRODUCT_ID: 'prod-interop',
  }
})

vi.mock('../PurposeEditStepAssignmentForm', async () => {
  const actual = await vi.importActual<typeof import('../PurposeEditStepAssignmentForm')>(
    '../PurposeEditStepAssignmentForm'
  )
  return {
    ...actual,
    default: vi.fn(() => <div data-testid="assignment-form" />),
    PurposeEditStepAssignmentFormSkeleton: vi.fn(() => <div data-testid="skeleton" />),
  }
})

vi.mock('../PurposeEditStepAssignmentReadOnly', () => ({
  default: vi.fn(() => <div data-testid="assignment-readonly" />),
}))

type AssignmentPurposeOverrides = {
  reviewMode?: RiskAnalysisReviewMode
  reviewerIds?: string[]
  versionState?: PurposeVersionState
}

function buildPurpose(
  overrides: Partial<Purpose> = {},
  assignment?: AssignmentPurposeOverrides
): Purpose {
  const reviewerWorkflow: Purpose['reviewerWorkflow'] | undefined = assignment?.reviewMode
    ? {
        reviewMode: assignment.reviewMode,
        reviewerIds: assignment.reviewerIds ?? [],
        signingState: 'ASSIGNED',
      }
    : undefined
  const base = createMockPurpose({ id: 'purpose-123', ...overrides })
  return {
    ...base,
    // Default to an editable draft so the form path is exercised unless a test opts out.
    currentVersion: base.currentVersion && {
      ...base.currentVersion,
      state: assignment?.versionState ?? 'DRAFT',
    },
    ...(reviewerWorkflow ? { reviewerWorkflow } : {}),
  }
}

function buildReviewers(): Array<User> {
  return [
    {
      userId: 'reviewer-1',
      tenantId: 'tenant-1',
      name: 'Mario',
      familyName: 'Rossi',
      roles: ['reviewer'],
    },
  ]
}

function mockQueries({
  purpose,
  reviewers,
  isLoadingPurpose = false,
  isLoadingReviewers = false,
}: {
  purpose?: Purpose
  reviewers?: Array<User>
  isLoadingPurpose?: boolean
  isLoadingReviewers?: boolean
}) {
  ;(useQuery as Mock).mockImplementation((options: { queryKey: Array<unknown> }) => {
    const [key] = options.queryKey
    if (key === 'PurposeGetSingle') {
      return { data: purpose, isLoading: isLoadingPurpose }
    }
    if (key === 'PartyGetPartyUsersList') {
      return { data: reviewers, isLoading: isLoadingReviewers }
    }
    return { data: undefined, isLoading: false }
  })
}

function setJwt(overrides: { organizationId?: string; selfcareId?: string } = {}) {
  useJwtMock.mockReturnValue({
    jwt: {
      organizationId: overrides.organizationId ?? 'org-current',
      selfcareId: overrides.selfcareId ?? 'selfcare-1',
    },
    isAdmin: true,
  })
}

describe('PurposeEditStepAssignment', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    setJwt()
  })

  it('renders the skeleton while the purpose is loading', () => {
    mockQueries({ purpose: undefined, reviewers: [], isLoadingPurpose: true })

    render(<PurposeEditStepAssignment back={vi.fn()} forward={vi.fn()} activeStep={1} />)

    expect(screen.getByTestId('skeleton')).toBeInTheDocument()
  })

  it('renders the skeleton while the reviewers list is loading', () => {
    mockQueries({ purpose: buildPurpose(), reviewers: undefined, isLoadingReviewers: true })

    render(<PurposeEditStepAssignment back={vi.fn()} forward={vi.fn()} activeStep={1} />)

    expect(screen.getByTestId('skeleton')).toBeInTheDocument()
  })

  it('throws NotFoundError when the purpose is missing after loading', () => {
    mockQueries({ purpose: undefined, reviewers: [] })

    expect(() =>
      render(<PurposeEditStepAssignment back={vi.fn()} forward={vi.fn()} activeStep={1} />)
    ).toThrow(NotFoundError)
  })

  it('renders the form with isDelegate=false when the institution is not the delegate of the purpose', () => {
    const purpose = buildPurpose({
      delegation: {
        id: 'delegation-1',
        delegate: { id: 'some-other-org', name: 'Other' },
        delegator: { id: 'delegator', name: 'Delegator' },
      },
    })
    mockQueries({ purpose, reviewers: buildReviewers() })

    render(<PurposeEditStepAssignment back={vi.fn()} forward={vi.fn()} activeStep={1} />)

    expect(PurposeEditStepAssignmentForm).toHaveBeenCalledWith(
      expect.objectContaining({ isDelegate: false }),
      expect.anything()
    )
  })

  it('renders the form with isDelegate=true when the institution is the delegate of the purpose', () => {
    const purpose = buildPurpose({
      delegation: {
        id: 'delegation-1',
        delegate: { id: 'org-current', name: 'Current' },
        delegator: { id: 'delegator', name: 'Delegator' },
      },
    })
    mockQueries({ purpose, reviewers: buildReviewers() })

    render(<PurposeEditStepAssignment back={vi.fn()} forward={vi.fn()} activeStep={1} />)

    expect(PurposeEditStepAssignmentForm).toHaveBeenCalledWith(
      expect.objectContaining({ isDelegate: true }),
      expect.anything()
    )
  })

  it('builds the SelfCare users page URL from jwt, lang and product id', () => {
    setJwt({ organizationId: 'org-current', selfcareId: 'selfcare-42' })
    mockQueries({ purpose: buildPurpose(), reviewers: buildReviewers() })

    render(<PurposeEditStepAssignment back={vi.fn()} forward={vi.fn()} activeStep={1} />)

    expect(PurposeEditStepAssignmentForm).toHaveBeenCalledWith(
      expect.objectContaining({
        selfcareUsersPageUrl:
          'https://selfcare.test/dashboard/selfcare-42/users?lang=it#prod-interop',
      }),
      expect.anything()
    )
  })

  it('passes the reviewers list and the purpose down to the form', () => {
    const reviewers = buildReviewers()
    const purpose = buildPurpose()
    mockQueries({ purpose, reviewers })

    render(<PurposeEditStepAssignment back={vi.fn()} forward={vi.fn()} activeStep={1} />)

    expect(PurposeEditStepAssignmentForm).toHaveBeenCalledWith(
      expect.objectContaining({ reviewers, purpose }),
      expect.anything()
    )
  })

  it('defaults reviewMode to selfWritesSelfSigns when the purpose has no reviewMode set', () => {
    mockQueries({ purpose: buildPurpose(), reviewers: buildReviewers() })

    render(<PurposeEditStepAssignment back={vi.fn()} forward={vi.fn()} activeStep={1} />)

    expect(PurposeEditStepAssignmentForm).toHaveBeenCalledWith(
      expect.objectContaining({
        defaultValues: { reviewMode: 'selfWritesSelfSigns', reviewerId: undefined },
      }),
      expect.anything()
    )
  })

  it('renders the read-only step (not the form) when the purpose has a persisted reviewer workflow', () => {
    const purpose = buildPurpose(
      {},
      { reviewMode: 'ADMIN_WRITES_REVIEWER_SIGNS', reviewerIds: ['reviewer-1'] }
    )
    mockQueries({ purpose, reviewers: buildReviewers() })

    render(<PurposeEditStepAssignment back={vi.fn()} forward={vi.fn()} activeStep={1} />)

    expect(screen.getByTestId('assignment-readonly')).toBeInTheDocument()
    expect(PurposeEditStepAssignmentForm).not.toHaveBeenCalled()
  })

  it('forwards the purpose and the reviewers list to the read-only step', () => {
    const reviewers = buildReviewers()
    const purpose = buildPurpose(
      {},
      { reviewMode: 'REVIEWER_WRITES_REVIEWER_SIGNS', reviewerIds: ['reviewer-1'] }
    )
    mockQueries({ purpose, reviewers })

    render(<PurposeEditStepAssignment back={vi.fn()} forward={vi.fn()} activeStep={1} />)

    expect(PurposeEditStepAssignmentReadOnly).toHaveBeenCalledWith(
      expect.objectContaining({ purpose, reviewers }),
      expect.anything()
    )
  })

  it('renders the editable form (not the read-only step) when the purpose has no reviewer workflow', () => {
    mockQueries({ purpose: buildPurpose(), reviewers: buildReviewers() })

    render(<PurposeEditStepAssignment back={vi.fn()} forward={vi.fn()} activeStep={1} />)

    expect(PurposeEditStepAssignmentForm).toHaveBeenCalled()
    expect(PurposeEditStepAssignmentReadOnly).not.toHaveBeenCalled()
  })

  it('renders the read-only step when the purpose is published, even without a reviewer workflow', () => {
    const purpose = buildPurpose({}, { versionState: 'ACTIVE' })
    mockQueries({ purpose, reviewers: buildReviewers() })

    render(<PurposeEditStepAssignment back={vi.fn()} forward={vi.fn()} activeStep={1} />)

    expect(screen.getByTestId('assignment-readonly')).toBeInTheDocument()
    expect(PurposeEditStepAssignmentForm).not.toHaveBeenCalled()
  })

  it('passes an empty array as reviewers when the tenant has no users with the reviewer role', () => {
    mockQueries({ purpose: buildPurpose(), reviewers: [] })

    render(<PurposeEditStepAssignment back={vi.fn()} forward={vi.fn()} activeStep={1} />)

    expect(PurposeEditStepAssignmentForm).toHaveBeenCalledWith(
      expect.objectContaining({ reviewers: [] }),
      expect.anything()
    )
  })
})
