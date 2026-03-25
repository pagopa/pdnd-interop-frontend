import { ReactHookFormWrapper, renderWithApplicationContext } from '@/utils/testing.utils'
import { EServiceInterfaceSection } from '../EServiceInterfaceSection'
import { screen } from '@testing-library/react'

vi.mock('../../components/UploadInterfaceDoc', () => ({
  UploadInterfaceDoc: () => {
    return <div>UploadInterfaceDoc</div>
  },
}))

vi.mock('../../components/GenerateInterfaceForm', () => ({
  GenerateInterfaceForm: () => {
    return <div>GenerateInterfaceForm</div>
  },
}))

const renderComponent = (isEServiceCreatedFromTemplate: boolean) => {
  return renderWithApplicationContext(
    <ReactHookFormWrapper>
      <EServiceInterfaceSection
        isEServiceCreatedFromTemplate={isEServiceCreatedFromTemplate}
        description={'section-description'}
      />
    </ReactHookFormWrapper>,
    {
      withReactQueryContext: true,
      withRouterContext: true,
    }
  )
}

describe('EServiceInterfaceSection', () => {
  it('should render the title', () => {
    renderComponent(false)
    expect(screen.getByText('title')).toBeInTheDocument()
  })

  it('should render the UploadInterfaceDoc component', () => {
    renderComponent(false)
    expect(screen.getByText('UploadInterfaceDoc')).toBeInTheDocument()
  })

  it('should render the GenerateInterfaceForm component', () => {
    renderComponent(true)
    expect(screen.getByText('GenerateInterfaceForm')).toBeInTheDocument()
  })
})
