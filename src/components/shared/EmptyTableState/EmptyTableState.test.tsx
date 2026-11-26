import { theme } from '@pagopa/mui-italia'
import { render, screen } from '@testing-library/react'
import { EmptyTableState } from './EmptyTableState'

it('renders the empty message with the specified border and circled exclamation icon', () => {
  render(<EmptyTableState message="No results" />)

  const alert = screen.getByRole('status')
  const icon = screen.getByTestId('ErrorOutlineIcon')
  const iconContainer = icon.parentElement

  expect(alert).toHaveTextContent('No results')
  expect(alert).toHaveAttribute('aria-live', 'polite')
  expect(alert).toHaveStyle({ borderColor: theme.colors.neutral.grey[100] })
  expect(icon).toHaveStyle({ width: '1.25rem', height: '1.25rem' })
  expect(iconContainer).toHaveStyle({ color: '#BCC2D6' })
  // jsdom does not resolve specificity correctly for the Alert's nested icon rule.
  const iconRules = Array.from(document.styleSheets).flatMap((sheet) =>
    Array.from(sheet.cssRules).filter((rule) => rule.cssText.includes('.MuiAlert-icon'))
  )
  expect(iconRules.some((rule) => rule.cssText.includes('opacity: 1;'))).toBe(true)
})
