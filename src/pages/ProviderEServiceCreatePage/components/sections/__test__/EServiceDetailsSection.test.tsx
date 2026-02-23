import type { EServiceMode, EServiceTemplateDetails } from '@/api/api.generatedTypes'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { EServiceDetailsSection } from '../EServiceDetailsSection'
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

const renderComponent = (
  eserviceMode: EServiceMode,
  eserviceTemplate?: EServiceTemplateDetails
) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    const formMethods = useForm()
    return <FormProvider {...formMethods}>{children}</FormProvider>
  }
  return renderWithApplicationContext(
    <Wrapper>
      <EServiceDetailsSection
        areEServiceGeneralInfoEditable={true}
        eserviceMode={eserviceMode}
        eserviceTemplate={eserviceTemplate}
      />
    </Wrapper>,
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

  it('should render the title with eserviceTemplate', () => {
    renderComponent('DELIVER', eserviceTemplate)
    expect(screen.getByText('title')).toBeInTheDocument()
  })

  it('should render 3 information containers (technology, mode, personalData) with eserviceTemplate', () => {
    renderComponent('DELIVER', { ...eserviceTemplate, personalData: true })
    expect(screen.getByText('technologyField.readOnlyLabel')).toBeInTheDocument()
    expect(screen.getByText('modeField.label')).toBeInTheDocument()
    expect(screen.getByText('personalDataField.DELIVER.readOnlyLabel')).toBeInTheDocument()
  })

  it('should render personalData alert', () => {
    renderComponent('DELIVER', eserviceTemplate)
    expect(screen.getByText('personalDataField.alertMissingPersonalData')).toBeInTheDocument()
  })
})
