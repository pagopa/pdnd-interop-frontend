import React from 'react'
import { TOSPage } from '..'
import tosJson from '../../../../public/data/it/tos.json'
import { setupServer } from 'msw/node'
import { rest } from 'msw'
import { FE_URL } from '@/config/env'
import { render } from '@testing-library/react'

const server = setupServer(
  rest.get(`${FE_URL}/data/it/tos.json`, (req, res, ctx) => {
    return res(ctx.json(tosJson))
  })
)

beforeAll(() => server.listen())
afterAll(() => server.close())

describe('TOS page', () => {
  it('should match the snapshot', async () => {
    const screen = render(<TOSPage />)
    await new Promise((resolve) => setTimeout(resolve, 1))
    expect(screen.baseElement).toMatchSnapshot()
  })
})
