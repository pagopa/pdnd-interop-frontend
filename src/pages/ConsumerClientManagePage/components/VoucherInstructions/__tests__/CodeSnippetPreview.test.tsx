import React from 'react'
import { setupQueryServer } from '@/utils/testing.utils'
import { render, waitFor } from '@testing-library/react'
import { CodeSnippetPreview } from '../CodeSnippetPreview'

const queryServer = setupQueryServer([
  { url: '/python', result: 'python' },
  { url: '/javascript', result: 'javascript' },
  { url: '/java', result: 'JAVA_SUBSTITUTION_TEST' },
])

beforeAll(() => queryServer.listen())
afterEach(() => queryServer.resetHandlers())
afterAll(() => queryServer.close())

describe('CodeSnippetPreview', () => {
  it('should match snapshot', async () => {
    const screen = render(
      <CodeSnippetPreview
        title="test"
        entries={[
          { value: 'python', url: '/python' },
          { value: 'javascript', url: '/javascript' },
        ]}
        activeLang="python"
      />
    )
    await waitFor(() => screen.getByText('python'))
    expect(screen.baseElement).toMatchSnapshot()
  })

  it('should correctly substitute values', async () => {
    const screen = render(
      <CodeSnippetPreview
        title="test"
        entries={[
          { value: 'python', url: '/python' },
          { value: 'javascript', url: '/javascript' },
          { value: 'java', url: '/java' },
        ]}
        scriptSubstitutionValues={{ JAVA_SUBSTITUTION_TEST: 'java' }}
        activeLang="java"
      />
    )
    await waitFor(() => screen.getByText('java'))
    expect(screen.getByText('java')).toBeInTheDocument()
  })
})
