import { ThemeProvider } from '@mui/material'
import { theme } from '@pagopa/interop-fe-commons'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { providerSaturationRateMockItems } from '../../providerSaturationRate.mock'
import ProviderSaturationRateTable from '../ProviderSaturationRateTable'

const navigateMock = vi.hoisted(() => vi.fn())
vi.mock('@/router', () => ({ useNavigate: () => navigateMock }))

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}))

describe('ProviderSaturationRateTable', () => {
  it('renders named mobile rows and preserves the accessible descriptor tracking action', async () => {
    vi.stubGlobal('matchMedia', (query: string) => ({
      matches: true,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))

    try {
      render(
        <ThemeProvider theme={theme}>
          <ProviderSaturationRateTable saturationItems={[providerSaturationRateMockItems[0]]} />
        </ThemeProvider>
      )

      expect(screen.getByRole('group', { name: 'headlabels.eserviceAndVersion' })).toBeVisible()
      expect(screen.getByText(providerSaturationRateMockItems[0].eservice.name)).toBeVisible()
      const row = screen.getByText(providerSaturationRateMockItems[0].eservice.name).closest('dl')!
      expect(row.querySelector('dd')).toHaveAccessibleName('headlabels.eserviceAndVersion')
      const action = screen.getByRole('button', { name: 'inspectEService' })
      expect(action).toHaveTextContent(/^$/)
      expect(within(action).getByTestId('ChevronRightIcon')).toHaveAttribute('aria-hidden', 'true')
      expect(action.children).toHaveLength(1)
      await userEvent.setup().click(action)
      expect(navigateMock).toHaveBeenLastCalledWith('PROVIDE_ESERVICE_MANAGE', {
        params: {
          eserviceId: providerSaturationRateMockItems[0].eservice.id,
          descriptorId: providerSaturationRateMockItems[0].descriptorId,
        },
        urlParams: { tab: 'tracking' },
      })
    } finally {
      vi.unstubAllGlobals()
    }
  })

  it.each([
    { percentage: 0, color: theme.colors.success[500] },
    { percentage: -1, color: theme.colors.success[500] },
    { percentage: 69, color: theme.colors.success[500] },
    { percentage: 70, color: theme.colors.warning[500] },
    { percentage: 89, color: theme.colors.warning[500] },
    { percentage: 90, color: theme.colors.error[600] },
    { percentage: 100, color: theme.colors.error[600] },
    { percentage: 120, color: theme.colors.error[600] },
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
    expect(chart.closest('[aria-hidden="true"]')).toBeInTheDocument()
    expect(cell.querySelector('p p, p div')).not.toBeInTheDocument()
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

  it.each([
    { original: -25, boundary: 0 },
    { original: 125, boundary: 100 },
  ])('clamps only the visual for $original%', async ({ original, boundary }) => {
    const table = (percentage: number) => (
      <ThemeProvider theme={theme}>
        <ProviderSaturationRateTable
          saturationItems={[{ ...providerSaturationRateMockItems[0], percentage }]}
        />
      </ThemeProvider>
    )
    const { container, rerender } = render(table(boundary))
    await waitFor(() => expect(container.querySelectorAll('path.MuiPieArc-root')).toHaveLength(2))
    const boundaryPaths = Array.from(container.querySelectorAll('path.MuiPieArc-root')).map(
      (path) => path.getAttribute('d')
    )
    rerender(table(original))
    expect(screen.getByText(`${original}%`)).toBeVisible()
    await waitFor(() =>
      expect(
        Array.from(container.querySelectorAll('path.MuiPieArc-root')).map((path) =>
          path.getAttribute('d')
        )
      ).toEqual(boundaryPaths)
    )
  })
})
