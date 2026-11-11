import { Grid, Typography } from '@mui/material'
import { useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Stack } from '@mui/material'
import type {
  CatalogQueryEService,
  CatalogQueryResult,
  CatalogQueryTemplateInstancesGroup,
} from '@/api/api.generatedTypes'
import { PREFETCH_STALE_TIME, SH_ESERVICES_TO_HIDE_TEMP } from '@/config/constants'
import { EServiceQueries } from '@/api/eservice'
import { AVATAR_BASEPATH, STAGE } from '@/config/env'
import { EServiceCatalogCard, EServiceCatalogCardSkeleton } from './EServiceCatalogCard'
import { NoItemResults } from '@/components/shared/NoItemResults/NoItemResults'
import { ErrorIcon } from '@/icons/ErrorIcon'
import { theme } from '@pagopa/mui-italia'
import { EServiceStackedCatalogCard } from './EServiceStackedCatalogCard'
import { EServiceTemplateQueries } from '@/api/eserviceTemplate'

type EServiceCatalogGridProps = { catalog: Array<CatalogQueryResult> | undefined }

export const EServiceCatalogGrid: React.FC<EServiceCatalogGridProps> = ({ catalog }) => {
  const { t } = useTranslation('shared-components', { keyPrefix: 'table' })
  const queryClient = useQueryClient()

  const isEmpty = !catalog || catalog.length === 0

  if (isEmpty)
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
              {t('noResultsTitle')}
            </Typography>
            <Typography variant="caption" sx={{ color: theme.colors.neutral.grey[650] }}>
              {t('noResultsDescription')}
            </Typography>
          </Stack>
        </Stack>
      </NoItemResults>
    )

  const handlePrefetchEService = (eservice: CatalogQueryEService) => {
    if (!eservice.activeDescriptor) return
    queryClient.prefetchQuery({
      ...EServiceQueries.getDescriptorCatalog(eservice.id, eservice.activeDescriptor.id),
      staleTime: PREFETCH_STALE_TIME,
    })
  }

  const handlePrefetchTemplate = (template: CatalogQueryTemplateInstancesGroup) => {
    queryClient.prefetchQuery({
      ...EServiceTemplateQueries.getSingleByEServiceTemplateId(template.id),
      staleTime: PREFETCH_STALE_TIME,
    })
  }

  return (
    <Grid container spacing={3}>
      {catalog?.map((catalogItem) => (
        <Grid item key={catalogItem.id} xs={12} md={4}>
          {catalogItem.resultType === 'eservice' && (
            <EServiceCatalogCard
              key={catalogItem.activeDescriptor?.id}
              eservice={catalogItem}
              disabled={!!SH_ESERVICES_TO_HIDE_TEMP[STAGE]?.includes(catalogItem.id)}
              prefetchFn={() => handlePrefetchEService(catalogItem)}
              avatarUrl={
                catalogItem.producer.selfcareId
                  ? `${AVATAR_BASEPATH}/institutions/${catalogItem.producer.selfcareId}/logo.png`
                  : undefined
              }
            />
          )}
          {catalogItem.resultType === 'template' && (
            <EServiceStackedCatalogCard
              templateInstancesGroup={catalogItem}
              disabled={false}
              prefetchFn={() => handlePrefetchTemplate(catalogItem)}
            />
          )}
        </Grid>
      ))}
    </Grid>
  )
}

export const EServiceCatalogGridSkeleton: React.FC = () => {
  return (
    <Grid container spacing={3}>
      {new Array(9).fill('').map((_, i) => (
        <Grid key={i} xs={12} md={4} item>
          <EServiceCatalogCardSkeleton />
        </Grid>
      ))}
    </Grid>
  )
}
