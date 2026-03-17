import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import {
  EServiceTemplateCreateStepThresholdsAndAttributes,
  EServiceTemplateCreateStepThresholdsAndAttributesSkeleton,
} from '../EServiceTemplateCreateStepThresholdsAndAttributes'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import {
  createMockEServiceTemplateVersionDetails,
  mockUseEServiceTemplateCreateContext,
} from '@/../__mocks__/data/eserviceTemplate.mocks'

vi.mock('@/components/shared/AddAttributesToForm', () => ({
  AddAttributesToForm: ({ attributeKey }: { attributeKey: string }) => {
    return <div data-testid={`add-attributes-form-${attributeKey}`}>AddAttributesToForm</div>
  },
}))

vi.mock('@/components/shared/CreateAttributeDrawer', () => ({
  CreateAttributeDrawer: () => (
    <div data-testid="create-attribute-drawer">CreateAttributeDrawer</div>
  ),
}))

const updateVersionDraft = vi.fn()

vi.mock('@/api/eserviceTemplate', () => ({
  EServiceTemplateMutations: {
    useUpdateVersionDraft: () => ({ mutate: updateVersionDraft }),
  },
}))

afterEach(() => {
  vi.clearAllMocks()
})

describe('EServiceTemplateCreateStepThresholdsAndAttributes', () => {
  it('should render the thresholds section title', () => {
    mockUseEServiceTemplateCreateContext()
    renderWithApplicationContext(<EServiceTemplateCreateStepThresholdsAndAttributes />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.getByText('step2.thresholdsAndAttributes.thresholdsTitle')).toBeInTheDocument()
  })

  it('should render the access requirements section title', () => {
    mockUseEServiceTemplateCreateContext()
    renderWithApplicationContext(<EServiceTemplateCreateStepThresholdsAndAttributes />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(
      screen.getByText('step2.thresholdsAndAttributes.accessRequirements.title')
    ).toBeInTheDocument()
  })

  it('should render step actions with back and forward buttons', () => {
    mockUseEServiceTemplateCreateContext()
    renderWithApplicationContext(<EServiceTemplateCreateStepThresholdsAndAttributes />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.getByText('backWithoutSaveBtn')).toBeInTheDocument()
    expect(screen.getByText('forwardWithSaveBtn')).toBeInTheDocument()
  })

  it('should render the thresholds switch', () => {
    mockUseEServiceTemplateCreateContext()
    renderWithApplicationContext(<EServiceTemplateCreateStepThresholdsAndAttributes />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(
      screen.getByText('step2.thresholdsAndAttributes.thresholdsSwitch.label')
    ).toBeInTheDocument()
  })

  it('should not show threshold fields when switch is off', () => {
    mockUseEServiceTemplateCreateContext()
    renderWithApplicationContext(<EServiceTemplateCreateStepThresholdsAndAttributes />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(
      screen.queryByLabelText(/step2.thresholdsAndAttributes.dailyCallsPerConsumerField.label/)
    ).not.toBeInTheDocument()
  })

  it('should show threshold fields when version has thresholds data', () => {
    mockUseEServiceTemplateCreateContext({
      eserviceTemplateVersion: createMockEServiceTemplateVersionDetails(),
    })
    renderWithApplicationContext(<EServiceTemplateCreateStepThresholdsAndAttributes />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(
      screen.getByLabelText(/step2.thresholdsAndAttributes.dailyCallsPerConsumerField.label/)
    ).toBeInTheDocument()
    expect(
      screen.getByLabelText(/step2.thresholdsAndAttributes.dailyCallsTotalField.label/)
    ).toBeInTheDocument()
  })

  it('should render attribute tabs (certified, verified, declared)', () => {
    mockUseEServiceTemplateCreateContext()
    renderWithApplicationContext(<EServiceTemplateCreateStepThresholdsAndAttributes />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(
      screen.getByText('step2.thresholdsAndAttributes.accessRequirements.tabs.certified')
    ).toBeInTheDocument()
    expect(
      screen.getByText('step2.thresholdsAndAttributes.accessRequirements.tabs.verified')
    ).toBeInTheDocument()
    expect(
      screen.getByText('step2.thresholdsAndAttributes.accessRequirements.tabs.declared')
    ).toBeInTheDocument()
  })

  it('should call back when back button is clicked', async () => {
    const back = vi.fn()
    mockUseEServiceTemplateCreateContext({ back })
    renderWithApplicationContext(<EServiceTemplateCreateStepThresholdsAndAttributes />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    await userEvent.click(screen.getByText('backWithoutSaveBtn'))
    expect(back).toHaveBeenCalled()
  })

  it('should call forward without API call when form data has not changed', async () => {
    const forward = vi.fn()
    mockUseEServiceTemplateCreateContext({
      forward,
      eserviceTemplateVersion: createMockEServiceTemplateVersionDetails(),
    })
    renderWithApplicationContext(<EServiceTemplateCreateStepThresholdsAndAttributes />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    await userEvent.click(screen.getByText('forwardWithSaveBtn'))
    await waitFor(() => {
      expect(forward).toHaveBeenCalled()
    })
    expect(updateVersionDraft).not.toHaveBeenCalled()
  })

  it('should not call updateVersionDraft when eserviceTemplateVersion is undefined', async () => {
    mockUseEServiceTemplateCreateContext({ eserviceTemplateVersion: undefined })
    renderWithApplicationContext(<EServiceTemplateCreateStepThresholdsAndAttributes />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    await userEvent.click(screen.getByText('forwardWithSaveBtn'))
    await waitFor(() => {
      expect(updateVersionDraft).not.toHaveBeenCalled()
    })
  })

  it('should call updateVersionDraft when threshold values change', async () => {
    mockUseEServiceTemplateCreateContext({
      eserviceTemplateVersion: createMockEServiceTemplateVersionDetails(),
    })
    renderWithApplicationContext(<EServiceTemplateCreateStepThresholdsAndAttributes />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    const dailyCallsTotalInput = screen.getByLabelText(
      /step2.thresholdsAndAttributes.dailyCallsTotalField.label/
    )
    await userEvent.clear(dailyCallsTotalInput)
    await userEvent.type(dailyCallsTotalInput, '99999')

    await userEvent.click(screen.getByText('forwardWithSaveBtn'))

    await waitFor(() => {
      expect(updateVersionDraft).toHaveBeenCalled()
    })
  })
})

describe('EServiceTemplateCreateStepThresholdsAndAttributesSkeleton', () => {
  it('renders the skeleton', () => {
    render(<EServiceTemplateCreateStepThresholdsAndAttributesSkeleton />)
  })
})
