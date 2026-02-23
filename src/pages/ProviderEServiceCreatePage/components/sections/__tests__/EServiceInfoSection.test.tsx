import { ReactHookFormWrapper, renderWithApplicationContext } from '@/utils/testing.utils'
import { EServiceInfoSection } from '../EServiceInfoSection'
import { screen } from '@testing-library/react'

const renderComponent = () => {
  return renderWithApplicationContext(
    <ReactHookFormWrapper>
      <EServiceInfoSection />
    </ReactHookFormWrapper>,
    {
      withReactQueryContext: false,
      withRouterContext: false,
    }
  )
}

describe('EServiceInfoSection', () => {
  it('should render the title', () => {
    renderComponent()
    expect(screen.getByText('title')).toBeInTheDocument()
  })

  it('should render 2 inputs (name and description)', () => {
    renderComponent()
    expect(screen.getByText('nameField.label')).toBeInTheDocument()
    expect(screen.getByText('descriptionField.label')).toBeInTheDocument()
  })
})
