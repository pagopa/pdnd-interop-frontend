import React from 'react'
import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FormProvider, useForm } from 'react-hook-form'
import { describe, expect, it, vi } from 'vitest'
import type { CompactTenant } from '@/api/api.generatedTypes'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import { RHFTenantAutoCompleteMultipleField } from '..'

type FormValues = {
  tenantIds: string[]
}

const tenants: CompactTenant[] = [
  {
    id: 'direzione-mobilita-id',
    name: 'Direzione Mobilità',
    logoUrl: 'https://example.test/milano.png',
    subUnitType: 'AOO',
    parentTenants: [{ id: 'comune-milano-id', name: 'Comune di Milano' }],
  },
  {
    id: 'ufficio-permessi-id',
    name: 'Ufficio permessi ZTL',
    subUnitType: 'UO',
    parentTenants: [
      {
        id: 'direzione-mobilita-id',
        name: 'Direzione Mobilità',
        subUnitType: 'AOO',
      },
      { id: 'comune-milano-id', name: 'Comune di Milano' },
    ],
  },
  {
    id: 'pagopa-id',
    name: 'PagoPA S.p.A.',
  },
]

function TestForm({
  children,
  defaultValues = { tenantIds: [] },
  onSubmit = vi.fn(),
}: {
  children: React.ReactNode
  defaultValues?: FormValues
  onSubmit?: (values: FormValues) => void
}) {
  const form = useForm<FormValues>({ defaultValues })

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {children}
        <button type="submit">Submit</button>
      </form>
    </FormProvider>
  )
}

describe('RHFTenantAutoCompleteMultipleField', () => {
  it('shows only the tenant name when subUnitType is undefined', async () => {
    const user = userEvent.setup()

    renderWithApplicationContext(
      <TestForm>
        <RHFTenantAutoCompleteMultipleField
          name="tenantIds"
          label="Cerca per erogatore"
          options={[tenants[2]]}
        />
      </TestForm>,
      {}
    )

    await user.click(screen.getByRole('combobox', { name: 'Cerca per erogatore' }))

    const option = screen.getByRole('option', { name: 'PagoPA S.p.A.' })
    expect(within(option).getAllByText('PagoPA S.p.A.', { selector: 'span' })).toHaveLength(1)
  })

  it('shows the UO with its AOO (separated by a dash) in the title and the rootTenant in the caption', async () => {
    const user = userEvent.setup()

    renderWithApplicationContext(
      <TestForm>
        <RHFTenantAutoCompleteMultipleField
          name="tenantIds"
          label="Cerca per erogatore"
          options={[tenants[1]]}
        />
      </TestForm>,
      {}
    )

    await user.click(screen.getByRole('combobox', { name: 'Cerca per erogatore' }))

    const option = screen.getByRole('option', {
      name: 'Ufficio permessi ZTL - Direzione Mobilità Comune di Milano',
    })
    expect(
      within(option).getByText('Ufficio permessi ZTL - Direzione Mobilità', {
        selector: 'span',
      })
    ).toBeInTheDocument()
    expect(within(option).getByText('Comune di Milano')).toBeInTheDocument()
  })

  it('renders tenant options with hierarchy and a tenant logo', async () => {
    const user = userEvent.setup()

    renderWithApplicationContext(
      <TestForm>
        <RHFTenantAutoCompleteMultipleField
          name="tenantIds"
          label="Cerca per erogatore"
          options={tenants}
        />
      </TestForm>,
      {}
    )

    await user.click(screen.getByRole('combobox', { name: 'Cerca per erogatore' }))

    expect(
      screen.getByRole('option', {
        name: 'Direzione Mobilità Comune di Milano',
      })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('option', {
        name: 'Ufficio permessi ZTL - Direzione Mobilità Comune di Milano',
      })
    ).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'PagoPA S.p.A.' })).toBeInTheDocument()
  })

  it('selects multiple tenants and submits their ids', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    const onValueChange = vi.fn()

    renderWithApplicationContext(
      <TestForm onSubmit={onSubmit}>
        <RHFTenantAutoCompleteMultipleField
          name="tenantIds"
          label="Cerca per erogatore"
          options={tenants}
          onValueChange={onValueChange}
        />
      </TestForm>,
      {}
    )

    const input = screen.getByRole('combobox', { name: 'Cerca per erogatore' })
    await user.click(input)
    await user.click(
      screen.getByRole('option', {
        name: 'Direzione Mobilità Comune di Milano',
      })
    )

    await user.keyboard('{ArrowDown}')
    await user.click(screen.getByRole('option', { name: 'PagoPA S.p.A.' }))

    expect(screen.getByRole('button', { name: 'Delete 2' })).toBeInTheDocument()
    expect(onValueChange).toHaveBeenLastCalledWith([
      expect.objectContaining({ id: 'direzione-mobilita-id', name: 'Direzione Mobilità' }),
      expect.objectContaining({ id: 'pagopa-id', name: 'PagoPA S.p.A.' }),
    ])

    await user.click(screen.getByRole('button', { name: 'Submit' }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalled()
    })
    expect(onSubmit.mock.calls[0][0]).toEqual({
      tenantIds: ['direzione-mobilita-id', 'pagopa-id'],
    })
  })
})
