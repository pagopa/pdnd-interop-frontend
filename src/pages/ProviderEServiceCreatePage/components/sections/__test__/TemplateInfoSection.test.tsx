import { renderWithApplicationContext } from '@/utils/testing.utils'
import { TemplateInfoSection } from '../TemplateInfoSection'
import type { EServiceTemplateDetails } from '@/api/api.generatedTypes'
import { screen } from '@testing-library/react'

const eserviceTemplate: EServiceTemplateDetails = {
  id: 'template-id',
  name: 'template-name',
  description: 'template-description',
  intendedTarget: 'template-intended-target',
  technology: 'REST',
  versions: [],
  riskAnalysis: [],
  mode: 'DELIVER',
  creator: {
    id: 'creator-id',
    name: 'creator-name',
  },
}

const renderComponent = () => {
  return renderWithApplicationContext(
    <TemplateInfoSection eserviceTemplate={eserviceTemplate} />,
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
