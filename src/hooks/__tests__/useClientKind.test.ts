import type { ClientKind } from '@/api/api.generatedTypes'
import { renderHookWithApplicationContext } from '@/utils/testing.utils'
import { throws } from 'assert'
import { createMemoryHistory } from 'history'
import { useClientKind } from '../useClientKind'

function renderUseGetClientActionsHook(clientKind?: ClientKind) {
  const memoryHistory = createMemoryHistory()

  memoryHistory.push('/it/fruizione/catalogo-e-service')

  if (clientKind === 'API') memoryHistory.push('/it/fruizione/interop-m2m')

  if (clientKind === 'CONSUMER') memoryHistory.push('/it/fruizione/client')

  return renderHookWithApplicationContext(
    () => useClientKind(),
    {
      withReactQueryContext: true,
      withRouterContext: true,
    },
    memoryHistory
  )
}

describe('check if useClientKind returns the correct kind based on the location path', () => {
  it('shoud throw an error if the location path is outside client routes', () => {
    throws(() => {
      renderUseGetClientActionsHook()
    })
  })

  it('shoud return API client kind if the location path contain interop-m2m', () => {
    const { result } = renderUseGetClientActionsHook('API')
    expect(result.current).toBe('API')
  })

  it('shoud return API client kind if the location path contain client', () => {
    const { result } = renderUseGetClientActionsHook('CONSUMER')
    expect(result.current).toBe('CONSUMER')
  })
})
