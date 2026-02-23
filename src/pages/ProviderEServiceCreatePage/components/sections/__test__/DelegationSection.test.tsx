import { renderWithApplicationContext } from '@/utils/testing.utils'
import { FormProvider, useForm } from 'react-hook-form'
import { DelegationSection } from '../DelegationSection'
import { screen } from '@testing-library/react'

const renderComponent = () => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    const formMethods = useForm()
    return <FormProvider {...formMethods}>{children}</FormProvider>
  }

  return renderWithApplicationContext(
    <Wrapper>
      <DelegationSection areEServiceGeneralInfoEditable isConsumerDelegable />
    </Wrapper>,
    {
      withReactQueryContext: false,
      withRouterContext: false,
    }
  )
}

describe('DelegationSection', () => {
  it('should render the title', () => {
    renderComponent()
    expect(screen.getByText('title')).toBeInTheDocument()
  })

  it('should render the inner sections titles', () => {
    renderComponent()
    expect(screen.getByText('delegationField.label')).toBeInTheDocument()
    expect(screen.getByText('clientAccessDelegableField.label')).toBeInTheDocument()
  })

  it('should render inner sections input', () => {
    renderComponent()
    expect(screen.getByText('delegationField.switchLabel')).toBeInTheDocument()
    expect(screen.getByText('clientAccessDelegableField.checkboxLabel')).toBeInTheDocument()
  })
})
