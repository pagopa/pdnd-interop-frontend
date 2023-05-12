import React from 'react'
import { renderHook } from '@testing-library/react'
import {
  EServiceDetailsContextProvider,
  useEServiceDetailsContext,
} from '../EServiceDetailsContext'
import { createMockEServiceDescriptorCatalog } from '__mocks__/data/eservice.mocks'

describe('EServiceDetailsContext', () => {
  it('should not return the agreement if it is rejected', () => {
    const { result } = renderHook(() => useEServiceDetailsContext(), {
      wrapper: ({ children }) => (
        <EServiceDetailsContextProvider
          descriptor={createMockEServiceDescriptorCatalog({
            eservice: { agreement: { state: 'REJECTED' } },
          })}
        >
          {children}
        </EServiceDetailsContextProvider>
      ),
    })
    expect(result.current.agreement).toBeUndefined()
  })

  it('should not return the agreement if it is in DRAFT state', () => {
    const { result } = renderHook(() => useEServiceDetailsContext(), {
      wrapper: ({ children }) => (
        <EServiceDetailsContextProvider
          descriptor={createMockEServiceDescriptorCatalog({
            eservice: { agreement: { state: 'DRAFT' } },
          })}
        >
          {children}
        </EServiceDetailsContextProvider>
      ),
    })
    expect(result.current.agreement).toBeUndefined()
  })

  it('should return the agreement if it is not DRAFT or REJECTED state', () => {
    const { result } = renderHook(() => useEServiceDetailsContext(), {
      wrapper: ({ children }) => (
        <EServiceDetailsContextProvider
          descriptor={createMockEServiceDescriptorCatalog({
            eservice: { agreement: { state: 'ACTIVE' } },
            interface: undefined,
          })}
        >
          {children}
        </EServiceDetailsContextProvider>
      ),
    })
    expect(result.current.agreement).toBeTruthy()
  })
})
