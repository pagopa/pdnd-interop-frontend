import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { Box, Stack, Typography } from '@mui/material'
import type { MIPaginationProps } from '@pagopa/mui-italia'
import { MIIconButton, MITable, theme, type MITableColumn } from '@pagopa/mui-italia'
import { useTranslation } from 'react-i18next'
import type {
  ProducerEServiceMonitoringArchivingAgreements,
  ProducerEServiceMonitoringArchivingAgreementsItem,
} from '@/api/api.generatedTypes'
import { useNavigate } from '@/router'
import { NoItemResults } from '@/components/shared/NoItemResults/NoItemResults'
import { ErrorIcon } from '@/icons/ErrorIcon'
import { StatusChip } from '@/components/shared/StatusChip'

type ProviderEServiceMonitoringArchivingVersionsConsumersTableProps = {
  data: ProducerEServiceMonitoringArchivingAgreements | undefined
  isPending: boolean
  isFetching: boolean
  paginationProps?: MIPaginationProps
}

/** Versions of consumers of the e-service being archived */
export function ProviderEServiceMonitoringArchivingVersionsConsumersTable({
  data,
  isPending,
  isFetching,
  paginationProps,
}: Readonly<ProviderEServiceMonitoringArchivingVersionsConsumersTableProps>) {
  const { t } = useTranslation('eservice', {
    keyPrefix: 'read.monitoring.archiving',
  })
  const { t: tShared } = useTranslation('shared-components', { keyPrefix: 'table' })
  const navigate = useNavigate()

  const isEmpty = !isPending && (!data?.results || data.results.length === 0)

  const columns: MITableColumn<ProducerEServiceMonitoringArchivingAgreementsItem>[] = [
    {
      id: 'consumer',
      header: t('archivingVersionConsumersPage.table.consumer'),
      renderCell: (row) => (
        <Typography component="span" variant="body2">
          {row.consumer.name}
        </Typography>
      ),
    },
    {
      id: 'agreementState',
      header: t('archivingVersionConsumersPage.table.agreementState'),
      renderCell: (row) => <StatusChip for="agreementState" state={row.agreement.state} />,
    },
    {
      id: 'submittedAt',
      header: t('archivingVersionConsumersPage.table.submittedAt'),
      renderCell: (row) => (
        <Typography component="span" variant="body2">
          {row.submittedAt}
        </Typography>
      ),
    },
    {
      id: 'actions',
      header: '',
      isAction: true,
      renderCell: (row) => {
        return (
          <MIIconButton
            aria-label={'todo'}
            disabled={!row.agreement.id}
            onClick={
              row.agreement.id
                ? () =>
                    navigate('PROVIDE_AGREEMENT_READ', {
                      params: { agreementId: row.agreement.id },
                    })
                : undefined
            }
          >
            <ChevronRightIcon />
          </MIIconButton>
        )
      },
    },
  ]

  if (isEmpty) {
    return (
      <NoItemResults padding={1} borderRadius={0}>
        <Stack role="status" aria-live="polite" alignItems="center" sx={{ p: 1 }} spacing={1}>
          <ErrorIcon />
          <Stack alignItems="center">
            <Typography
              variant="body2"
              sx={{
                fontWeight: theme.typography.fontWeightMedium,
                color: theme.colors.neutral.grey[650],
              }}
            >
              {tShared('noResultsTitle')}
            </Typography>
            <Typography variant="caption" sx={{ color: theme.colors.neutral.grey[650] }}>
              {tShared('noResultsDescription')}
            </Typography>
          </Stack>
        </Stack>
      </NoItemResults>
    )
  }

  return (
    <Box
      sx={{ mt: 3 }}
      aria-busy={isFetching}
      role={isPending ? 'status' : undefined}
      aria-label={isPending ? t('loading') : undefined}
    >
      <MITable
        columns={columns}
        rows={data?.results ?? []}
        isLoading={isPending}
        getRowId={(row, index) => `${row.consumer.id ?? 'consumer'}-${index}`}
        desktopTableProps={{ 'aria-label': t('title'), 'aria-busy': isFetching }}
        mobileTableProps={{ 'aria-label': t('title'), 'aria-busy': isFetching }}
        pagination={paginationProps}
      />
      {!isPending && data?.results.length === 0 && <Typography>{t('empty')}</Typography>}
    </Box>
  )
}
