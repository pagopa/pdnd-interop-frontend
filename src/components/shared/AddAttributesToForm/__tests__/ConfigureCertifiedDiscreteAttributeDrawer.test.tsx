import userEvent from '@testing-library/user-event'
import { createMockDescriptorAttribute } from '../../../../../__mocks__/data/attribute.mocks'
import {
  ConfigureCertifiedDiscreteAttributeDrawer,
  useConfigureCertifiedDiscreteAttributeDrawer,
} from '../ConfigureCertifiedDiscreteAttributeDrawer'
import { renderWithApplicationContext } from '@/utils/testing.utils'

const mockAttribute = createMockDescriptorAttribute({
  id: 'attr-1',
  name: 'Test Attribute',
  kind: 'CERTIFIED_DISCRETE',
})

afterEach(() => {
  useConfigureCertifiedDiscreteAttributeDrawer.setState({
    isOpen: false,
    attribute: undefined,
  })
})

const renderComponent = (
  props: Partial<React.ComponentProps<typeof ConfigureCertifiedDiscreteAttributeDrawer>> = {}
) => {
  const defaultProps: React.ComponentProps<typeof ConfigureCertifiedDiscreteAttributeDrawer> = {
    onSubmit: vi.fn(),
    submitButtonLabel: 'submitBtnLabel',
    ...props,
  }

  return renderWithApplicationContext(
    <ConfigureCertifiedDiscreteAttributeDrawer {...defaultProps} />,
    {
      withReactQueryContext: true,
    }
  )
}

describe('ConfigureCertifiedDiscreteAttributeDrawer', () => {
  it('should not render the drawer when isOpen is false', () => {
    const screen = renderComponent()
    expect(screen.queryByText('title')).not.toBeInTheDocument()
  })

  it('should render the drawer with title when isOpen is true', () => {
    useConfigureCertifiedDiscreteAttributeDrawer.setState({
      isOpen: true,
      attribute: mockAttribute,
    })
    const screen = renderComponent()
    expect(screen.getByText('title')).toBeInTheDocument()
  })

  it('should show the comparator and threshold field with the attribute values', () => {
    const mockedAttribute = createMockDescriptorAttribute({
      id: 'attr-1',
      name: 'Test Attribute',
      kind: 'CERTIFIED_DISCRETE',
      discreteConfig: { comparator: 'GT', threshold: 1000 },
    })

    useConfigureCertifiedDiscreteAttributeDrawer.setState({
      isOpen: true,
      attribute: mockedAttribute,
    })
    const screen = renderComponent()
    expect(screen.getByDisplayValue(mockedAttribute.discreteConfig!.comparator)).toBeInTheDocument()
    expect(screen.getByDisplayValue(mockedAttribute.discreteConfig!.threshold)).toBeInTheDocument()
  })

  it('should call onSubmit with the comparator and threshold values on submit', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    useConfigureCertifiedDiscreteAttributeDrawer.setState({
      isOpen: true,
      attribute: mockAttribute,
    })
    const screen = renderComponent({ onSubmit })

    const comparatorInput = screen.getByRole('combobox', { name: 'comparatorLabel' })
    await userEvent.click(comparatorInput)
    const optionToSelect = await screen.findByRole('option', { name: 'LT' })
    await userEvent.click(optionToSelect)

    const thresholdInput = screen.getByRole('spinbutton', { name: 'thresholdLabel' })
    await user.clear(thresholdInput)
    await user.type(thresholdInput, '1000')

    const submitBtn = screen.getByText('submitBtnLabel')
    await user.click(submitBtn)

    expect(onSubmit).toHaveBeenCalledWith('LT', 1000)
  })
})
