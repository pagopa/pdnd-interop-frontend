import { ThemeProvider } from '@mui/material'
import { theme } from '@pagopa/interop-fe-commons'
import { render, screen, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import { providerSaturationRateMockItems } from '../../providerSaturationRate.mock'
import ProviderSaturationRateTable from '../ProviderSaturationRateTable'

vi.mock('@/router', () => ({
  useNavigate: () => vi.fn(),
}))

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}))

describe('ProviderSaturationRateTable', () => {
  it.each([
    { percentage: 0, color: theme.palette.success.main },
    { percentage: 69, color: theme.palette.success.main },
    { percentage: 70, color: theme.palette.warning.main },
    { percentage: 89, color: theme.palette.warning.main },
    { percentage: 90, color: theme.palette.error.main },
    { percentage: 100, color: theme.palette.error.main },
    { percentage: 120, color: theme.palette.error.main },
  ])('renders a donut and a separate label for $percentage%', async ({ percentage, color }) => {
    render(
      <ThemeProvider theme={theme}>
        <ProviderSaturationRateTable
          saturationItems={[{ ...providerSaturationRateMockItems[0], percentage }]}
        />
      </ThemeProvider>
    )

    const label = screen.getByText(`${percentage}%`)
    expect(label).toBeVisible()
    const cell = label.closest('td')!
    const chart = cell.querySelector('svg')!
    expect(chart).toHaveAttribute('width', '20')
    expect(chart).toHaveAttribute('height', '20')
    expect(chart).not.toContainElement(label)
    chart.querySelectorAll('.MuiPieArcLabel-root').forEach((arcLabel) => {
      expect(arcLabel).toBeEmptyDOMElement()
    })

    await waitFor(() => {
      const arcs = chart.querySelectorAll<SVGPathElement>('path.MuiPieArc-root')
      expect(arcs).toHaveLength(2)
      expect(arcs[0]).toHaveAttribute('fill', color)
      expect(arcs[1]).toHaveAttribute('fill', theme.palette.grey[200])
      arcs.forEach((arc) => {
        expect(arc.getAttribute('d')).toBeTruthy()
        expect(arc.getAttribute('d')).not.toMatch(/NaN|Infinity/)
      })
    })
  })
})
