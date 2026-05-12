import type { EServiceMode, ProducerEServiceDescriptor } from '@/api/api.generatedTypes'
import {
  mockUseJwt,
  ReactHookFormWrapper,
  renderWithApplicationContext,
} from '@/utils/testing.utils'
import { EServiceDetailsSection } from '../EServiceDetailsSection'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMockEServiceDescriptorProvider } from '@/../__mocks__/data/eservice.mocks'

const descriptor: ProducerEServiceDescriptor = createMockEServiceDescriptorProvider()

const renderComponent = (
  eserviceMode: EServiceMode,
  areEServiceGeneralInfoEditable: boolean = true,
  descriptor?: ProducerEServiceDescriptor,
  defaultValues: Record<string, unknown> = {}
) => {
  return renderWithApplicationContext(
    <ReactHookFormWrapper
      defaultValues={{
        technology: 'REST',
        mode: eserviceMode,
        asyncExchange: false,
        personalData: undefined,
        ...defaultValues,
      }}
    >
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
  beforeEach(() => {
    mockUseJwt()
  })

  it('should render the title w/o eserviceTemplate', () => {
    renderComponent('DELIVER')
    expect(screen.getByText('title')).toBeInTheDocument()
  })

  it('should render alert w/o eserviceTemplate', () => {
    renderComponent('DELIVER')
    expect(screen.getByText('firstVersionOnlyEditableInfo')).toBeInTheDocument()
  })

  it('should render input (asyncExchange, technology, mode) w/o eserviceTemplate', () => {
    renderComponent('DELIVER')
    expect(screen.getByText('asyncExchangeField.label')).toBeInTheDocument()
    expect(screen.getByText('technologyField.label')).toBeInTheDocument()
    expect(screen.getByText('modeField.label')).toBeInTheDocument()
  })

  it('should render the title and readOnlyDescription when not editable', () => {
    renderComponent('DELIVER', false, descriptor)
    expect(screen.getByText('title')).toBeInTheDocument()
    expect(screen.getByText('readOnlyDescription')).toBeInTheDocument()
  })

  it('should render 4 information containers (asyncExchange, technology, mode, personalData) when not editable', () => {
    renderComponent('DELIVER', false, descriptor)
    expect(screen.getByText('asyncExchangeField.readOnlyLabel')).toBeInTheDocument()
    expect(screen.getByText('technologyField.readOnlyLabel')).toBeInTheDocument()
    expect(screen.getByText('modeField.label')).toBeInTheDocument()
    expect(screen.getByText('personalDataField.DELIVER.readOnlyLabel')).toBeInTheDocument()
  })

  it('should disable mode radios and force DELIVER when asyncExchange is selected', async () => {
    const user = userEvent.setup()
    renderComponent('RECEIVE', true, undefined, { mode: 'RECEIVE' })

    const asyncOption = screen.getByRole('radio', { name: 'asyncExchangeField.options.true' })
    await user.click(asyncOption)

    const deliverRadio = screen.getByRole('radio', { name: 'modeField.options.DELIVER' })
    const receiveRadio = screen.getByRole('radio', { name: 'modeField.options.RECEIVE' })

    expect(deliverRadio).toBeDisabled()
    expect(receiveRadio).toBeDisabled()
    expect(deliverRadio).toBeChecked()
  })

  it('should show SOAP warning when asyncExchange is true and technology is SOAP', () => {
    renderComponent('DELIVER', true, undefined, {
      asyncExchange: true,
      technology: 'SOAP',
    })
    expect(screen.getByText('asyncExchangeField.soapWarning')).toBeInTheDocument()
  })

  it('should not show SOAP warning when asyncExchange is true and technology is REST', () => {
    renderComponent('DELIVER', true, undefined, {
      asyncExchange: true,
      technology: 'REST',
    })
    expect(screen.queryByText('asyncExchangeField.soapWarning')).not.toBeInTheDocument()
  })

  it('should not show SOAP warning when asyncExchange is false', () => {
    renderComponent('DELIVER', true, undefined, {
      asyncExchange: false,
      technology: 'SOAP',
    })
    expect(screen.queryByText('asyncExchangeField.soapWarning')).not.toBeInTheDocument()
  })

  it('should show operator API warning only when asyncExchange is true and user is operator API', () => {
    mockUseJwt({ isOperatorAPI: true, isAdmin: false, currentRoles: ['api'] })
    renderComponent('DELIVER', true, undefined, { asyncExchange: true })
    expect(screen.getByText('asyncExchangeField.operatorApiWarning')).toBeInTheDocument()
  })

  it('should not show operator API warning when user is not operator API', () => {
    mockUseJwt({ isOperatorAPI: false })
    renderComponent('DELIVER', true, undefined, { asyncExchange: true })
    expect(screen.queryByText('asyncExchangeField.operatorApiWarning')).not.toBeInTheDocument()
  })

  it('should not show operator API warning when asyncExchange is false', () => {
    mockUseJwt({ isOperatorAPI: true, isAdmin: false, currentRoles: ['api'] })
    renderComponent('DELIVER', true, undefined, { asyncExchange: false })
    expect(screen.queryByText('asyncExchangeField.operatorApiWarning')).not.toBeInTheDocument()
  })
})
