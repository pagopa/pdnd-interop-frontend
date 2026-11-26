import type {
  GetCatalogPurposeTemplatesParams,
  TargetTenantKind,
  CatalogPurposeTemplates,
} from '@/api/api.generatedTypes'
import { EServiceQueries } from '@/api/eservice'
import { PurposeTemplateQueries } from '@/api/purposeTemplate/purposeTemplate.queries'
import { SectionContainer } from '@/components/layout/containers'
import { FiltersSection } from '@/components/shared/Filters/FiltersSection'
import { useFilters } from '@/hooks/useFilters'
import { usePagination } from '@/hooks/usePagination'
import { useParams, useNavigate } from '@/router'
import { useAutocompleteTextInput } from '@pagopa/interop-fe-commons'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { MITable as Table } from '@pagopa/mui-italia'
import { IconButton, Stack, Typography, useTheme } from '@mui/material'
import { NoItemResults } from '@/components/shared/NoItemResults/NoItemResults'
import { ErrorIcon } from '@/icons/ErrorIcon'
import { ChevronRight } from '@mui/icons-material'

const Recipient: TargetTenantKind[] = ['PA', 'PRIVATE']

const PurposeTemplatesTab = () => {
  const { t } = useTranslation('eservice', { keyPrefix: 'consumer.detail.purposeTemplates' })
  const navigate = useNavigate()

  const { eserviceId } = useParams<'SUBSCRIBE_CATALOG_VIEW'>()

  const [creatorsAutocompleteInput, setCreatorsAutocompleteInput] = useAutocompleteTextInput()

  const { data: creators = [] } = useQuery({
    ...EServiceQueries.getProducers({ offset: 0, limit: 50, q: creatorsAutocompleteInput }),
    placeholderData: keepPreviousData,
    select: (data) =>
      data.results.map((o) => ({
        label: o.name,
        value: o.id,
      })),
  })

  const { filters, ...handlers } = useFilters<
    Omit<GetCatalogPurposeTemplatesParams, 'limit' | 'offset' | 'eserviceIds'>
  >(
    [
      {
        name: 'q',
        label: t('filters.name.label'),
        type: 'freetext',
      },
      {
        name: 'creatorIds',
        label: t('filters.creator.label'),
        type: 'autocomplete-multiple',
        options: creators,
        onTextInputChange: setCreatorsAutocompleteInput,
      },
    ],
    [
      {
        title: '',
        fields: [
          {
            name: 'targetTenantKind',
            label: t('filters.recipient.label'),
            type: 'autocomplete-single',
            options: Recipient.map((r) => ({
              label: t(`filters.recipient.options.${r}`),
              value: r,
            })),
          },
        ],
      },
    ]
  )

  const { paginationParams, paginationProps, getTotalPageCount } = usePagination({
    limit: 10,
    limitOptions: [10, 24, 36],
  })

  // Ensure eserviceId is always present in query params
  const queryParams: GetCatalogPurposeTemplatesParams = {
    ...paginationParams,
    ...filters,
    eserviceIds: [eserviceId],
  }

  const { data, isFetching } = useQuery({
    ...PurposeTemplateQueries.getCatalogPurposeTemplates(queryParams),
    enabled: Boolean(eserviceId),
    placeholderData: keepPreviousData,
  })

  return (
    <SectionContainer
      sx={{
        backgroundColor: 'transparent',
      }}
      title={t('title')}
      description={t('description')}
    >
      <FiltersSection filters={filters} {...handlers} results={data?.pagination.totalCount} />
      {isFetching || (data && data.results.length > 0) ? (
        <Table
          columns={[
            {
              id: 'name',
              header: t('table.columns.name'),
              renderCell: (row) => row.purposeTitle,
            },
            {
              id: 'creator',
              header: t('table.columns.creator'),
              renderCell: (row) => row.creator.name,
            },
            {
              id: 'recipient',
              header: t('table.columns.recipient.label'),
              renderCell: (row) => t(`table.columns.recipient.value.${row.targetTenantKind}`),
            },
            {
              id: 'actions',
              header: '',
              renderCell: (row) => (
                <IconButton
                  aria-label={t('table.columns.actions.navigate', {
                    templateName: row.purposeTitle,
                  })}
                  onClick={() =>
                    navigate('SUBSCRIBE_PURPOSE_TEMPLATE_CATALOG_DETAILS', {
                      params: { purposeTemplateId: row.id },
                    })
                  }
                >
                  <ChevronRight />
                </IconButton>
              ),
            },
          ]}
          getRowId={(row) => row.id}
          rows={data?.results ?? []}
          pagination={{
            count: getTotalPageCount(data?.pagination.totalCount ?? 0),
            page: paginationProps.page,
            onChange: (_, page) => paginationProps.onPageChange(page),
            itemsPerPageOptions: paginationProps.itemsPerPageOptions,
          }}
        />
      ) : (
        <PurposeTemplatesEmpty />
      )}
    </SectionContainer>
  )
}

const PurposeTemplatesEmpty = () => {
  const theme = useTheme()

  const { t } = useTranslation('eservice', { keyPrefix: 'consumer.detail.purposeTemplates' })

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
            {t('empty.title')}
          </Typography>
          <Typography variant="caption" sx={{ color: theme.colors.neutral.grey[650] }}>
            {t('empty.description')}
          </Typography>
        </Stack>
      </Stack>
    </NoItemResults>
  )
}

export default PurposeTemplatesTab
