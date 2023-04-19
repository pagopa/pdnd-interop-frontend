import React from 'react'
import SecurityKeyGuidePage from '../SecurityKeyGuide.page'
import publicKeyJson from '../../../../public/data/it/public-key.json'
import { FE_URL } from '@/config/env'
import { render } from '@testing-library/react'
import { setupQueryServer } from '@/utils/testing.utils'

const server = setupQueryServer([
  {
    url: `${FE_URL}/data/it/public-key.json`,
    result: publicKeyJson,
  },
])

beforeAll(() => server.listen())
afterAll(() => server.close())

describe('SecurityKeyGuide page', () => {
  it('should match the snapshot', async () => {
    const screen = render(<SecurityKeyGuidePage />)
    await new Promise((resolve) => setTimeout(resolve, 1))
    expect(screen.baseElement).toMatchSnapshot()
  })
})
