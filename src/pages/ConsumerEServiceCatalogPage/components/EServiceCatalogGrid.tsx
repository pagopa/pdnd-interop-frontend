import { Grid, Alert } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import type { CatalogEService } from '@/api/api.generatedTypes'
import { PREFETCH_STALE_TIME, SH_ESERVICES_TO_HIDE_TEMP } from '@/config/constants'
import { EServiceQueries } from '@/api/eservice'
import { EServiceCatalogCard, EServiceCatalogCardSkeleton } from '@/components/EServiceCatalogCard'
import { queryClient } from '@/config/query-client'
import { STAGE } from '@/config/env'

type EServiceCatalogGridProps = { eservices: Array<CatalogEService> | undefined }

export const EServiceCatalogGrid: React.FC<EServiceCatalogGridProps> = ({ eservices }) => {
  const { t } = useTranslation('shared-components', { keyPrefix: 'table' })

  const isEmpty = !eservices || eservices.length === 0

  if (isEmpty) return <Alert severity="info">{t('noDataLabel')}</Alert>

  const handlePrefetch = (eservice: CatalogEService) => {
    if (!eservice.activeDescriptor) return
    queryClient.prefetchQuery({
      ...EServiceQueries.getDescriptorCatalog(eservice.id, eservice.activeDescriptor.id),
      staleTime: PREFETCH_STALE_TIME,
    })
  }

  return (
    <Grid container spacing={3}>
      {eservices?.map((eservice) => (
        <Grid item key={eservice.id} xs={12} sm={4}>
          <EServiceCatalogCard
            key={eservice.activeDescriptor?.id}
            eservice={eservice}
            disabled={!!SH_ESERVICES_TO_HIDE_TEMP[STAGE]?.includes(eservice.id)}
            prefetchFn={() => handlePrefetch(eservice)}
          />
        </Grid>
      ))}
    </Grid>
  )
}

export const EServiceCatalogGridSkeleton: React.FC = () => {
  return (
    <Grid container spacing={3}>
      {new Array(9).fill('').map((_, i) => (
        <Grid key={i} xs={12} sm={4} item>
          <EServiceCatalogCardSkeleton />
        </Grid>
      ))}
    </Grid>
  )
}
