import React from 'react'
import type { VoucherInstructionsStepProps } from '@/pages/ConsumerClientManagePage/types/voucher-instructions.types'
import {
  mockUseClientKind,
  renderWithApplicationContext,
  setupQueryServer,
} from '@/utils/testing.utils'
import { createMockPublicKey } from '__mocks__/data/key.mocks'
import { createMockPurpose } from '__mocks__/data/purpose.mocks'
import { VoucherInstructionsStep1 } from '../VoucherInstructionsStep1'
import { vi } from 'vitest'
import { FE_URL } from '@/config/env'
import voucherPythonCode from '../../../../../../public/data/it/voucher-python-code.txt'
import voucherPythonM2MCode from '../../../../../../public/data/it/voucher-python-m2m-code.txt'
import userEvent from '@testing-library/user-event'

const queryServer = setupQueryServer([
  {
    url: `${FE_URL}/data/it/voucher-python-code.txt`,
    result: voucherPythonCode,
  },
  {
    url: `${FE_URL}/data/it/voucher-python-m2m-code.txt`,
    result: voucherPythonM2MCode,
  },
])

beforeAll(() => queryServer.listen())
afterEach(() => queryServer.resetHandlers())
afterAll(() => queryServer.close())

const commonProps: VoucherInstructionsStepProps = {
  clientId: 'test-client-id',
  clientKeys: {
    keys: [
      createMockPublicKey({ keyId: '1', name: 'key1' }),
      createMockPublicKey({ keyId: '2', name: 'key2' }),
    ],
  },
  purpose: createMockPurpose(),
  purposeId: 'test-purpose-id',
  forward: vi.fn(),
  back: vi.fn(),
}

describe('VoucherInstructionsStep1', () => {
  it('should match snapshot (API)', () => {
    mockUseClientKind('API')
    const screen = renderWithApplicationContext(<VoucherInstructionsStep1 {...commonProps} />, {
      withRouterContext: true,
    })
    expect(screen.baseElement).toMatchSnapshot()
  })

  it('should match snapshot (CONSUMER)', () => {
    mockUseClientKind('CONSUMER')
    const screen = renderWithApplicationContext(<VoucherInstructionsStep1 {...commonProps} />, {
      withRouterContext: true,
    })
    expect(screen.baseElement).toMatchSnapshot()
  })

  it('should match snapshot without keys', () => {
    mockUseClientKind('CONSUMER')
    const screen = renderWithApplicationContext(
      <VoucherInstructionsStep1 {...commonProps} clientKeys={{ keys: [] }} />,
      {
        withRouterContext: true,
      }
    )
    expect(screen.baseElement).toMatchSnapshot()
  })

  it('should select the first key by default', () => {
    mockUseClientKind('CONSUMER')
    const screen = renderWithApplicationContext(<VoucherInstructionsStep1 {...commonProps} />, {
      withRouterContext: true,
    })
    const selectedOption = screen.getByLabelText('step1.choosePublicKeyLabel').innerHTML
    expect(selectedOption).toBe('key1')
  })

  it('should correctly change selected key', async () => {
    mockUseClientKind('CONSUMER')
    const screen = renderWithApplicationContext(<VoucherInstructionsStep1 {...commonProps} />, {
      withRouterContext: true,
    })
    const keysSelectInput = screen.getByLabelText('step1.choosePublicKeyLabel')
    const user = userEvent.setup()
    await user.click(keysSelectInput)
    const option2 = screen.getByRole('option', { name: 'key2' })
    await user.click(option2)

    const selectedOption = screen.getByLabelText('step1.choosePublicKeyLabel').innerHTML
    expect(selectedOption).toBe('key2')

    await user.click(screen.getByText('python 3'))
  })
})
