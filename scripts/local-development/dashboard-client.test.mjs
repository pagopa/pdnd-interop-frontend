// @vitest-environment node
import { expect, it, vi } from 'vitest'
import * as client from './dashboard-client.mjs'

it('waits for the accepted operation before reporting successful startup', async () => {
  const request = vi
    .fn()
    .mockResolvedValueOnce({ operationId: 'start-1' })
    .mockResolvedValueOnce({ operations: [{ id: 'start-1', state: 'running', phases: [] }] })
    .mockResolvedValueOnce({ operations: [{ id: 'start-1', state: 'passed', phases: [] }] })
  await expect(
    client.runAction(
      { type: 'preset.start', id: 'frontend-full' },
      { request, pause: async () => {} }
    )
  ).resolves.toMatchObject({ state: 'passed' })
  expect(request).toHaveBeenNthCalledWith(1, 'actions', {
    type: 'preset.start',
    id: 'frontend-full',
  })
  expect(request).toHaveBeenCalledTimes(3)
})

it('reports startup phase errors instead of accepting HTTP 202 as completion', async () => {
  const request = vi
    .fn()
    .mockResolvedValueOnce({ operationId: 'start-1' })
    .mockResolvedValueOnce({
      operations: [{ id: 'start-1', state: 'failed', error: 'Backend build failed', phases: [] }],
    })
  await expect(
    client.runAction({ type: 'preset.start', id: 'frontend-full' }, { request })
  ).rejects.toThrow('Backend build failed')
})
