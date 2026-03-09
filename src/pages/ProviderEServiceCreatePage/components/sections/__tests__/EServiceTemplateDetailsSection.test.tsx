import type { EServiceTemplateDetails } from '@/api/api.generatedTypes'
import { EServiceTemplateDetailsSection } from '../EServiceTemplateDetailsSection'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import { createMockEServiceTemplateDetails } from '@/../__mocks__/data/eserviceTemplate.mocks'
import { screen } from '@testing-library/react'

const eserviceTemplate: EServiceTemplateDetails = createMockEServiceTemplateDetails()

const renderComponent = (personalData?: boolean) => {
  return renderWithApplicationContext(
    <EServiceTemplateDetailsSection eserviceTemplate={{ ...eserviceTemplate, personalData }} />,
    {}
  )
}

describe('TemplateDetailsSection', () => {
  it('should render the title', () => {
    renderComponent()
    expect(screen.getByText('title')).toBeInTheDocument()
  })

  it('should render 2 info container (technology, mode)', () => {
    renderComponent()
    expect(screen.getByText('technologyField.readOnlyLabel')).toBeInTheDocument()
    expect(screen.getByText(eserviceTemplate.technology)).toBeInTheDocument()
    expect(screen.getByText('modeField.label')).toBeInTheDocument()
    expect(screen.getByText(`modeField.options.${eserviceTemplate.mode}`)).toBeInTheDocument()
  })

  it('should render personalData info container when [personalData] is defined', () => {
    const personalData = true
    renderComponent(personalData)
    expect(
      screen.getByText(`personalDataField.${eserviceTemplate.mode}.readOnlyLabel`)
    ).toBeInTheDocument()
    expect(
      screen.getByText(`personalDataField.${eserviceTemplate.mode}.readOnlyOptions.${personalData}`)
    ).toBeInTheDocument()
  })

  it('should render personalData alert when [personalData] is NOT defined', () => {
    renderComponent()
    expect(screen.getByText('personalDataField.alertMissingPersonalData')).toBeInTheDocument()
  })
})
