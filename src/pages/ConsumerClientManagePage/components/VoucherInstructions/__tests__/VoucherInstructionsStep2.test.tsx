import React from 'react'
import type { VoucherInstructionsStepProps } from '@/pages/ConsumerClientManagePage/types/voucher-instructions.types'
import {
  mockUseClientKind,
  renderWithApplicationContext,
  setupQueryServer,
} from '@/utils/testing.utils'
import { createMockPublicKey } from '__mocks__/data/key.mocks'
import { createMockPurpose } from '__mocks__/data/purpose.mocks'
import { vi } from 'vitest'
import { FE_URL } from '@/config/env'
import sessionTokenCurl from '../../../../../../public/data/it/session_token_curl.txt'
import { VoucherInstructionsStep2 } from '../VoucherInstructionsStep2'

const queryServer = setupQueryServer([
  {
    url: `${FE_URL}/data/it/session_token_curl.txt`,
    result: sessionTokenCurl,
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

describe('VoucherInstructionsStep2', () => {
  it('should match snapshot (API)', () => {
    mockUseClientKind('API')
    const screen = renderWithApplicationContext(<VoucherInstructionsStep2 {...commonProps} />, {
      withRouterContext: true,
    })
    expect(screen.baseElement).toMatchSnapshot()
  })

  it('should match snapshot (CONSUMER)', () => {
    mockUseClientKind('CONSUMER')
    const screen = renderWithApplicationContext(<VoucherInstructionsStep2 {...commonProps} />, {
      withRouterContext: true,
    })
    expect(screen.baseElement).toMatchSnapshot()
  })
})
