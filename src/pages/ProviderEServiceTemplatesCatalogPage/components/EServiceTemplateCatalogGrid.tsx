import { Grid, Alert } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import type { CatalogEServiceTemplate } from '@/api/api.generatedTypes'
import { CatalogCard, CatalogCardSkeleton } from '@/components/shared/CatalogCard'
import { useQueryClient } from '@tanstack/react-query'
import { TemplateQueries } from '@/api/template'

type EServiceTemplateCatalogGridProps = {
  eservicesTemplateList: Array<CatalogEServiceTemplate> | undefined
}

export const EServiceTemplateCatalogGrid: React.FC<EServiceTemplateCatalogGridProps> = ({
  eservicesTemplateList,
}) => {
  const { t } = useTranslation('shared-components', { keyPrefix: 'table' })

  const isEmpty = !eservicesTemplateList || eservicesTemplateList.length === 0

  if (isEmpty) return <Alert severity="info">{t('noDataLabel')}</Alert>

  return (
    <Grid container spacing={3}>
      {eservicesTemplateList?.map((eserviceTemplate) => (
        <Grid item key={eserviceTemplate.id} xs={4}>
          <EServiceTemplateCatalogCard eserviceTemplate={eserviceTemplate} />
        </Grid>
      ))}
    </Grid>
  )
}

export const EServiceTemplateCatalogCard: React.FC<{
  eserviceTemplate: CatalogEServiceTemplate
}> = ({ eserviceTemplate }) => {
  const queryClient = useQueryClient()

  const { id: eServiceTemplateVersionId, publishedVersion } = eserviceTemplate

  const handlePrefetch = () => {
    if (!eserviceTemplate.publishedVersion.id) return
    queryClient.prefetchQuery(
      TemplateQueries.getSingle(publishedVersion.id, eServiceTemplateVersionId)
    )
  }
  return (
    <CatalogCard
      key={eserviceTemplate.id}
      producerName={eserviceTemplate.creator.name}
      description={eserviceTemplate.description}
      title={eserviceTemplate.name}
      handlePrefetch={handlePrefetch}
      to="SUBSCRIBE_ESERVICE_TEMPLATE_DETAILS"
      params={{
        eServiceTemplateVersionId: eserviceTemplate.id,
        eServiceTemplateId: eserviceTemplate.publishedVersion.id,
      }}
    />
  )
}

export const EServiceTemplateCatalogGridSkeletron: React.FC = () => {
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
