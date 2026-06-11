import type { EServiceTemplateDetails } from '@/api/api.generatedTypes'
import { EServiceTemplateDetailsSection } from '../EServiceTemplateDetailsSection'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import {
  createMockEServiceTemplateDetails,
  createMockEServiceTemplateDetailsAsync,
} from '@/../__mocks__/data/eserviceTemplate.mocks'
import { screen } from '@testing-library/react'

const eserviceTemplate: EServiceTemplateDetails = createMockEServiceTemplateDetails()

const renderComponent = (overwrites: Partial<EServiceTemplateDetails> = {}) => {
  return renderWithApplicationContext(
    <EServiceTemplateDetailsSection eserviceTemplate={{ ...eserviceTemplate, ...overwrites }} />,
    {}
  )
}

describe('TemplateDetailsSection', () => {
  it('should render the title', () => {
    renderComponent()
    expect(screen.getByText('title')).toBeInTheDocument()
  })

  it('should render 3 info container (asyncExchange, technology, mode)', () => {
    renderComponent()
    expect(screen.getByText('asyncExchangeField.readOnlyLabel')).toBeInTheDocument()
    expect(screen.getByText('asyncExchangeField.readOnlyOptions.false')).toBeInTheDocument()
    expect(screen.getByText('technologyField.readOnlyLabel')).toBeInTheDocument()
    expect(screen.getByText(eserviceTemplate.technology)).toBeInTheDocument()
    expect(screen.getByText('modeField.label')).toBeInTheDocument()
    expect(screen.getByText(`modeField.options.${eserviceTemplate.mode}`)).toBeInTheDocument()
  })

  it('should render async data exchange type', () => {
    renderComponent(createMockEServiceTemplateDetailsAsync())

    expect(screen.getByText('asyncExchangeField.readOnlyLabel')).toBeInTheDocument()
    expect(screen.getByText('asyncExchangeField.readOnlyOptions.true')).toBeInTheDocument()
  })

  it('should render sync data exchange type when asyncExchange is missing', () => {
    const eserviceTemplateWithoutAsyncExchange = createMockEServiceTemplateDetails()
    delete eserviceTemplateWithoutAsyncExchange.asyncExchange

    renderComponent(eserviceTemplateWithoutAsyncExchange)

    expect(screen.getByText('asyncExchangeField.readOnlyLabel')).toBeInTheDocument()
    expect(screen.getByText('asyncExchangeField.readOnlyOptions.false')).toBeInTheDocument()
  })

  it('should render personalData info container when [personalData] is defined', () => {
    const personalData = true
    renderComponent({ personalData })
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
