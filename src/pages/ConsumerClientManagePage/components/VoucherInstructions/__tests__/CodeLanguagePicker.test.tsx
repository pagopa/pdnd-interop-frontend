import React from 'react'
import { CodeLanguagePicker } from '../CodeLanguagePicker'
import { render } from '@testing-library/react'
import { vi } from 'vitest'

const entriesMock = [
  { value: 'python', label: 'python' },
  { value: 'javascript', label: 'javascript' },
]

describe('CodeLanguagePicker', () => {
  it('should match snapshot', () => {
    const screen = render(
      <CodeLanguagePicker entries={entriesMock} activeLang="python" onLangUpdate={vi.fn()} />
    )
    expect(screen.baseElement).toMatchSnapshot()
  })

  it('should correctly call onLangUpdate', () => {
    const onLangUpdate = vi.fn()
    const screen = render(
      <CodeLanguagePicker entries={entriesMock} activeLang="python" onLangUpdate={onLangUpdate} />
    )
    screen.getByText('javascript').click()
    expect(onLangUpdate).toHaveBeenCalledWith('javascript')
  })
})
