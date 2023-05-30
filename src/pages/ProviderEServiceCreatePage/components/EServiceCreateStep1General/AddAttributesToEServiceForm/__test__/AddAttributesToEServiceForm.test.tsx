import React from 'react'
import { vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import {
  AddAttributesToEServiceForm,
  type AddAttributesToEServiceFormProps,
} from '../AddAttributesToEServiceForm'
import type { RemappedEServiceAttribute } from '@/types/attribute.types'
import { render } from '@testing-library/react'
import { FormProvider, useForm } from 'react-hook-form'
import {
  createMockAttribute,
  createMockRemappedEServiceAttribute,
} from '__mocks__/data/attribute.mocks'
import { AttributeQueries } from '@/api/attribute'
import { Dialog } from '@/components/dialogs'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientMock } from '@/utils/testing.utils'

const attribute = createMockAttribute()

vi.spyOn(AttributeQueries, 'useGetSingle').mockReturnValue(
  attribute as unknown as ReturnType<typeof AttributeQueries.useGetSingle>
)

vi.spyOn(AttributeQueries, 'usePrefetchSingle').mockReturnValue(
  vi.fn() as unknown as ReturnType<typeof AttributeQueries.usePrefetchSingle>
)

type MockContext = {
  attributes: {
    certified: RemappedEServiceAttribute[]
    verified: RemappedEServiceAttribute[]
    declared: RemappedEServiceAttribute[]
  }
}

const getInputWrapper = (
  defaultValues: MockContext = {
    attributes: {
      certified: [createMockRemappedEServiceAttribute()],
      verified: [createMockRemappedEServiceAttribute()],
      declared: [createMockRemappedEServiceAttribute()],
    },
  }
) => {
  const InputWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <QueryClientProvider client={queryClientMock}>
      <Dialog />
      <FormProvider {...useForm<MockContext>({ defaultValues })}>{children}</FormProvider>
    </QueryClientProvider>
  )

  return InputWrapper
}

const renderAddAttributetoEServiceForm = (
  props: AddAttributesToEServiceFormProps,
  defaultValues?: MockContext
) => {
  return render(<AddAttributesToEServiceForm {...props} />, {
    wrapper: getInputWrapper(defaultValues),
  })
}

describe("Checks that AttributeGroup snapshot don't change", () => {
  it('renders correctly with attributeKey certified and readOnly to false', () => {
    const formComponent = renderAddAttributetoEServiceForm({
      attributeKey: 'certified',
      readOnly: false,
    })

    expect(formComponent.baseElement).toMatchSnapshot()
  })

  it('renders correctly with attributeKey verified and readOnly to false', () => {
    const formComponent = renderAddAttributetoEServiceForm({
      attributeKey: 'verified',
      readOnly: false,
    })

    expect(formComponent.baseElement).toMatchSnapshot()
  })

  it('renders correctly with attributeKey declared and readOnly to false', () => {
    const formComponent = renderAddAttributetoEServiceForm({
      attributeKey: 'declared',
      readOnly: false,
    })

    expect(formComponent.baseElement).toMatchSnapshot()
  })

  it('renders correctly with attributeKey certified and readOnly to true', () => {
    const formComponent = renderAddAttributetoEServiceForm({
      attributeKey: 'certified',
      readOnly: true,
    })

    expect(formComponent.baseElement).toMatchSnapshot()
  })

  it('renders correctly with attributeKey verified and readOnly to true', () => {
    const formComponent = renderAddAttributetoEServiceForm({
      attributeKey: 'verified',
      readOnly: true,
    })

    expect(formComponent.baseElement).toMatchSnapshot()
  })

  it('renders correctly with attributeKey declared and readOnly to true', () => {
    const formComponent = renderAddAttributetoEServiceForm({
      attributeKey: 'declared',
      readOnly: true,
    })

    expect(formComponent.baseElement).toMatchSnapshot()
  })
})

describe('check the functionalities', () => {
  it('button create new attribute should not renders with attributeKey cetified', () => {
    const formComponent = renderAddAttributetoEServiceForm({
      attributeKey: 'certified',
      readOnly: true,
    })

    const button = formComponent.queryByRole('button', { name: 'createBtn' })

    expect(button).not.toBeInTheDocument()
  })

  it('create new attribute dialog renders correctly with attributeKey verified and readOnly false', async () => {
    const user = userEvent.setup()
    const formComponent = renderAddAttributetoEServiceForm({
      attributeKey: 'verified',
      readOnly: false,
    })

    const button = formComponent.getByRole('button', { name: 'createBtn' })

    await user.click(button)

    expect(formComponent.getByRole('dialog', { name: 'title type.verified' })).toBeInTheDocument()
  })

  it('create new attribute dialog renders correctly with attributeKey declared and readOnly false', async () => {
    const user = userEvent.setup()
    const formComponent = renderAddAttributetoEServiceForm({
      attributeKey: 'declared',
      readOnly: false,
    })

    const button = formComponent.getByRole('button', { name: 'createBtn' })

    await user.click(button)

    expect(formComponent.getByRole('dialog', { name: 'title type.declared' })).toBeInTheDocument()
  })

  it('should add correctly new attributes group', async () => {
    const user = userEvent.setup()
    const formComponent = renderAddAttributetoEServiceForm({
      attributeKey: 'declared',
      readOnly: false,
    })

    const buttons = formComponent.getAllByRole('button', { name: 'addBtn' })

    expect(formComponent.queryAllByText('title').length).toBe(1)

    await user.click(buttons[1])

    expect(formComponent.queryAllByText('title').length).toBe(2)
  })

  it('should remove correctly an attributes group', async () => {
    const user = userEvent.setup()
    const formComponent = renderAddAttributetoEServiceForm({
      attributeKey: 'declared',
      readOnly: false,
    })

    const buttonDelete = formComponent.getByLabelText('deleteGroupSrLabel')

    expect(formComponent.queryByText('title')).toBeInTheDocument()
    expect(formComponent.queryByText('Attribute Name')).toBeInTheDocument()

    await user.click(buttonDelete)

    expect(formComponent.queryByText('title')).not.toBeInTheDocument()
    expect(formComponent.queryByText('Attribute Name')).not.toBeInTheDocument()
  })

  it('should remove correctly an attribute from a group', async () => {
    const user = userEvent.setup()
    const formComponent = renderAddAttributetoEServiceForm({
      attributeKey: 'declared',
      readOnly: false,
    })

    const buttonsDelete = formComponent.getAllByTestId('DeleteOutlineIcon')

    expect(formComponent.queryByText('title')).toBeInTheDocument()
    expect(formComponent.queryByText('Attribute Name')).toBeInTheDocument()

    await user.click(buttonsDelete[1])

    expect(formComponent.queryByText('title')).toBeInTheDocument()
    expect(formComponent.queryByText('Attribute Name')).not.toBeInTheDocument()
  })
})
