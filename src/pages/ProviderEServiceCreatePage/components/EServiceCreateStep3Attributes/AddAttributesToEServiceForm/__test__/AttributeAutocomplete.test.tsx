import React from 'react'
import { AttributeAutocomplete } from '../AttributeAutocomplete'
import type { AttributeAutocompleteProps } from '../AttributeAutocomplete'
import { vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import type { CompactAttribute, DescriptorAttributes } from '@/api/api.generatedTypes'
import { AttributeQueries } from '@/api/attribute'
import {
  createMockCompactAttribute,
  createMockDescriptorAttribute,
} from '@/../__mocks__/data/attribute.mocks'
import { FormProvider, useForm } from 'react-hook-form'
import { render } from '@testing-library/react'

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
  attributes: DescriptorAttributes
}

const getInputWrapper = (
  defaultValues: MockContext = {
    attributes: {
      certified: [[createMockDescriptorAttribute()]],
      verified: [[createMockDescriptorAttribute()]],
      declared: [[createMockDescriptorAttribute()]],
    },
  }
) => {
  const InputWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <FormProvider {...useForm<MockContext>({ defaultValues })}>{children}</FormProvider>
  )

  return InputWrapper
}

const renderAttributeAutocomplete = (
  props: AttributeAutocompleteProps,
  defaultValues?: MockContext
) => {
  return render(<AttributeAutocomplete {...props} />, {
    wrapper: getInputWrapper(defaultValues),
  })
}

const handleHideAutocompleteFn = vi.fn()

describe("Checks that AttributeAutocomplete snapshot don't change", () => {
  it('renders correctly with attributeKey certified', () => {
    mockGetListSpy([createMockCompactAttribute({ id: 'attribute-option' })])
    const autocomplete = renderAttributeAutocomplete({
      groupIndex: 0,
      attributeKey: 'certified',
      handleHideAutocomplete: handleHideAutocompleteFn,
    })

    expect(autocomplete.baseElement).toMatchSnapshot()
  })

  it('renders correctly with attributeKey verified', () => {
    mockGetListSpy([createMockCompactAttribute({ id: 'attribute-option' })])
    const autocomplete = renderAttributeAutocomplete({
      groupIndex: 0,
      attributeKey: 'verified',
      handleHideAutocomplete: handleHideAutocompleteFn,
    })

    expect(autocomplete.baseElement).toMatchSnapshot()
  })

  it('renders correctly with attributeKey declared', () => {
    mockGetListSpy([createMockCompactAttribute({ id: 'attribute-option' })])
    const autocomplete = renderAttributeAutocomplete({
      groupIndex: 0,
      attributeKey: 'declared',
      handleHideAutocomplete: handleHideAutocompleteFn,
    })

    expect(autocomplete.baseElement).toMatchSnapshot()
  })

  it('renders correctly with an attribute added', async () => {
    const user = userEvent.setup()
    mockGetListSpy([createMockCompactAttribute({ id: 'attribute-option' })])
    const autocomplete = renderAttributeAutocomplete({
      groupIndex: 0,
      attributeKey: 'certified',
      handleHideAutocomplete: handleHideAutocompleteFn,
    })

    const input = autocomplete.getByLabelText('autocompleteInput.label')

    await user.click(input)

    const attributeOption = autocomplete.getByRole('option', { name: 'Attribute Name' })

    await user.click(attributeOption)

    const submitButton = autocomplete.getByRole('button', { name: 'addBtn' })

    await user.click(submitButton)

    expect(handleHideAutocompleteFn).toHaveBeenCalled()
  })

  it('should not show already selected attributes options', async () => {
    const user = userEvent.setup()
    mockGetListSpy([createMockCompactAttribute({ id: 'attribute-option' })])
    const autocomplete = renderAttributeAutocomplete(
      {
        groupIndex: 0,
        attributeKey: 'certified',
        handleHideAutocomplete: handleHideAutocompleteFn,
      },
      {
        attributes: {
          certified: [[createMockDescriptorAttribute({ id: 'attribute-option' })]],
          verified: [],
          declared: [],
        },
      }
    )

    const input = autocomplete.getByLabelText('autocompleteInput.label')

    await user.click(input)

    const attributeOption = autocomplete.queryByRole('option', { name: 'Attribute Name' })

    expect(attributeOption).not.toBeInTheDocument()
  })
})
