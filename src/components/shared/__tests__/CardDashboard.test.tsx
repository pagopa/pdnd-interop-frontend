import { createTheme, ThemeProvider } from '@mui/material/styles'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactNode } from 'react'
import { vi } from 'vitest'
import { CardDashboard } from '../CardDashboard'
import type { CardDashboardProps, CardDashboardStatus } from '../CardDashboard'

const theme = createTheme()
const statuses: CardDashboardStatus[] = [
  { id: 'active', label: 'Attivi', count: 15, color: '#008000' },
  { id: 'draft', label: 'Bozze', count: 3, color: '#0000ff' },
  { id: 'suspended', label: 'Sospesi', count: 2, color: '#ff0000' },
  { id: 'archived', label: 'Archiviati', count: 0, color: '#808080' },
]

function renderCard(props: CardDashboardProps) {
  return render(<CardDashboard {...props} />, {
    wrapper: ({ children }: { children: ReactNode }) => (
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    ),
  })
}

function getArcs(chart: HTMLElement) {
  const arcs = Array.from(chart.querySelectorAll<SVGPathElement>('path.MuiPieArc-root'))
  expect(chart.querySelector('svg')).toHaveAttribute('width', '96')
  expect(chart.querySelector('svg')).toHaveAttribute('height', '96')
  expect(arcs.length).toBeGreaterThan(0)
  arcs.forEach((arc) => {
    expect(arc.getAttribute('d')).toBeTruthy()
    expect(arc.getAttribute('d')).not.toMatch(/NaN|Infinity/)
  })
  return arcs
}

async function getDrawnArcs(chart: HTMLElement) {
  return waitFor(() => {
    const arcs = getArcs(chart).filter((arc) => /a/i.test(arc.getAttribute('d') ?? ''))
    expect(arcs.length).toBeGreaterThan(0)
    return arcs
  })
}

describe('CardDashboard', () => {
  it.each([
    { value: 3.5, formatted: '3,5' },
    { value: 12200, formatted: '12.200' },
    { value: 0, formatted: '0' },
  ])('formats metric $value in it-IT without losing zero', ({ value, formatted }) => {
    renderCard({
      heading: 'E-service',
      content: { kind: 'metric', metric: { value, label: 'Totali' } },
    })

    expect(screen.getByText(formatted)).toBeVisible()
    expect(screen.getByText('Totali')).toBeVisible()
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })

  it.each([
    { locale: undefined, formatted: '12.200,5' },
    { locale: 'en-US', formatted: '12,200.5' },
  ])(
    'formats metric fractions with grouping for locale $locale (default it-IT)',
    ({ locale, formatted }) => {
      renderCard({
        heading: 'Services',
        locale,
        content: { kind: 'metric', metric: { value: 12200.5, label: 'Total' } },
      })

      expect(screen.getByText(formatted)).toBeVisible()
    }
  )

  it('renders multiple metrics as vertically stacked, inline value-label pairs', () => {
    renderCard({
      heading: 'Richieste',
      content: {
        kind: 'metrics',
        metrics: [
          { id: 'total', value: 10000, label: 'Totali' },
          { id: 'active', value: 2000, label: 'Attive' },
          { id: 'pending', value: 200, label: 'In attesa' },
          { id: 'zero', value: 0, label: 'Fallite' },
        ],
      },
    })

    const values = ['10.000', '2000', '200', '0']
    const labels = ['Totali', 'Attive', 'In attesa', 'Fallite']
    values.forEach((value, index) => {
      const row = screen.getByText(value).parentElement!
      expect(within(row).getByText(labels[index])).toBeVisible()
      expect(row).toHaveStyle({ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline' })
    })
    expect(screen.getByText(values[0]).parentElement!.parentElement).toHaveStyle({
      display: 'flex',
      flexDirection: 'column',
    })
  })

  it('derives the status total and retains every legend entry including zero', async () => {
    renderCard({
      heading: 'E-service',
      content: { kind: 'status', statuses, totalLabel: 'Totali' },
    })

    expect(screen.getByText('20')).toBeVisible()
    const entries = screen.getAllByRole('listitem')
    expect(entries).toHaveLength(4)
    statuses.forEach((status, index) => {
      expect(within(entries[index]).getByText(status.label)).toBeVisible()
      expect(within(entries[index]).getByText(String(status.count))).toBeVisible()
    })
    const chart = screen.getByRole('img', { name: 'Totali: 20' })
    const arcs = await getDrawnArcs(chart)
    expect(arcs).toHaveLength(3)
    arcs.forEach((arc, index) => expect(arc).toHaveAttribute('fill', statuses[index].color))
    expect(chart.firstElementChild).toHaveAttribute('aria-hidden', 'true')
  })

  it.each([
    { scenario: 'all zero', values: statuses.map((status) => ({ ...status, count: 0 })) },
    { scenario: 'no entries', values: [] },
  ])('draws a neutral status ring for $scenario', async ({ values }) => {
    renderCard({
      heading: 'E-service',
      content: { kind: 'status', statuses: values, totalLabel: 'Totali' },
    })

    expect(screen.getAllByText('0')).toHaveLength(values.length + 1)
    const arcs = await getDrawnArcs(screen.getByRole('img', { name: 'Totali: 0' }))
    expect(arcs).toHaveLength(1)
    expect(arcs[0]).toHaveAttribute('fill', theme.palette.grey[200])
    expect(screen.queryAllByRole('listitem')).toHaveLength(values.length)
  })

  it('renders 38.500 / 50.000 as 77% with two real consumption arcs', async () => {
    renderCard({
      heading: 'Consumi',
      content: { kind: 'consumption', used: 38500, limit: 50000, unitLabel: 'Chiamate' },
    })

    expect(screen.getByText('77%')).toBeVisible()
    expect(screen.getByText('38.500 / 50.000')).toBeVisible()
    expect(screen.getByText('Chiamate')).toBeVisible()
    const arcs = await getDrawnArcs(
      screen.getByRole('img', { name: '77%; 38.500 / 50.000 Chiamate' })
    )
    expect(arcs).toHaveLength(2)
    expect(arcs[0]).toHaveAttribute('fill', theme.palette.primary.main)
    expect(arcs[1]).toHaveAttribute('fill', theme.palette.grey[200])
    expect(arcs[0].getAttribute('d')).not.toBe(arcs[1].getAttribute('d'))
  })

  it.each([
    { locale: undefined, amount: '12.200,5 / 20.000', percentage: '61%' },
    { locale: 'en-US', amount: '12,200.5 / 20,000', percentage: '61%' },
    { locale: 'de-DE', amount: '12.200,5 / 20.000', percentage: '61\u00a0%' },
  ])(
    'formats decimal consumption amounts and percentage for locale $locale (default it-IT)',
    ({ locale, amount, percentage }) => {
      renderCard({
        heading: 'Usage',
        locale,
        content: { kind: 'consumption', used: 12200.5, limit: 20000, unitLabel: 'Calls' },
      })

      expect(screen.getByText(amount)).toBeVisible()
      expect(screen.getByText(percentage, { normalizer: (text) => text })).toBeVisible()
      const chart = screen.getByRole('img')
      expect(chart).toHaveAttribute('aria-label', `${percentage}; ${amount} Calls`)
      getArcs(chart)
    }
  )

  it.each([
    { used: 0, limit: 0, amount: '0 / 0' },
    { used: 0, limit: 50000, amount: '0 / 50.000' },
    { used: 10, limit: 0, amount: '10 / 0' },
  ])(
    'handles consumption $used / $limit without NaN or Infinity',
    async ({ used, limit, amount }) => {
      const { container } = renderCard({
        heading: 'Consumi',
        content: { kind: 'consumption', used, limit, unitLabel: 'Chiamate' },
      })

      expect(screen.getByText('0%')).toBeVisible()
      expect(screen.getByText(amount)).toBeVisible()
      expect(container.textContent).not.toMatch(/NaN|Infinity/)
      const arcs = await getDrawnArcs(screen.getByRole('img', { name: `0%; ${amount} Chiamate` }))
      expect(arcs).toHaveLength(1)
      expect(arcs[0]).toHaveAttribute('fill', theme.palette.grey[200])
    }
  )

  it('preserves an over-limit percentage while clamping the actual arc to a full ring', async () => {
    const { rerender } = renderCard({
      heading: 'Consumi',
      content: { kind: 'consumption', used: 100, limit: 100, unitLabel: 'Chiamate' },
    })
    const fullRing = (await getDrawnArcs(screen.getByRole('img')))[0].getAttribute('d')

    rerender(
      <CardDashboard
        heading="Consumi"
        content={{ kind: 'consumption', used: 150, limit: 100, unitLabel: 'Chiamate' }}
      />
    )

    expect(screen.getByText('150%')).toBeVisible()
    expect(screen.getByText('150 / 100')).toBeVisible()
    const arcs = await getDrawnArcs(screen.getByRole('img', { name: '150%; 150 / 100 Chiamate' }))
    expect(arcs).toHaveLength(1)
    expect(arcs[0].getAttribute('d')).toBe(fullRing)
    expect(arcs[0]).toHaveAttribute('fill', theme.palette.primary.main)
  })

  it('clamps negative consumption to an empty ring without changing its displayed percentage', async () => {
    renderCard({
      heading: 'Consumi',
      content: { kind: 'consumption', used: -10, limit: 100, unitLabel: 'Chiamate' },
    })

    expect(screen.getByText('-10%')).toBeVisible()
    const arcs = await getDrawnArcs(screen.getByRole('img', { name: '-10%; -10 / 100 Chiamate' }))
    expect(arcs).toHaveLength(1)
    expect(arcs[0]).toHaveAttribute('fill', theme.palette.grey[200])
  })

  it('renders empty text with a decorative blue success check', () => {
    renderCard({
      heading: 'Operazioni',
      content: { kind: 'empty', message: 'Nessuna operazione richiesta', icon: 'success' },
    })

    expect(screen.getByText('Nessuna operazione richiesta')).toBeVisible()
    const icon = screen.getByTestId('CheckRoundedIcon')
    expect(icon).toBeVisible()
    expect(icon.parentElement).toHaveAttribute('aria-hidden', 'true')
    expect(icon.parentElement).toHaveStyle({
      color: theme.palette.primary.main,
      backgroundColor: '#CED8F9',
    })
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })

  it('renders empty text without creating an icon or chart when none is requested', () => {
    renderCard({ heading: 'Operazioni', content: { kind: 'empty', message: 'Nessun dato' } })

    expect(screen.getByText('Nessun dato')).toBeVisible()
    expect(screen.queryByTestId('CheckRoundedIcon')).not.toBeInTheDocument()
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })

  it('renders a contained primary action with a start Add icon and click handler', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    renderCard({
      heading: 'E-service',
      content: { kind: 'empty', message: 'Nessun dato' },
      action: { type: 'primary', text: 'Aggiungi e-service', action: onClick },
    })

    const button = screen.getByRole('button', { name: 'Aggiungi e-service' })
    expect(button).toHaveAttribute('type', 'button')
    expect(button).toHaveClass('MuiButton-contained')
    expect(button).not.toHaveStyle({ padding: '0px' })
    expect(button.querySelector('.MuiButton-startIcon')).toContainElement(
      within(button).getByTestId('AddIcon')
    )
    expect(within(button).queryByTestId('ArrowForwardIcon')).not.toBeInTheDocument()
    expect(button.querySelector('.MuiButton-endIcon')).not.toBeInTheDocument()
    await user.click(button)
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('renders a text link action as a button with an end ArrowForward icon and click handler', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    renderCard({
      heading: 'E-service',
      content: { kind: 'empty', message: 'Nessun dato' },
      action: { type: 'link', text: 'Esplora catalogo', action: onClick },
    })

    const button = screen.getByRole('button', { name: 'Esplora catalogo' })
    expect(button.tagName).toBe('BUTTON')
    expect(button).toHaveAttribute('type', 'button')
    expect(button).toHaveClass('MuiButton-text')
    expect(button).toHaveStyle({ padding: '0px' })
    expect(button).not.toHaveAttribute('href')
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
    expect(button.querySelector('.MuiButton-endIcon')).toContainElement(
      within(button).getByTestId('ArrowForwardIcon')
    )
    expect(within(button).queryByTestId('AddIcon')).not.toBeInTheDocument()
    expect(button.querySelector('.MuiButton-startIcon')).not.toBeInTheDocument()
    await user.click(button)
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it.each(['primary', 'link'] as const)(
    'renders a %s action without a callback and allows clicking without throwing',
    async (type) => {
      const user = userEvent.setup()
      renderCard({
        heading: 'E-service',
        content: { kind: 'empty', message: 'Nessun dato' },
        action: { type, text: 'Catalogo' },
      })

      const button = screen.getByRole('button', { name: 'Catalogo' })
      expect(button).toBeVisible()
      await expect(user.click(button)).resolves.toBeUndefined()
    }
  )

  it('exposes a heading-labelled section with subtitle and footer, including without an action', () => {
    renderCard({
      heading: 'E-service',
      subtitle: 'Ultimo aggiornamento',
      footer: 'Dati aggiornati ogni giorno',
      content: { kind: 'metric', metric: { value: 20, label: 'Totali' } },
    })

    const section = screen.getByRole('region', { name: 'E-service' })
    const heading = within(section).getByRole('heading', { level: 3, name: 'E-service' })
    expect(section.tagName).toBe('SECTION')
    expect(section).toHaveAttribute('aria-labelledby', heading.id)
    expect(within(section).getByText('Ultimo aggiornamento')).toBeVisible()
    expect(within(section).getByText('Dati aggiornati ogni giorno')).toBeVisible()
    expect(within(section).queryByRole('button')).not.toBeInTheDocument()
    expect(within(section).queryByRole('link')).not.toBeInTheDocument()
  })

  it('gives multiple cards distinct accessible heading associations', () => {
    render(
      <ThemeProvider theme={theme}>
        <CardDashboard heading="Prima" content={{ kind: 'empty', message: 'Primo messaggio' }} />
        <CardDashboard
          heading="Seconda"
          content={{ kind: 'empty', message: 'Secondo messaggio' }}
        />
      </ThemeProvider>
    )

    const first = screen.getByRole('region', { name: 'Prima' })
    const second = screen.getByRole('region', { name: 'Seconda' })
    expect(first.getAttribute('aria-labelledby')).not.toBe(second.getAttribute('aria-labelledby'))
    expect(within(first).getByText('Primo messaggio')).toBeVisible()
    expect(within(second).getByText('Secondo messaggio')).toBeVisible()
  })

  it('keeps content visible and wrapping while defining mobile and desktop card styles', () => {
    renderCard({
      heading: 'Un titolo molto lungo per la dashboard',
      subtitle: 'Un sottotitolo completo',
      footer: 'Informazioni aggiuntive',
      content: { kind: 'metric', metric: { value: 12200, label: 'E-service disponibili' } },
      action: { type: 'link', text: 'Catalogo' },
    })

    const section = screen.getByRole('region', { name: 'Un titolo molto lungo per la dashboard' })
    expect(section).toBeVisible()
    expect(screen.getByText('12.200').parentElement).toHaveStyle({ flexWrap: 'wrap' })
    for (const text of [
      'Un sottotitolo completo',
      'Informazioni aggiuntive',
      '12.200',
      'E-service disponibili',
      'Catalogo',
    ]) {
      expect(within(section).getByText(text)).toBeVisible()
    }
    const rules = Array.from(document.styleSheets).flatMap((sheet) => Array.from(sheet.cssRules))
    const cardRules = rules
      .filter((rule): rule is CSSStyleRule => rule.type === CSSRule.STYLE_RULE)
      .filter((rule) => !rule.selectorText.includes('::') && section.matches(rule.selectorText))
    for (const [property, value] of Object.entries({
      display: 'flex',
      'flex-direction': 'column',
      'min-width': '0',
      'overflow-wrap': 'anywhere',
    })) {
      expect(cardRules.some((rule) => rule.style.getPropertyValue(property) === value)).toBe(true)
    }
    const mediaRules = rules.filter(
      (rule): rule is CSSMediaRule => rule.type === CSSRule.MEDIA_RULE
    )
    const mobileRules = mediaRules
      .filter((rule) => rule.conditionText === '(min-width:0px)')
      .flatMap((rule) => Array.from(rule.cssRules))
      .filter((rule): rule is CSSStyleRule => rule.type === CSSRule.STYLE_RULE)
      .filter((rule) => !rule.selectorText.includes('::') && section.matches(rule.selectorText))
    expect(mobileRules.some((rule) => rule.style.getPropertyValue('min-height') === 'auto')).toBe(
      true
    )
    const desktopRules = mediaRules
      .filter((rule) => rule.conditionText === '(min-width:600px)')
      .flatMap((rule) => Array.from(rule.cssRules))
      .filter((rule): rule is CSSStyleRule => rule.type === CSSRule.STYLE_RULE)
      .filter((rule) => !rule.selectorText.includes('::') && section.matches(rule.selectorText))
    expect(desktopRules.length).toBeGreaterThan(0)
    expect(desktopRules.some((rule) => rule.style.getPropertyValue('min-height') === '365px')).toBe(
      true
    )
    desktopRules.forEach((rule) => {
      expect(rule.style.getPropertyValue('display')).not.toBe('none')
      expect(rule.style.getPropertyValue('visibility')).not.toBe('hidden')
    })
  })
})
