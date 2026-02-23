import React from 'react'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import { EServiceInfoSection } from '../EServiceInfoSection'
import { screen } from '@testing-library/react'
import { FormProvider, useForm } from 'react-hook-form'

const renderComponent = () => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    const formMethods = useForm()
    return <FormProvider {...formMethods}>{children}</FormProvider>
  }

  return renderWithApplicationContext(
    <Wrapper>
      <EServiceInfoSection />
    </Wrapper>,
    {
      withReactQueryContext: false,
      withRouterContext: false,
    }
  )
}

describe('EServiceInfoSection', () => {
  it('should render the title', () => {
    renderComponent()
    expect(screen.getByText('title')).toBeInTheDocument()
  })

  it('should render 2 inputs (name and description)', () => {
    renderComponent()
    expect(screen.getByText('nameField.label')).toBeInTheDocument()
    expect(screen.getByText('descriptionField.label')).toBeInTheDocument()
  })
})
