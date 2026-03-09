import { ReactHookFormWrapper, renderWithApplicationContext } from '@/utils/testing.utils'
import { EServiceInfoSection } from '../EServiceInfoSection'
import { screen } from '@testing-library/react'
import type { ProducerEServiceDescriptor } from '@/api/api.generatedTypes'
import { createMockEServiceDescriptorProvider } from '@/../__mocks__/data/eservice.mocks'

const descriptor: ProducerEServiceDescriptor = createMockEServiceDescriptorProvider()

const renderComponent = (areEServiceGeneralInfoEditable: boolean = true) => {
  return renderWithApplicationContext(
    <ReactHookFormWrapper>
      <EServiceInfoSection
        areEServiceGeneralInfoEditable={areEServiceGeneralInfoEditable}
        descriptor={descriptor}
      />
    </ReactHookFormWrapper>,
    {
      withReactQueryContext: false,
      withRouterContext: false,
    }
  )
}

describe('EServiceInfoSection', () => {
  it('should render the title and description when info are editable', () => {
    renderComponent()
    expect(screen.getByText('title')).toBeInTheDocument()
  })

  it('should render 2 inputs (name and description) when info are editable', () => {
    renderComponent()
    expect(screen.getByText('nameField.label')).toBeInTheDocument()
    expect(screen.getByText('descriptionField.label')).toBeInTheDocument()
  })

  it('should render readOnlyDescription  when info are not editable', () => {
    renderComponent(false)
    expect(screen.getByText('readOnlyDescription')).toBeInTheDocument()
  })

  it('should render two information container (name, description) when info are not editable', () => {
    renderComponent(false)
    expect(screen.getByText('nameField.label')).toBeInTheDocument()
    expect(screen.getByText('descriptionField.label')).toBeInTheDocument()
  })
})
