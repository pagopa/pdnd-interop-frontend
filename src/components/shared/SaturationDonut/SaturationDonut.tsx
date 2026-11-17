import { Box, Stack, Typography, useTheme } from '@mui/material'
import { ChartContainer } from '@mui/x-charts/ChartContainer'
import { PiePlot } from '@mui/x-charts/PieChart'

/** The chart is decorative; the text always shows the original, unbounded value. */
export function SaturationDonut({ percentage, label }: { percentage: number; label: string }) {
  const theme = useTheme()
  const used = Math.min(100, Math.max(0, percentage))
  const color =
    percentage >= 90
      ? theme.colors.error[600]
      : percentage >= 70
        ? theme.colors.warning[500]
        : theme.colors.success[500]

  return (
    <Stack component="span" direction="row" spacing={1} alignItems="center">
      <Box component="span" aria-hidden="true" sx={{ width: 20, height: 20, flexShrink: 0 }}>
        <ChartContainer
          width={20}
          height={20}
          margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
          series={[
            {
              type: 'pie',
              data: [
                { id: 'used', value: used, color },
                { id: 'remaining', value: 100 - used, color: theme.palette.grey[200] },
              ],
              innerRadius: 6.4,
              outerRadius: 10,
            },
          ]}
          sx={{ '& .MuiPieArc-root': { stroke: 'none' } }}
          disableAxisListener
          skipAnimation
        >
          <PiePlot />
        </ChartContainer>
      </Box>
      <Typography variant="body2" component="span">
        {label}
      </Typography>
    </Stack>
  )
}
