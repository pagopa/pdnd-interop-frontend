import React from 'react'
import { DialogAttributeDetails } from '../DialogAttributeDetails'
import { BACKEND_FOR_FRONTEND_URL } from '@/config/env'
import type { Attribute } from '@/api/api.generatedTypes'
import { mockUseJwt, renderWithApplicationContext, setupQueryServer } from '@/utils/testing.utils'
import { waitFor } from '@testing-library/react'

mockUseJwt()

const server = setupQueryServer([
  {
    url: `${BACKEND_FOR_FRONTEND_URL}/attributes/:id`,
    result: {
      id: 'id',
      name: 'name',
      kind: 'CERTIFIED',
      description: 'description',
      creationTime: '2021-01-01T00:00:00Z',
    } satisfies Attribute,
  },
])

beforeAll(() => server.listen())
afterAll(() => server.close())

describe('DialogAttributeDetails testing', () => {
  it('should match the snapshot', async () => {
    const screen = renderWithApplicationContext(
      <DialogAttributeDetails
        type="showAttributeDetails"
        attribute={{
          id: 'id',
          name: 'name',
        }}
      />,
      { withReactQueryContext: true }
    )
    expect(screen.baseElement).toMatchSnapshot('loading state')
    await waitFor(() => expect(screen.getByText('description')).toBeDefined())
    expect(screen.baseElement).toMatchSnapshot('full state')
  })
})
