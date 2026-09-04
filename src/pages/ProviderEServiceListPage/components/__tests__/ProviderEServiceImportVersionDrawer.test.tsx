import { screen } from '@testing-library/react'
import { vi } from 'vitest'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import { ProviderEServiceImportVersionDrawer } from '../ProviderEServiceImportVersionDrawer'

vi.mock('@/api/eservice', () => ({
  EServiceMutations: {
    useImportVersion: () => ({ mutate: vi.fn() }),
  },
}))

describe('ProviderEServiceImportVersionDrawer', () => {
  it('shows zip as the allowed extension', () => {
    renderWithApplicationContext(<ProviderEServiceImportVersionDrawer isOpen onClose={vi.fn()} />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.getByText('dropzone.allowedExtensions.eserviceImport')).toBeInTheDocument()
  })
})
