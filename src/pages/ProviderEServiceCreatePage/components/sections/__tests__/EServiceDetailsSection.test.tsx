import type { EServiceMode, ProducerEServiceDescriptor } from '@/api/api.generatedTypes'
import { ReactHookFormWrapper, renderWithApplicationContext } from '@/utils/testing.utils'
import { EServiceDetailsSection } from '../EServiceDetailsSection'
import { screen } from '@testing-library/react'
import { createMockEServiceDescriptorProvider } from '@/../__mocks__/data/eservice.mocks'

const descriptor: ProducerEServiceDescriptor = createMockEServiceDescriptorProvider()

const renderComponent = (
  eserviceMode: EServiceMode,
  areEServiceGeneralInfoEditable: boolean = true,
  descriptor?: ProducerEServiceDescriptor
) => {
  return renderWithApplicationContext(
    <ReactHookFormWrapper>
      <EServiceDetailsSection
        areEServiceGeneralInfoEditable={areEServiceGeneralInfoEditable}
        eserviceMode={eserviceMode}
        descriptor={descriptor}
      />
    </ReactHookFormWrapper>,
    {
      withRouterContext: false,
      withReactQueryContext: false,
    }
  )
}

describe('EServiceDetailsSection', () => {
  it('should render the title w/o eserviceTemplate', () => {
    renderComponent('DELIVER')
    expect(screen.getByText('title')).toBeInTheDocument()
  })

  it('should render alert w/o eserviceTemplate', () => {
    renderComponent('DELIVER')
    expect(screen.getByText('firstVersionOnlyEditableInfo')).toBeInTheDocument()
  })

  it('should render input (technology, mode) w/o eserviceTemplate', () => {
    renderComponent('DELIVER')
    expect(screen.getByText('technologyField.label')).toBeInTheDocument()
    expect(screen.getByText('modeField.label')).toBeInTheDocument()
  })

  it('should render the title and readOnlyDescription when not editable', () => {
    renderComponent('DELIVER', false, descriptor)
    expect(screen.getByText('title')).toBeInTheDocument()
    expect(screen.getByText('readOnlyDescription')).toBeInTheDocument()
  })

  it('should render 3 information containers (technology, mode, personalData) when not editable', () => {
    renderComponent('DELIVER', false, descriptor)
    expect(screen.getByText('technologyField.readOnlyLabel')).toBeInTheDocument()
    expect(screen.getByText('modeField.label')).toBeInTheDocument()
    expect(screen.getByText('personalDataField.DELIVER.readOnlyLabel')).toBeInTheDocument()
  })
})
