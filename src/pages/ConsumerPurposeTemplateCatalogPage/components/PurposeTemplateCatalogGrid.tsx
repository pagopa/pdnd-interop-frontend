import { Grid, Alert } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import type { CatalogPurposeTemplate } from '@/api/api.generatedTypes'
import { useQueryClient } from '@tanstack/react-query'
import { PurposeTemplateQueries } from '@/api/purposeTemplate/purposeTemplate.queries'
import {
  CatalogCardForPurposeTemplate,
  CatalogCardForPurposeTemplateSkeleton,
} from './CatalogCardForPurposeTemplate'

type PurposeTemplateGridProps = { purposeTemplates: Array<CatalogPurposeTemplate> | undefined }

export const PurposeTemplateCatalogGrid: React.FC<PurposeTemplateGridProps> = ({
  purposeTemplates,
}) => {
  const { t } = useTranslation('shared-components', { keyPrefix: 'table' })

  const isEmpty = !purposeTemplates || purposeTemplates.length === 0

  if (isEmpty) return <Alert severity="info">{t('noDataLabel')}</Alert>

  return (
    <Grid container spacing={3}>
      {purposeTemplates?.map((purposeTemplate) => (
        <Grid item key={purposeTemplate.id} xs={6} md={6}>
          <PurposeTemplateCatalogCard key={purposeTemplate.id} purposeTemplate={purposeTemplate} />
        </Grid>
      ))}
    </Grid>
  )
}

export const PurposeTemplateCatalogCard: React.FC<{
  purposeTemplate: CatalogPurposeTemplate
}> = ({ purposeTemplate }) => {
  const queryClient = useQueryClient()

  const { id: purposeTemplateId } = purposeTemplate

  const handlePrefetch = () => {
    if (!purposeTemplate) return
    queryClient.prefetchQuery(PurposeTemplateQueries.getSingle(purposeTemplateId))
  }
  return (
    <CatalogCardForPurposeTemplate
      key={purposeTemplate.id}
      creatorName={purposeTemplate.creator.name}
      description={purposeTemplate.purposeDescription}
      title={purposeTemplate.purposeTitle}
      targetTenantKind={purposeTemplate.targetTenantKind}
      prefetchFn={handlePrefetch}
      to="NOT_FOUND" //TODO: change when the route will be available
      params={undefined}
      // to="SUBSCRIBE_PURPOSE_TEMPLATE_CATALOG_DETAILS"
      // params={{ purposeTemplateId: purposeTemplateId }}
    />
  )
}

export const PurposeTemplateCatalogGridSkeleton: React.FC = () => {
  return (
    <Grid container spacing={3}>
      {new Array(9).fill('').map((_, i) => (
        <Grid key={i} xs={6} md={6} item>
          <CatalogCardForPurposeTemplateSkeleton />
        </Grid>
      ))}
    </Grid>
  )
}
