import React from 'react'
import { TOSPage } from '..'
import tosJson from '../../../../public/data/it/tos.json'
import { FE_URL } from '@/config/env'
import { render } from '@testing-library/react'
import { setupQueryServer } from '@/utils/testing.utils'

const server = setupQueryServer([
  {
    url: `${FE_URL}/data/it/tos.json`,
    result: tosJson,
  },
])

beforeAll(() => server.listen())
afterAll(() => server.close())

describe('TOS page', () => {
  it('should match the snapshot', async () => {
    const screen = render(<TOSPage />)
    await new Promise((resolve) => setTimeout(resolve, 1))
    expect(screen.baseElement).toMatchSnapshot()
  })
})
