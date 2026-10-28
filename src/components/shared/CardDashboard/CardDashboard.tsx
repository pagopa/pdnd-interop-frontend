import { useId } from 'react'
import { Box, Card, Stack, Typography, useTheme } from '@mui/material'
import { MIButton } from '@pagopa/mui-italia'
import Add from '@mui/icons-material/Add'
import ArrowForward from '@mui/icons-material/ArrowForward'
import CheckRounded from '@mui/icons-material/CheckRounded'
import { PieChart } from '@mui/x-charts/PieChart'

export type CardDashboardMetric = {
  value: number
  label: string
}

export type CardDashboardStatus = {
  id: string
  label: string
  count: number
  color: string
}

export type CardDashboardContent =
  | { kind: 'metric'; metric: CardDashboardMetric }
  | { kind: 'metrics'; metrics: readonly (CardDashboardMetric & { id: string })[] }
  | { kind: 'status'; statuses: readonly CardDashboardStatus[]; totalLabel: string }
  | { kind: 'consumption'; used: number; limit: number; unitLabel: string }
  | { kind: 'empty'; message: string; icon?: 'success' }

export type CardDashboardAction = {
  type: 'primary' | 'link'
  text: string
  action?: () => void
}

export type CardDashboardProps = {
  heading: string
  subtitle?: string
  locale?: string
  content: CardDashboardContent
  action?: CardDashboardAction
  footer?: string
}

type DashboardDonutProps = {
  data: { id: string; value: number; color: string }[]
  label: string
}

function DashboardDonut({ data, label }: Readonly<DashboardDonutProps>) {
  const theme = useTheme()
  const hasValues = data.some((item) => item.value > 0)

  return (
    <Box role="img" aria-label={label} sx={{ width: 60, height: 60, flexShrink: 0 }}>
      <Box aria-hidden="true">
        <PieChart
          width={60}
          height={60}
          margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
          series={[
            {
              data: hasValues ? data : [{ id: 'empty', value: 1, color: theme.palette.grey[200] }],
              innerRadius: 16,
              outerRadius: 30,
              paddingAngle: 0,
              cornerRadius: 0,
            },
          ]}
          slotProps={{ legend: { hidden: true } }}
          tooltip={{ trigger: 'none' }}
          skipAnimation
        />
      </Box>
    </Box>
  )
}

export function CardDashboard({
  heading,
  subtitle,
  locale = 'it-IT',
  content,
  action,
  footer,
}: Readonly<CardDashboardProps>) {
  const headingId = useId()
  const theme = useTheme()
  const numberFormatter = new Intl.NumberFormat(locale, { maximumFractionDigits: 1 })
  const valueStyles = {
    fontSize: 48,
    fontWeight: 'bold',
    lineHeight: 1.15,
    overflowWrap: 'anywhere',
    fontVariantNumeric: 'tabular-nums',
  } as const

  let mainMetric: { value: string; label?: string } | undefined
  let donutProps: DashboardDonutProps | undefined
  let amount: string | undefined

  if (content.kind === 'metric') {
    mainMetric = {
      value: numberFormatter.format(content.metric.value),
      label: content.metric.label,
    }
  }

  if (content.kind === 'status') {
    const total = numberFormatter.format(
      content.statuses.reduce((sum, status) => sum + status.count, 0)
    )
    mainMetric = { value: total, label: content.totalLabel }
    donutProps = {
      label: `${content.totalLabel}: ${total}`,
      data: content.statuses.map((status) => ({
        id: status.id,
        value: status.count,
        color: status.color,
      })),
    }
  }

  if (content.kind === 'consumption') {
    const ratio = content.limit > 0 ? content.used / content.limit : 0
    const visualRatio = Math.min(1, Math.max(0, ratio))
    const percentage = new Intl.NumberFormat(locale, {
      style: 'percent',
      maximumFractionDigits: 0,
    }).format(ratio)
    amount = `${numberFormatter.format(content.used)} / ${numberFormatter.format(content.limit)}`
    mainMetric = { value: percentage }
    donutProps = {
      label: `${percentage}; ${amount} ${content.unitLabel}`,
      data: [
        { id: 'used', value: visualRatio, color: theme.palette.primary.main },
        { id: 'remaining', value: 1 - visualRatio, color: theme.palette.grey[200] },
      ],
    }
  }

  return (
    <Card
      component="section"
      aria-labelledby={headingId}
      elevation={8}
      sx={{
        height: '100%',
        minHeight: { xs: 'auto', sm: 300 },
        minWidth: 0,
        py: '1.25rem',
        px: '1rem',
        borderRadius: '8px',
        bgcolor: 'background.paper',
        display: 'flex',
        flexDirection: 'column',
        overflowWrap: 'anywhere',
        letterSpacing: 0,
      }}
    >
      <Typography id={headingId} component="h3" sx={{ fontSize: 18, fontWeight: 600 }}>
        {heading}
      </Typography>
      {subtitle && (
        <Typography color="text.secondary" sx={{ mt: 1 }}>
          {subtitle}
        </Typography>
      )}
      <Box sx={{ mt: 3, minWidth: 0 }}>
        <Stack spacing={content.kind === 'consumption' ? 2 : 3}>
          {mainMetric !== undefined && (
            <Box
              sx={
                donutProps && {
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  gap: 3,
                }
              }
            >
              {donutProps && <DashboardDonut {...donutProps} />}
              {content.kind === 'consumption' ? (
                <Typography component="p" sx={{ ...valueStyles, flex: '1 1 100px', minWidth: 0 }}>
                  {mainMetric.value}
                </Typography>
              ) : (
                <Box
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'baseline',
                    gap: 1,
                    ...(donutProps && { flex: '1 1 100px', minWidth: 0 }),
                  }}
                >
                  <Typography component="p" sx={valueStyles}>
                    {mainMetric.value}
                  </Typography>
                  <Typography
                    color="text.secondary"
                    sx={{ minWidth: 0, fontSize: 16, fontWeight: 600 }}
                  >
                    {mainMetric.label}
                  </Typography>
                </Box>
              )}
            </Box>
          )}
          {content.kind === 'metrics' &&
            content.metrics.map((metric) => (
              <Box
                key={metric.id}
                sx={{
                  display: 'flex',
                  flexWrap: 'nowrap',
                  alignItems: 'center',
                  gap: 1,
                  minWidth: 0,
                }}
              >
                <Typography
                  component="p"
                  sx={{ ...valueStyles, fontSize: '2.25rem', flexShrink: 0, whiteSpace: 'nowrap' }}
                >
                  {numberFormatter.format(metric.value)}
                </Typography>
                <Typography
                  color="text.secondary"
                  sx={{
                    flex: '1 1 0',
                    minWidth: 0,
                    overflowWrap: 'anywhere',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                  }}
                >
                  {metric.label}
                </Typography>
              </Box>
            ))}
          {content.kind === 'status' && (
            <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0 }}>
              {content.statuses.map((status) => (
                <Box
                  component="li"
                  key={status.id}
                  sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 0.5, minWidth: 0 }}
                >
                  <Box
                    aria-hidden="true"
                    sx={{
                      width: 16,
                      height: 16,
                      borderRadius: '50%',
                      bgcolor: status.color,
                      flexShrink: 0,
                    }}
                  />
                  <Typography
                    color="text.secondary"
                    sx={{ minWidth: 0, textTransform: 'uppercase', fontSize: 14 }}
                  >
                    {status.label}
                  </Typography>
                  <Typography
                    sx={{ minWidth: 0, overflowWrap: 'anywhere', fontSize: 14, fontWeight: 600 }}
                  >
                    {numberFormatter.format(status.count)}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
          {content.kind === 'consumption' && (
            <Box>
              <Typography sx={{ fontWeight: 600 }}>{amount}</Typography>
              <Typography color="text.secondary">{content.unitLabel}</Typography>
            </Box>
          )}
          {content.kind === 'empty' && (
            <Stack direction="row" spacing={2} alignItems="center" sx={{ minWidth: 0 }}>
              {content.icon === 'success' && (
                <Box
                  aria-hidden="true"
                  sx={{
                    width: 36,
                    height: 36,
                    bgcolor: '#CED8F9',
                    borderRadius: '50%',
                    color: 'primary.main',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <CheckRounded sx={{ fontSize: 24 }} />
                </Box>
              )}
              <Typography color="text.secondary" sx={{ minWidth: 0 }}>
                {content.message}
              </Typography>
            </Stack>
          )}
        </Stack>
      </Box>
      {(footer || action) && (
        <Stack spacing={2} alignItems="flex-start" sx={{ mt: 'auto', pt: '24px', minWidth: 0 }}>
          {footer && <Typography color="text.secondary">{footer}</Typography>}
          {action && (
            <MIButton
              type="button"
              variant={action.type === 'primary' ? 'contained' : 'text'}
              color="primary"
              startIcon={action.type === 'primary' ? <Add /> : undefined}
              endIcon={action.type === 'link' ? <ArrowForward /> : undefined}
              onClick={action.action}
            >
              {action.text}
            </MIButton>
          )}
        </Stack>
      )}
    </Card>
  )
}
