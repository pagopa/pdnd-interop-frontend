import { renderWithApplicationContext } from '@/utils/testing.utils'
import { EServiceTemplateInfoSection } from '../EServiceTemplateInfoSection'
import type { EServiceTemplateDetails } from '@/api/api.generatedTypes'
import { screen } from '@testing-library/react'
import { createMockEServiceTemplateDetails } from '@/../__mocks__/data/eserviceTemplate.mocks'

const eserviceTemplate: EServiceTemplateDetails = createMockEServiceTemplateDetails()

const renderComponent = () => {
  return renderWithApplicationContext(
    <EServiceTemplateInfoSection eserviceTemplate={eserviceTemplate} />,
    {}
  )
}

describe('TemplateInfoSection', () => {
  it('should render the title', () => {
    renderComponent()
    expect(screen.getByText('title')).toBeInTheDocument()
  })

  it('should render 3 info container (name, intendedTarget, description)', () => {
    renderComponent()
    expect(screen.getByText('nameLabel')).toBeInTheDocument()
    expect(screen.getByText(eserviceTemplate.name)).toBeInTheDocument()
    expect(screen.getByText('addressedToLabel')).toBeInTheDocument()
    expect(screen.getByText(eserviceTemplate.intendedTarget)).toBeInTheDocument()
    expect(screen.getByText('allowWhatLabel')).toBeInTheDocument()
    expect(screen.getByText(eserviceTemplate.description)).toBeInTheDocument()
  })
})
