import { renderWithApplicationContext } from '@/utils/testing.utils'
import React from 'react'
import { vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import {
  AddAttributesToEServiceForm,
  AddAttributesToEServiceFormProps,
} from '../AddAttributesToEServiceForm'
import type { FrontendAttribute } from '@/types/attribute.types'
import { render, screen } from '@testing-library/react'
import { FormProvider, useForm } from 'react-hook-form'
import { createMockAttribute, createMockFrontendAttribute } from '__mocks__/data/attribute.mocks'
import { AttributeQueries } from '@/api/attribute'
import { Attribute, CompactAttribute } from '@/api/api.generatedTypes'

// vi.mock('react-hook-form', async () => ({
//   ...(await vi.importActual('react-hook-form')),
//   useFormContext: () => ({
//     watch: (value: string) => [
//       {
//         attributes: [
//           {
//             id: 'test-id',
//             name: 'test-id-name',
//           },
//         ],
//         explicitAttributeVerification: false,
//       },
//     ],
//     setValue: (value: string, group: Array<FrontendAttribute>) => undefined,
//     formState: {
//       errors: {},
//     },
//   }),
// }))

const mockGetSingleSpy = (attribute: Attribute) => {
  vi.spyOn(AttributeQueries, 'useGetSingle').mockReturnValue(
    attribute as unknown as ReturnType<typeof AttributeQueries.useGetSingle>
  )
}

const mockPrefetchSingleSpy = (attribute: Attribute) => {
  const prefetch = (attributeId: string) => mockGetSingleSpy(attribute)
  vi.spyOn(AttributeQueries, 'usePrefetchSingle').mockReturnValue(
    prefetch as unknown as ReturnType<typeof AttributeQueries.usePrefetchSingle>
  )
}

const mockGetListSpy = (attributes: Array<CompactAttribute> = [], isLoading = false) => {
  vi.spyOn(AttributeQueries, 'useGetList').mockReturnValue({
    data: {
      results: attributes,
      pagination: {
        limit: 50,
        offset: 0,
        totalCount: attributes.length,
      },
    },
    isLoading,
  } as unknown as ReturnType<typeof AttributeQueries.useGetList>)
}

type MockContext = {
  attributes: {
    certified: FrontendAttribute[]
    verified: FrontendAttribute[]
    declared: FrontendAttribute[]
  }
}

const getInputWrapper = (
  defaultValues: MockContext = {
    attributes: {
      certified: [createMockFrontendAttribute()],
      verified: [createMockFrontendAttribute()],
      declared: [createMockFrontendAttribute()],
    },
  }
) => {
  const InputWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <FormProvider {...useForm<MockContext>({ defaultValues })}>{children}</FormProvider>
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
    const attribute = createMockAttribute()
    mockPrefetchSingleSpy(attribute)
    const formComponent = renderAddAttributetoEServiceForm({
      attributeKey: 'certified',
      readOnly: false,
    })

    expect(formComponent.baseElement).toMatchSnapshot()
  })

  it('renders correctly with attributeKey verified and readOnly to false', () => {
    const attribute = createMockAttribute()
    mockPrefetchSingleSpy(attribute)
    const formComponent = renderAddAttributetoEServiceForm({
      attributeKey: 'verified',
      readOnly: false,
    })

    expect(formComponent.baseElement).toMatchSnapshot()
  })

  it('renders correctly with attributeKey declared and readOnly to false', () => {
    const attribute = createMockAttribute()
    mockPrefetchSingleSpy(attribute)
    const formComponent = renderAddAttributetoEServiceForm({
      attributeKey: 'declared',
      readOnly: false,
    })

    expect(formComponent.baseElement).toMatchSnapshot()
  })

  it('renders correctly with attributeKey certified and readOnly to true', () => {
    const attribute = createMockAttribute()
    mockPrefetchSingleSpy(attribute)
    const formComponent = renderAddAttributetoEServiceForm({
      attributeKey: 'certified',
      readOnly: true,
    })

    expect(formComponent.baseElement).toMatchSnapshot()
  })

  it('renders correctly with attributeKey verified and readOnly to true', () => {
    const attribute = createMockAttribute()
    mockPrefetchSingleSpy(attribute)
    const formComponent = renderAddAttributetoEServiceForm({
      attributeKey: 'verified',
      readOnly: true,
    })

    expect(formComponent.baseElement).toMatchSnapshot()
  })

  it('renders correctly with attributeKey declared and readOnly to true', () => {
    const attribute = createMockAttribute()
    mockPrefetchSingleSpy(attribute)
    const formComponent = renderAddAttributetoEServiceForm({
      attributeKey: 'declared',
      readOnly: true,
    })

    expect(formComponent.baseElement).toMatchSnapshot()
  })
})

describe('check the functionalities', () => {
  it('button create new attribute not renders with attributeKey cetified', () => {
    const attribute = createMockAttribute()
    mockPrefetchSingleSpy(attribute)
    const formComponent = renderAddAttributetoEServiceForm({
      attributeKey: 'certified',
      readOnly: true,
    })

    const button = formComponent.queryByRole('button', { name: 'createBtn' })

    expect(button).not.toBeInTheDocument()
  })

  it('create new attribute dialog renders correctly with attributeKey verified and readOnly false', async () => {
    const user = userEvent.setup()
    const attribute = createMockAttribute()
    mockPrefetchSingleSpy(attribute)
    const formComponent = renderAddAttributetoEServiceForm({
      attributeKey: 'verified',
      readOnly: false,
    })

    const button = formComponent.getByRole('button', { name: 'createBtn' })

    expect(button).toBeInTheDocument()

    // await user.click(button)

    // expect(screen.getByRole('dialog', { name: 'title type.verified' })).toBeInTheDocument()
  })

  it('create new attribute dialog renders correctly with attributeKey declared and readOnly false', async () => {
    const user = userEvent.setup()
    const attribute = createMockAttribute()
    mockPrefetchSingleSpy(attribute)
    const formComponent = renderAddAttributetoEServiceForm({
      attributeKey: 'declared',
      readOnly: false,
    })

    const button = formComponent.getByRole('button', { name: 'createBtn' })

    expect(button).toBeInTheDocument()

    // await user.click(button)

    // expect(screen.getByRole('dialog', { name: 'title type.declared' })).toBeInTheDocument()
  })

  it('renders correctly after adding new attributes group', async () => {
    const user = userEvent.setup()
    const attribute = createMockAttribute()
    mockPrefetchSingleSpy(attribute)
    const formComponent = renderAddAttributetoEServiceForm({
      attributeKey: 'declared',
      readOnly: false,
    })

    const buttons = formComponent.getAllByRole('button', { name: 'addBtn' })

    formComponent.debug()

    // await user.click(buttons[1])

    // expect(formComponent.baseElement).toMatchSnapshot()
  })
})
