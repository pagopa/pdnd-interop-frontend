import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { useFormContext } from 'react-hook-form'
import { createMemoryHistory } from 'history'
import type { DescriptorAttributes } from '@/api/api.generatedTypes'
import type { AttributeKey } from '@/types/attribute.types'
import { PageContainer } from '@/components/layout/containers'
import { createMockDescriptorAttribute } from '@/../__mocks__/data/attribute.mocks'
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
  AddAttributesToForm: ({ attributeKey }: { attributeKey: AttributeKey }) => {
    const { watch, setValue } = useFormContext<{ attributes: DescriptorAttributes }>()
    const groups = watch(`attributes.${attributeKey}`)

    return (
      <div data-testid={`add-attributes-form-${attributeKey}`}>
        AddAttributesToForm
        {groups.map((group, index) => (
          <button
            key={index}
            type="button"
            onClick={() =>
              setValue(
                `attributes.${attributeKey}`,
                groups.filter((_, groupIndex) => groupIndex !== index),
                { shouldValidate: false }
              )
            }
          >
            Remove {group[0]?.id}
          </button>
        ))}
      </div>
    )
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

const stepProps = { back: vi.fn(), forward: vi.fn(), activeStep: 2 }

afterEach(() => {
  vi.clearAllMocks()
})

describe('EServiceTemplateCreateStepThresholdsAndAttributes', () => {
  it.each<AttributeKey>(['certified', 'verified', 'declared'])(
    'confirms Exit after removing an existing %s requirement without typing and retains edits on cancel',
    async (attributeKey) => {
      const removedAttribute = createMockDescriptorAttribute({ id: 'removed-requirement' })
      const retainedAttribute = createMockDescriptorAttribute({ id: 'retained-requirement' })
      mockUseEServiceTemplateCreateContext({
        eserviceTemplateVersion: createMockEServiceTemplateVersionDetails({
          attributes: { [attributeKey]: [[removedAttribute], [retainedAttribute]] },
        }),
      })
      const { history } = renderWithApplicationContext(
        <PageContainer navigation={{ mode: 'wizard', stepKey: 2, exitAction: { to: 'DEFAULT' } }}>
          <EServiceTemplateCreateStepThresholdsAndAttributes {...stepProps} />
        </PageContainer>,
        { withReactQueryContext: true, withRouterContext: true },
        createMemoryHistory({ initialEntries: [`/test?tab=${attributeKey}`] })
      )
      const initialLocation = history.location

      await userEvent.click(screen.getByRole('button', { name: 'Remove removed-requirement' }))
      await userEvent.click(screen.getByRole('link', { name: 'exitButton' }))

      const dialog = screen.getByRole('dialog', { name: 'exitDialog.title' })
      expect(history.location).toEqual(initialLocation)
      expect(updateVersionDraft).not.toHaveBeenCalled()

      await userEvent.click(within(dialog).getByRole('button', { name: 'exitDialog.cancelButton' }))

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      })
      expect(history.location).toEqual(initialLocation)
      expect(
        screen.queryByRole('button', { name: 'Remove removed-requirement' })
      ).not.toBeInTheDocument()
      expect(
        screen.getByRole('button', { name: 'Remove retained-requirement' })
      ).toBeInTheDocument()

      await userEvent.click(screen.getByRole('link', { name: 'exitButton' }))
      expect(screen.getByRole('dialog', { name: 'exitDialog.title' })).toBeInTheDocument()
    }
  )

  it('exits without confirmation when existing requirements have not changed', async () => {
    mockUseEServiceTemplateCreateContext({
      eserviceTemplateVersion: createMockEServiceTemplateVersionDetails({
        attributes: { certified: [[createMockDescriptorAttribute()]] },
      }),
    })
    const { history } = renderWithApplicationContext(
      <PageContainer navigation={{ mode: 'wizard', stepKey: 2, exitAction: { to: 'DEFAULT' } }}>
        <EServiceTemplateCreateStepThresholdsAndAttributes {...stepProps} />
      </PageContainer>,
      { withReactQueryContext: true, withRouterContext: true }
    )
    const initialLocation = history.location

    await userEvent.click(screen.getByRole('link', { name: 'exitButton' }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(history.location).not.toEqual(initialLocation)
    expect(updateVersionDraft).not.toHaveBeenCalled()
  })

  it('should render the thresholds section title', () => {
    mockUseEServiceTemplateCreateContext()
    renderWithApplicationContext(
      <EServiceTemplateCreateStepThresholdsAndAttributes {...stepProps} />,
      {
        withReactQueryContext: true,
        withRouterContext: true,
      }
    )

    expect(screen.getByText('step2.thresholdsAndAttributes.thresholdsTitle')).toBeInTheDocument()
  })

  it('should render the access requirements section title', () => {
    mockUseEServiceTemplateCreateContext()
    renderWithApplicationContext(
      <EServiceTemplateCreateStepThresholdsAndAttributes {...stepProps} />,
      {
        withReactQueryContext: true,
        withRouterContext: true,
      }
    )

    expect(
      screen.getByText('step2.thresholdsAndAttributes.accessRequirements.title')
    ).toBeInTheDocument()
  })

  it('should render step actions with back and forward buttons', () => {
    mockUseEServiceTemplateCreateContext()
    renderWithApplicationContext(
      <EServiceTemplateCreateStepThresholdsAndAttributes {...stepProps} />,
      {
        withReactQueryContext: true,
        withRouterContext: true,
      }
    )

    expect(screen.getByText('backWithoutSaveBtn')).toBeInTheDocument()
    expect(screen.getByText('forwardWithSaveBtn')).toBeInTheDocument()
  })

  it('should render the thresholds switch', () => {
    mockUseEServiceTemplateCreateContext()
    renderWithApplicationContext(
      <EServiceTemplateCreateStepThresholdsAndAttributes {...stepProps} />,
      {
        withReactQueryContext: true,
        withRouterContext: true,
      }
    )

    expect(
      screen.getByText('step2.thresholdsAndAttributes.thresholdsSwitch.label')
    ).toBeInTheDocument()
  })

  it('should not show threshold fields when switch is off', () => {
    mockUseEServiceTemplateCreateContext()
    renderWithApplicationContext(
      <EServiceTemplateCreateStepThresholdsAndAttributes {...stepProps} />,
      {
        withReactQueryContext: true,
        withRouterContext: true,
      }
    )

    expect(
      screen.queryByLabelText(/step2.thresholdsAndAttributes.dailyCallsPerConsumerField.label/)
    ).not.toBeInTheDocument()
  })

  it('should show threshold fields when version has thresholds data', () => {
    mockUseEServiceTemplateCreateContext({
      eserviceTemplateVersion: createMockEServiceTemplateVersionDetails(),
    })
    renderWithApplicationContext(
      <EServiceTemplateCreateStepThresholdsAndAttributes {...stepProps} />,
      {
        withReactQueryContext: true,
        withRouterContext: true,
      }
    )

    expect(
      screen.getByLabelText(/step2.thresholdsAndAttributes.dailyCallsPerConsumerField.label/)
    ).toBeInTheDocument()
    expect(
      screen.getByLabelText(/step2.thresholdsAndAttributes.dailyCallsTotalField.label/)
    ).toBeInTheDocument()
  })

  it('should render attribute tabs (certified, verified, declared)', () => {
    mockUseEServiceTemplateCreateContext()
    renderWithApplicationContext(
      <EServiceTemplateCreateStepThresholdsAndAttributes {...stepProps} />,
      {
        withReactQueryContext: true,
        withRouterContext: true,
      }
    )

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
    renderWithApplicationContext(
      <EServiceTemplateCreateStepThresholdsAndAttributes {...stepProps} />,
      {
        withReactQueryContext: true,
        withRouterContext: true,
      }
    )

    await userEvent.click(screen.getByText('backWithoutSaveBtn'))
    expect(back).toHaveBeenCalled()
  })

  it('should call forward without API call when form data has not changed', async () => {
    const forward = vi.fn()
    mockUseEServiceTemplateCreateContext({
      forward,
      eserviceTemplateVersion: createMockEServiceTemplateVersionDetails(),
    })
    renderWithApplicationContext(
      <EServiceTemplateCreateStepThresholdsAndAttributes {...stepProps} />,
      {
        withReactQueryContext: true,
        withRouterContext: true,
      }
    )

    await userEvent.click(screen.getByText('forwardWithSaveBtn'))
    await waitFor(() => {
      expect(forward).toHaveBeenCalled()
    })
    expect(updateVersionDraft).not.toHaveBeenCalled()
  })

  it('should not call updateVersionDraft when eserviceTemplateVersion is undefined', async () => {
    mockUseEServiceTemplateCreateContext({ eserviceTemplateVersion: undefined })
    renderWithApplicationContext(
      <EServiceTemplateCreateStepThresholdsAndAttributes {...stepProps} />,
      {
        withReactQueryContext: true,
        withRouterContext: true,
      }
    )

    await userEvent.click(screen.getByText('forwardWithSaveBtn'))
    await waitFor(() => {
      expect(updateVersionDraft).not.toHaveBeenCalled()
    })
  })

  it('should call updateVersionDraft when threshold values change', async () => {
    mockUseEServiceTemplateCreateContext({
      eserviceTemplateVersion: createMockEServiceTemplateVersionDetails(),
    })
    renderWithApplicationContext(
      <EServiceTemplateCreateStepThresholdsAndAttributes {...stepProps} />,
      {
        withReactQueryContext: true,
        withRouterContext: true,
      }
    )

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
