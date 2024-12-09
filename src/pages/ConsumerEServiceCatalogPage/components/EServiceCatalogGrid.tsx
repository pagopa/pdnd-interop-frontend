import { Grid, Alert } from '@mui/material'
import React from 'react'
import { CatalogCard, CatalogCardSkeleton } from './CatalogCard'
import { useTranslation } from 'react-i18next'
import type { CatalogEService } from '@/api/api.generatedTypes'
import { STAGE } from '@/config/env'
import { SH_ESERVICES_ATT_TEMP, SH_ESERVICES_UAT_TEMP } from '@/config/constants'

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
          {(STAGE === 'ATT' &&
            SH_ESERVICES_ATT_TEMP.some(
              (shEservice) => shEservice === eservice.activeDescriptor?.id
            )) ||
          (STAGE === 'UAT' &&
            SH_ESERVICES_UAT_TEMP.some(
              (shEservice) => shEservice === eservice.activeDescriptor?.id
            )) ? (
            <CatalogCard key={eservice.activeDescriptor?.id} eservice={eservice} disabled={true} />
          ) : (
            <CatalogCard key={eservice.activeDescriptor?.id} eservice={eservice} disabled={false} />
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
        <Grid key={i} xs={4} item>
          <CatalogCardSkeleton />
        </Grid>
      ))}
    </Grid>
  )
}
