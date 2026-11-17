import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

const navigateMock = vi.fn()
const publishDraftMock = vi.fn()

vi.mock('@tanstack/react-query', () => ({
  useQuery: () => ({ data: { state: 'DRAFT' }, isLoading: false }),
}))

vi.mock('@/api/auth', () => ({
  AuthHooks: { useJwt: () => ({ isViewer: false }) },
}))

vi.mock('@/api/purposeTemplate/purposeTemplate.queries', () => ({
  PurposeTemplateQueries: { getSingle: vi.fn() },
}))

vi.mock('@/api/purposeTemplate/purposeTemplate.mutations', () => ({
  PurposeTemplateMutations: {
    useDeleteDraft: () => ({ mutate: vi.fn() }),
    usePublishDraft: () => ({ mutate: publishDraftMock }),
  },
}))

vi.mock('@/router', () => ({
  useNavigate: () => navigateMock,
  useParams: () => ({ purposeTemplateId: 'purpose-template-id' }),
}))

vi.mock('@/components/layout/containers', () => ({
  PageContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

vi.mock('@/components/shared/SummaryAccordion', () => ({
  SummaryAccordion: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SummaryAccordionSkeleton: () => null,
}))

vi.mock('../components', () => ({
  PurposeTemplateTemplateSummaryGeneralInformationAccordion: () => null,
}))

vi.mock('../components/PurposeTemplateSummaryLinkedResourceAccordion', () => ({
  PurposeTemplateSummaryLinkedResourceAccordion: () => null,
}))

vi.mock('../components/PurposeTemplateSummaryRiskAnalysisAccordion', () => ({
  PurposeTemplateSummaryRiskAnalysisAccordion: () => null,
}))

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}))

describe('ConsumerPurposeTemplateSummaryPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('navigates to the purpose template thank you page after publication', async () => {
    const user = userEvent.setup()
    publishDraftMock.mockImplementationOnce(
      (_payload: unknown, { onSuccess }: { onSuccess: () => void }) => onSuccess()
    )
    const { default: ConsumerPurposeTemplateSummaryPage } =
      await import('../ConsumerPurposeTemplateSummary.page')

    render(<ConsumerPurposeTemplateSummaryPage />)
    await user.click(screen.getByRole('button', { name: 'publish' }))

    expect(navigateMock).toHaveBeenCalledWith('SUBSCRIBE_PURPOSE_TEMPLATE_PUBLISH_THANK_YOU', {
      params: { purposeTemplateId: 'purpose-template-id' },
      state: {
        title: 'publishThankYou.title',
        description: 'publishThankYou.description',
        buttonLabel: 'publishThankYou.action',
        closeRouteKey: 'SUBSCRIBE_PURPOSE_TEMPLATE_DETAILS',
        closeRouteParams: { purposeTemplateId: 'purpose-template-id' },
      },
    })
  })
})
