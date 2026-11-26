import { Alert, Box, Button, Grid, Skeleton } from '@mui/material'
import { useTranslation } from 'react-i18next'
import {
  CardDashboard,
  type CardDashboardProps,
} from '@/components/shared/CardDashboard/CardDashboard'

export type MonitoringCard = CardDashboardProps & { id: string }

type MonitoringCardsGridProps = {
  cards: MonitoringCard[] | undefined
  isPending: boolean
  isError: boolean
  isFetching: boolean
  onRetry: () => void
}

const CARDS_COUNT = 3

/** Same grid and card component as the provider dashboard, with explicit async states. */
export function MonitoringCardsGrid({
  cards,
  isPending,
  isError,
  isFetching,
  onRetry,
}: Readonly<MonitoringCardsGridProps>) {
  const { t } = useTranslation('eservice', { keyPrefix: 'read.monitoring.cards' })

  if (isError) {
    return (
      <Alert
        severity="error"
        sx={{ mt: 3 }}
        action={
          <Button color="inherit" size="small" onClick={onRetry} disabled={isFetching}>
            {t('retry')}
          </Button>
        }
      >
        {t('loadError')}
      </Alert>
    )
  }

  if (isPending || !cards) {
    return (
      <Box role="status" aria-label={t('loading')} sx={{ mt: 0 }}>
        <Grid container spacing={3} sx={{ mt: 0 }}>
          {Array.from({ length: CARDS_COUNT }, (_, index) => (
            <Grid item xs={12} sm={6} lg={4} key={index}>
              <Skeleton variant="rounded" height={300} />
            </Grid>
          ))}
        </Grid>
      </Box>
    )
  }

  return (
    <Grid container spacing={3} sx={{ mt: 0 }} aria-busy={isFetching}>
      {cards.map(({ id, ...card }) => (
        <Grid item xs={12} sm={6} lg={4} key={id}>
          <CardDashboard {...card} />
        </Grid>
      ))}
    </Grid>
  )
}
