import { ReactHookFormWrapper, renderWithApplicationContext } from '@/utils/testing.utils'
import { DelegationSection } from '../DelegationSection'
import { screen } from '@testing-library/react'

const renderComponent = () => {
  return renderWithApplicationContext(
    <ReactHookFormWrapper>
      <DelegationSection areEServiceGeneralInfoEditable isConsumerDelegable />
    </ReactHookFormWrapper>,
    {
      withReactQueryContext: false,
      withRouterContext: false,
    }
  )
}

describe('DelegationSection', () => {
  it('should render the title', () => {
    renderComponent()
    expect(screen.getByText('title')).toBeInTheDocument()
  })

  it('should render the inner sections titles', () => {
    renderComponent()
    expect(screen.getByText('delegationField.label')).toBeInTheDocument()
    expect(screen.getByText('clientAccessDelegableField.label')).toBeInTheDocument()
  })

  it('should render inner sections input', () => {
    renderComponent()
    expect(screen.getByText('delegationField.switchLabel')).toBeInTheDocument()
    expect(screen.getByText('clientAccessDelegableField.checkboxLabel')).toBeInTheDocument()
  })
})
