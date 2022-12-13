import { EServiceCatalog } from '@/types/eservice.types'
import { Grid } from '@mui/material'
import React from 'react'
import { CatalogCard, CatalogCardSkeleton } from './CatalogCard'

type EServiceCatalogGridProps = {
  eservices: Array<EServiceCatalog> | undefined
}

export const EServiceCatalogGrid: React.FC<EServiceCatalogGridProps> = ({ eservices }) => {
  return (
    <>
      <Grid container spacing={3}>
        {eservices?.map((eservice) => (
          <Grid item key={eservice.id} xs={4}>
            <CatalogCard key={eservice.activeDescriptor.id} eservice={eservice} />
          </Grid>
        ))}
      </Grid>
    </>
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
