import type { EServiceDetails } from '../EServiceDetailsSectionBase'
import { EServiceDetailsSectionBase } from '../EServiceDetailsSectionBase'
import { ReactHookFormWrapper, renderWithApplicationContext } from '@/utils/testing.utils'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

const details: EServiceDetails = {
  asyncExchange: true,
  technology: 'REST',
  mode: 'RECEIVE',
  personalData: false,
}

const renderReadOnlyComponent = ({
  details = {
    asyncExchange: true,
    technology: 'REST',
    mode: 'RECEIVE',
    personalData: false,
  },
  missingPersonalDataTenantName,
}: {
  details?: EServiceDetails
  missingPersonalDataTenantName?: string
} = {}) => {
  return renderWithApplicationContext(
    <EServiceDetailsSectionBase
      isEditable={false}
      eserviceMode="RECEIVE"
      details={details}
      description="description"
      missingPersonalDataTenantName={missingPersonalDataTenantName}
    />,
    {
      withRouterContext: false,
      withReactQueryContext: false,
    }
  )
}

const renderEditableComponent = ({
  defaultValues = {},
  showFirstVersionOnlyEditableInfo = false,
  showOperatorApiWarning = false,
  onEserviceModeChange,
}: {
  defaultValues?: Record<string, unknown>
  showFirstVersionOnlyEditableInfo?: boolean
  showOperatorApiWarning?: boolean
  onEserviceModeChange?: (mode: 'DELIVER' | 'RECEIVE') => void
} = {}) => {
  return renderWithApplicationContext(
    <ReactHookFormWrapper
      defaultValues={{
        asyncExchange: false,
        technology: 'REST',
        mode: 'RECEIVE',
        personalData: undefined,
        ...defaultValues,
      }}
    >
      <EServiceDetailsSectionBase
        isEditable
        eserviceMode="RECEIVE"
        showFirstVersionOnlyEditableInfo={showFirstVersionOnlyEditableInfo}
        showOperatorApiWarning={showOperatorApiWarning}
        onEserviceModeChange={onEserviceModeChange}
      />
    </ReactHookFormWrapper>,
    {
      withRouterContext: false,
      withReactQueryContext: false,
    }
  )
}

describe('EServiceDetailsSectionBase', () => {
  it('renders read-only details', () => {
    renderReadOnlyComponent()

    expect(screen.getByText('title')).toBeInTheDocument()
    expect(screen.getByText('description')).toBeInTheDocument()
    expect(screen.getByText('asyncExchangeField.readOnlyLabel')).toBeInTheDocument()
    expect(screen.getByText('asyncExchangeField.readOnlyOptions.true')).toBeInTheDocument()
    expect(screen.getByText('technologyField.readOnlyLabel')).toBeInTheDocument()
    expect(screen.getByText(details.technology)).toBeInTheDocument()
    expect(screen.getByText('modeField.label')).toBeInTheDocument()
    expect(screen.getByText('modeField.options.RECEIVE')).toBeInTheDocument()
    expect(screen.getByText('personalDataField.RECEIVE.readOnlyLabel')).toBeInTheDocument()
    expect(screen.getByText('personalDataField.RECEIVE.readOnlyOptions.false')).toBeInTheDocument()
  })

  it('renders the missing personal data alert when tenant name is provided', () => {
    renderReadOnlyComponent({
      details: {
        asyncExchange: false,
        technology: 'SOAP',
        mode: 'DELIVER',
        personalData: undefined,
      },
      missingPersonalDataTenantName: 'Tenant Name',
    })

    expect(screen.getByText('personalDataField.alertMissingPersonalData')).toBeInTheDocument()
  })

  it('renders editable fields and the optional first-version-only alert', () => {
    renderEditableComponent({ showFirstVersionOnlyEditableInfo: true })

    expect(screen.getByText('firstVersionOnlyEditableInfo')).toBeInTheDocument()
    expect(screen.getByText('asyncExchangeField.label')).toBeInTheDocument()
    expect(screen.getByLabelText('asyncExchangeField.options.false')).toBeInTheDocument()
    expect(screen.getByLabelText('asyncExchangeField.options.true')).toBeInTheDocument()
    expect(screen.getByText('technologyField.label')).toBeInTheDocument()
    expect(screen.getByLabelText('REST')).toBeInTheDocument()
    expect(screen.getByLabelText('SOAP')).toBeInTheDocument()
    expect(screen.getByText('modeField.label')).toBeInTheDocument()
    expect(screen.getByLabelText('modeField.options.DELIVER')).toBeInTheDocument()
    expect(screen.getByLabelText('modeField.options.RECEIVE')).toBeInTheDocument()
    expect(screen.getByText('personalDataField.RECEIVE.label')).toBeInTheDocument()
  })

  it('forces DELIVER mode and disables mode options when async exchange is selected', async () => {
    const user = userEvent.setup()
    const onEserviceModeChange = vi.fn()
    renderEditableComponent({ onEserviceModeChange })

    await user.click(screen.getByLabelText('asyncExchangeField.options.true'))

    const deliverRadio = screen.getByRole('radio', { name: 'modeField.options.DELIVER' })
    const receiveRadio = screen.getByRole('radio', { name: 'modeField.options.RECEIVE' })

    expect(deliverRadio).toBeChecked()
    expect(deliverRadio).toBeDisabled()
    expect(receiveRadio).toBeDisabled()
    expect(onEserviceModeChange).toHaveBeenCalledWith('DELIVER')
  })

  it('renders async exchange warnings when enabled', () => {
    renderEditableComponent({
      defaultValues: { asyncExchange: true, technology: 'SOAP' },
      showOperatorApiWarning: true,
    })

    expect(screen.getByText('asyncExchangeField.soapWarning')).toBeInTheDocument()
    expect(screen.getByText('asyncExchangeField.operatorApiWarning')).toBeInTheDocument()
  })
})
