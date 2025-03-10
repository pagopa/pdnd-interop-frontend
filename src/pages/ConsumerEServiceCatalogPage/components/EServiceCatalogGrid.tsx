import { Grid, Alert } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import type { CatalogEService } from '@/api/api.generatedTypes'
import { STAGE } from '@/config/env'
import { SH_ESERVICES_TO_HIDE_TEMP } from '@/config/constants'
import { useQueryClient } from '@tanstack/react-query'
import { EServiceQueries } from '@/api/eservice'
import { CatalogCard, CatalogCardSkeleton } from '@/components/shared/CatalogCard'

type EServiceCatalogGridProps = {
  eservices: Array<CatalogEService> | undefined
}

export const EServiceCatalogGrid: React.FC<EServiceCatalogGridProps> = ({ eservices }) => {
  const { t } = useTranslation('shared-components', { keyPrefix: 'table' })

  const isEmpty = !eservices || eservices.length === 0

  if (isEmpty) return <Alert severity="info">{t('noDataLabel')}</Alert>

  return (
    <Grid container spacing={3}>
      {eservices?.map((eservice) => (
        <Grid item key={eservice.id} xs={4}>
          <EServiceCatalogCard
            key={eservice.activeDescriptor?.id}
            eservice={eservice}
            disabled={!!SH_ESERVICES_TO_HIDE_TEMP[STAGE]?.includes(eservice.id)}
          />
        </Grid>
      ))}
    </Grid>
  )
}

export const EServiceCatalogCard: React.FC<{ eservice: CatalogEService; disabled: boolean }> = ({
  eservice,
  disabled,
}) => {
  const queryClient = useQueryClient()

  const { id: eServiceId, activeDescriptor } = eservice

  const handlePrefetch = () => {
    if (!activeDescriptor) return
    queryClient.prefetchQuery(EServiceQueries.getDescriptorCatalog(eServiceId, activeDescriptor.id))
  }
  return (
    <CatalogCard
      key={eservice.id}
      producerName={eservice.producer.name}
      description={eservice.description}
      title={eservice.name}
      handlePrefetch={handlePrefetch}
      to="SUBSCRIBE_CATALOG_VIEW"
      params={{
        eserviceId: eservice.id,
        descriptorId: activeDescriptor?.id ?? '',
      }}
      disabled={disabled}
    />
  )
}

export const EServiceCatalogGridSkeleton: React.FC = () => {
  return (
    <Grid container spacing={3}>
      {new Array(9).fill('').map((_, i) => (
        <Grid key={i} xs={4} item>
          <CatalogCardSkeleton />
        </Grid>
      ))}
    </Grid>
  )
}
