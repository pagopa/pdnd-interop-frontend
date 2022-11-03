import { EServiceQueries } from '@/api/eservice'
import { useJwt } from '@/hooks/useJwt'
import { Grid } from '@mui/material'
import React from 'react'
import { CatalogCard, CatalogCardSkeleton } from './CatalogCard'

export const EServiceCatalogGrid: React.FC = () => {
  const { jwt } = useJwt()
  const { data: eservices } = EServiceQueries.useGetListFlat({
    state: 'PUBLISHED',
    callerId: jwt?.organizationId,
  })

  return (
    <Grid container spacing={3}>
      {eservices?.map((eservice) => (
        <Grid item key={eservice.id} xs={4}>
          <CatalogCard key={eservice?.descriptorId || eservice.id} eservice={eservice} />
        </Grid>
      ))}
    </Grid>
  )
}

export const EServiceCatalogGridSkeleton: React.FC = () => {
  return (
    <Grid container spacing={3}>
      {new Array(7).fill('').map((_, i) => (
        <Grid key={i} xs={4} item>
          <CatalogCardSkeleton />
        </Grid>
      ))}
    </Grid>
  )
}
