import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined'
import { Box, Button, Grid, Skeleton, Stack, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { PageContainer } from '@/components/layout/containers'
import { FiltersSection } from '@/components/shared/Filters/FiltersSection'
import { useFilters } from '@/hooks/useFilters'
import { useNavigate } from '@/router'
import type { ActionItemButton } from '@/types/common.types'

export default function ProviderDashboardConsumerList() {
  const { t } = useTranslation('pages', { keyPrefix: 'providerDashboardConsumerList' })
  const navigate = useNavigate()
  const filtersHandlers = useFilters<{ q: string }>([
    { name: 'q', label: t('searchPlaceholder'), type: 'freetext' },
  ])

  const exportAction: ActionItemButton[] = [
    {
      action: () => undefined,
      label: t('export'),
      icon: FileDownloadOutlinedIcon,
      color: 'primary',
      variant: 'outlined',
    },
  ]

  return (
    <PageContainer title={t('title')} description={t('description')} topSideActions={exportAction}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '320px minmax(0, 1fr)' },
          alignItems: 'center',
          columnGap: 1,
          rowGap: 0.5,
          mt: 3,
        }}
      >
        <Typography component="span" variant="body1">
          {t('summary')}
        </Typography>
        <Typography component="span" variant="h4" sx={{ fontWeight: 700 }}>
          122
        </Typography>
      </Box>

      <FiltersSection {...filtersHandlers} showResults={false} />

      <Box role="img" aria-label={t('placeholders.results')} sx={{ mt: 3 }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          justifyContent="space-between"
          alignItems={{ sm: 'center' }}
        >
          <Skeleton variant="text" width={120} height={32} />
          <Skeleton variant="rounded" sx={{ width: { xs: '100%', sm: 240 } }} height={40} />
        </Stack>
      </Box>

      <Box role="img" aria-label={t('placeholders.table')} sx={{ mt: 2 }}>
        <Grid container spacing={2}>
          {Array.from({ length: 6 }, (_, rowIndex) => (
            <Grid container item spacing={2} key={rowIndex}>
              {Array.from({ length: 5 }, (_, columnIndex) => (
                <Grid item xs={6} md={columnIndex === 0 ? 4 : 2} key={columnIndex}>
                  <Skeleton
                    aria-hidden="true"
                    variant="rounded"
                    height={rowIndex === 0 ? 24 : 20}
                  />
                </Grid>
              ))}
            </Grid>
          ))}
        </Grid>
      </Box>

      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 2 }}
        onClick={() => navigate('PROVIDE_DASHBOARD_CONSUMER_DETAIL')}
      >
        {t('goToDetail')}
      </Button>
    </PageContainer>
  )
}
