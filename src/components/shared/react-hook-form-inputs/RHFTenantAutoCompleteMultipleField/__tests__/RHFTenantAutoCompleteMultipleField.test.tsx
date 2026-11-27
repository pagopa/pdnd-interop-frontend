import React from 'react'
import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FormProvider, useForm, useFormContext } from 'react-hook-form'
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

function ResetActions() {
  const { reset } = useFormContext<FormValues>()

  return (
    <>
      <button type="button" onClick={() => reset({ tenantIds: [] })}>
        Clear tenants
      </button>
      <button type="button" onClick={() => reset({ tenantIds: ['ufficio-permessi-id'] })}>
        Replace tenant
      </button>
    </>
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

  it('reconciles a preselected tenant when its option arrives asynchronously', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    const { rerender } = renderWithApplicationContext(
      <TestForm defaultValues={{ tenantIds: ['pagopa-id'] }} onSubmit={onSubmit}>
        <RHFTenantAutoCompleteMultipleField
          name="tenantIds"
          label="Cerca per erogatore"
          options={[]}
        />
      </TestForm>,
      {}
    )

    expect(screen.getByRole('button', { name: 'Delete 1' })).toBeInTheDocument()

    rerender(
      <TestForm defaultValues={{ tenantIds: ['pagopa-id'] }} onSubmit={onSubmit}>
        <RHFTenantAutoCompleteMultipleField
          name="tenantIds"
          label="Cerca per erogatore"
          options={[tenants[2]]}
        />
      </TestForm>
    )

    const input = screen.getByRole('combobox', { name: 'Cerca per erogatore' })
    await user.click(input)

    const option = await screen.findByRole('option', { name: 'PagoPA S.p.A.' })
    expect(option).toHaveAttribute('aria-selected', 'true')

    await user.click(option)
    await user.click(screen.getByRole('button', { name: 'Submit' }))

    // After clicking submit, the form should have cleared the tenantIds because the selected option was removed.
    await waitFor(() => expect(onSubmit.mock.calls.at(-1)?.[0]).toEqual({ tenantIds: [] }))
  })

  it('keeps selected tenants when search options change', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    const onValueChange = vi.fn()
    const { rerender } = renderWithApplicationContext(
      <TestForm defaultValues={{ tenantIds: ['direzione-mobilita-id'] }} onSubmit={onSubmit}>
        <RHFTenantAutoCompleteMultipleField
          name="tenantIds"
          label="Cerca per erogatore"
          options={[tenants[0]]}
          onValueChange={onValueChange}
        />
      </TestForm>,
      {}
    )

    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Delete 1' })).toBeInTheDocument()
    )

    rerender(
      <TestForm defaultValues={{ tenantIds: ['direzione-mobilita-id'] }} onSubmit={onSubmit}>
        <RHFTenantAutoCompleteMultipleField
          name="tenantIds"
          label="Cerca per erogatore"
          options={[tenants[2]]}
          onValueChange={onValueChange}
        />
      </TestForm>
    )

    await user.click(screen.getByRole('combobox', { name: 'Cerca per erogatore' }))
    await user.click(await screen.findByRole('option', { name: 'PagoPA S.p.A.' }))

    expect(screen.getByRole('button', { name: 'Delete 2' })).toBeInTheDocument()
    expect(onValueChange).toHaveBeenLastCalledWith([tenants[0], tenants[2]])

    await user.click(screen.getByRole('button', { name: 'Submit' }))
    await waitFor(() =>
      expect(onSubmit.mock.calls.at(-1)?.[0]).toEqual({
        tenantIds: ['direzione-mobilita-id', 'pagopa-id'],
      })
    )
  })

  it('synchronizes clearing and same-length replacements from form.reset', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    renderWithApplicationContext(
      <TestForm defaultValues={{ tenantIds: ['pagopa-id'] }} onSubmit={onSubmit}>
        <RHFTenantAutoCompleteMultipleField
          name="tenantIds"
          label="Cerca per erogatore"
          options={tenants}
        />
        <ResetActions />
      </TestForm>,
      {}
    )

    await user.click(screen.getByRole('button', { name: 'Replace tenant' }))

    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Delete 1' })).toBeInTheDocument()
    )
    await user.click(screen.getByRole('combobox', { name: 'Cerca per erogatore' }))
    expect(
      screen.getByRole('option', {
        name: 'Ufficio permessi ZTL - Direzione Mobilità Comune di Milano',
      })
    ).toHaveAttribute('aria-selected', 'true')

    await user.click(screen.getByRole('button', { name: 'Submit' }))
    await waitFor(() =>
      expect(onSubmit.mock.calls.at(-1)?.[0]).toEqual({ tenantIds: ['ufficio-permessi-id'] })
    )

    await user.click(screen.getByRole('button', { name: 'Clear tenants' }))
    await waitFor(() =>
      expect(screen.queryByRole('button', { name: 'Delete 1' })).not.toBeInTheDocument()
    )
    await user.click(screen.getByRole('combobox', { name: 'Cerca per erogatore' }))
    expect(
      screen.getByRole('option', {
        name: 'Ufficio permessi ZTL - Direzione Mobilità Comune di Milano',
      })
    ).toHaveAttribute('aria-selected', 'false')

    await user.click(screen.getByRole('button', { name: 'Submit' }))
    await waitFor(() => expect(onSubmit.mock.calls.at(-1)?.[0]).toEqual({ tenantIds: [] }))
  })
})
