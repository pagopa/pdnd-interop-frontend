import { Grid, Alert } from '@mui/material'
import React from 'react'
import { CatalogCard, CatalogCardSkeleton } from './CatalogCard'
import { useTranslation } from 'react-i18next'
import type { CatalogEService } from '@/api/api.generatedTypes'
import { STAGE } from '@/config/env'

type EServiceCatalogGridProps = {
  eservices: Array<CatalogEService> | undefined
}

export const EServiceCatalogGrid: React.FC<EServiceCatalogGridProps> = ({ eservices }) => {
  const { t } = useTranslation('shared-components', { keyPrefix: 'table' })

  const isEmpty = !eservices || eservices.length === 0

  const shEservicesAtt = ['9b6993ee-60e3-4901-9a32-e6987d690ec4'] //signal hub eservices to hide
  const shEservicesUat = [
    //signal hub eservices to hide
    '7ab0a0fc-7d22-4007-b2f3-fddd68fe2f17',
    'e8c087eb-627b-4488-a9b7-65b70fd1301b',
    '407edf51-23b5-462b-af6e-128bbaa4d9ff',
    '3b0fbe47-2e2c-4d8b-9cff-b2381c92d003',
    '260e45e1-9a61-49d6-8b6d-da0643da68ac',
    'a2b84a6e-34cf-44ca-85a4-de21fd232668',
    '6b14c622-dad2-44ea-82bc-2dd4010364d5',
    '03c34a8a-a79a-4928-9afc-8647eefabdb1',
  ]

  if (isEmpty) return <Alert severity="info">{t('noDataLabel')}</Alert>

  return (
    <Grid container spacing={3}>
      {eservices?.map((eservice) => (
        <Grid item key={eservice.id} xs={4}>
          {(STAGE === 'ATT' &&
            shEservicesAtt.some((shEservice) => shEservice === eservice.activeDescriptor?.id)) ||
          (STAGE === 'UAT' &&
            shEservicesUat.some((shEservice) => shEservice === eservice.activeDescriptor?.id)) ? (
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
