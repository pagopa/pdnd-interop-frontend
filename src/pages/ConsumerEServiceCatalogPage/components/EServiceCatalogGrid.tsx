import { EServiceQueries } from '@/api/eservice'
import { Grid } from '@mui/material'
import React from 'react'
import { CatalogCard, CatalogCardSkeleton } from './CatalogCard'

export const EServiceCatalogGrid: React.FC = () => {
  const { data } = EServiceQueries.useGetCatalogList({
    states: ['PUBLISHED'],
    offset: 0,
    limit: 50,
  })

  return (
    <Grid container spacing={3}>
      {data?.eservices.map((eservice) => (
        <Grid item key={eservice.id} xs={4}>
          <CatalogCard key={eservice.activeDescriptor.id} eservice={eservice} />
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
