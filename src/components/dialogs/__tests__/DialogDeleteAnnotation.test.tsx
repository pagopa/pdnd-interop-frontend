import React from 'react'
import { screen } from '@testing-library/react'
import { DialogDeleteAnnotation } from '../DialogDeleteAnnotation'
import { renderWithApplicationContext } from '@/utils/testing.utils'

// Mock the dialog store
const mockCloseDialog = vi.fn()
vi.mock('@/stores', () => ({
  useDialog: () => ({
    closeDialog: mockCloseDialog,
  }),
  useToastNotification: () => ({
    hideToast: vi.fn(),
  }),
  useToastNotificationStore: Object.assign(
    vi.fn((selector) => {
      const state = {
        isShown: false,
        message: '',
        severity: 'info' as const,
        showToast: vi.fn(),
      }
      return selector ? selector(state) : state
    }),
    {
      getState: () => ({
        showToast: vi.fn(),
      }),
    }
  ),
  useLoadingOverlayStore: Object.assign(
    vi.fn((selector) => {
      const state = {
        isLoadingOverlayShown: false,
        loadingOverlayMessage: '',
        showOverlay: vi.fn(),
        hideOverlay: vi.fn(),
      }
      return selector ? selector(state) : state
    }),
    {
      getState: () => ({
        showOverlay: vi.fn(),
        hideOverlay: vi.fn(),
      }),
    }
  ),
  useDialogStore: Object.assign(
    vi.fn((selector) => {
      const state = {
        dialog: null,
        openDialog: vi.fn(),
      }
      return selector ? selector(state) : state
    }),
    {
      getState: () => ({
        openDialog: vi.fn(),
      }),
    }
  ),
}))

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: (namespace: string) => ({
    t: (key: string) => `${namespace}.${key}`,
  }),
}))

const defaultProps = {
  type: 'deleteAnnotation' as const,
  onProceed: vi.fn(),
}

describe('DialogDeleteAnnotation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('rendering', () => {
    it('should render dialog with correct title and content', () => {
      renderWithApplicationContext(<DialogDeleteAnnotation {...defaultProps} />, {
        withReactQueryContext: true,
      })

      expect(screen.getByText('purposeTemplate.title')).toBeInTheDocument()
      expect(screen.getByText('purposeTemplate.description')).toBeInTheDocument()
    })

    it('should render cancel and proceed buttons', () => {
      renderWithApplicationContext(<DialogDeleteAnnotation {...defaultProps} />, {
        withReactQueryContext: true,
      })

      expect(screen.getByText('purposeTemplate.cancelLabel')).toBeInTheDocument()
      expect(screen.getByText('purposeTemplate.proceedLabel')).toBeInTheDocument()
    })

    it('should have proper accessibility attributes', () => {
      renderWithApplicationContext(<DialogDeleteAnnotation {...defaultProps} />, {
        withReactQueryContext: true,
      })

      const dialog = screen.getByRole('dialog')
      expect(dialog).toBeInTheDocument()
      expect(dialog).toHaveAttribute('aria-labelledby')
      expect(dialog).toHaveAttribute('aria-describedby')
    })

    it('should have correct dialog properties', () => {
      renderWithApplicationContext(<DialogDeleteAnnotation {...defaultProps} />, {
        withReactQueryContext: true,
      })

      const dialog = screen.getByRole('dialog')
      expect(dialog).toBeInTheDocument()
      expect(dialog).toHaveAttribute('aria-labelledby')
      expect(dialog).toHaveAttribute('aria-describedby')
    })
  })
})
