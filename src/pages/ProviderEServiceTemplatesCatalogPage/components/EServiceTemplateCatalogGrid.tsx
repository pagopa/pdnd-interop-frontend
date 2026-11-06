import { Grid, Alert } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import type { CatalogEServiceTemplate } from '@/api/api.generatedTypes'
import { useQueryClient } from '@tanstack/react-query'
import { EServiceTemplateQueries } from '@/api/eserviceTemplate'
import { PREFETCH_STALE_TIME } from '@/config/constants'
import { AVATAR_BASEPATH } from '@/config/env'
import { EServiceTemplateCatalogCard } from '@/components/shared/EServiceTemplateCatalogCard'

type EServiceTemplateCatalogGridProps = {
  eservicesTemplateList: Array<CatalogEServiceTemplate> | undefined
}

export const EServiceTemplateCatalogGrid: React.FC<EServiceTemplateCatalogGridProps> = ({
  eservicesTemplateList,
}) => {
  const { t } = useTranslation('shared-components', { keyPrefix: 'table' })

  const queryClient = useQueryClient()

  const isEmpty = !eservicesTemplateList || eservicesTemplateList.length === 0

  if (isEmpty) return <Alert severity="info">{t('noDataLabel')}</Alert>

  return (
    <Grid container spacing={3}>
      {eservicesTemplateList?.map((eserviceTemplate) => (
        <Grid item key={eserviceTemplate.id} xs={12} sm={4}>
          <EServiceTemplateCatalogCard
            key={eserviceTemplate.id}
            producerName={eserviceTemplate.creator.name}
            description={eserviceTemplate.description}
            title={eserviceTemplate.name}
            avatarURL={
              eserviceTemplate.creator.selfcareId
                ? `${AVATAR_BASEPATH}/institutions/${eserviceTemplate.creator.selfcareId}/logo.png`
                : undefined
            }
            prefetchFn={() => {
              if (!eserviceTemplate.publishedVersion.id) return
              queryClient.prefetchQuery({
                ...EServiceTemplateQueries.getSingle(
                  eserviceTemplate.id,
                  eserviceTemplate.publishedVersion.id
                ),
                staleTime: PREFETCH_STALE_TIME,
              })
            }}
            params={{
              eServiceTemplateVersionId: eserviceTemplate.publishedVersion.id,
              eServiceTemplateId: eserviceTemplate.id,
            }}
          />
        </Grid>
      ))}
    </Grid>
  )
}
