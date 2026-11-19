import { render, screen } from '@testing-library/react'
import { ErrorBoundary } from 'react-error-boundary'
import { expect, it, vi } from 'vitest'
import { ArchivingDateCell } from '../ArchivingDateCell'

it('surfaces an invalid backend archiving date to the error boundary instead of rendering blank', () => {
  const onError = vi.fn()
  render(
    <ErrorBoundary fallback={<div role="alert">Invalid archiving date</div>} onError={onError}>
      <ArchivingDateCell archivableOn="not-a-date" />
    </ErrorBoundary>
  )

  expect(screen.getByRole('alert')).toHaveTextContent('Invalid archiving date')
  expect(onError).toHaveBeenCalledWith(
    new RangeError('Invalid backend archiving date'),
    expect.anything()
  )
})
