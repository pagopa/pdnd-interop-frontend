import { Alert, Stack, Typography } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { match } from 'ts-pattern'
import { PurposeTemplateQueries } from '@/api/purposeTemplate/purposeTemplate.queries'
import { SectionContainer } from '@/components/layout/containers'
import { Link } from '@/router'
import { NotFoundError } from '@/utils/errors.utils'
import { viewLinkableResource } from '@/utils/purposeTemplate.utils'

type PurposeTemplateSummaryLinkedResourceAccordionProps = {
  purposeTemplateId: string
}

export const PurposeTemplateSummaryLinkedResourceAccordion: React.FC<
  PurposeTemplateSummaryLinkedResourceAccordionProps
> = ({ purposeTemplateId }) => {
  const { t } = useTranslation('purposeTemplate', {
    keyPrefix: 'edit.summary.suggestedResourcesSection',
  })

  const { data: linkableResources, error } = useQuery({
    ...PurposeTemplateQueries.getLinkableResources(purposeTemplateId, { offset: 0, limit: 50 }),
    enabled: Boolean(purposeTemplateId),
  })

  const results = linkableResources?.results ?? []

  return (
    <Stack spacing={2}>
      <SectionContainer innerSection>
        <Stack spacing={2}>
          {error instanceof NotFoundError ? (
            <Alert severity="warning">{t('orphanLinkedResources')}</Alert>
          ) : results.length > 0 ? (
            results.map((resource) => {
              const view = viewLinkableResource(resource)
              const providedByKey =
                view.kind === 'ESERVICE'
                  ? 'providedBy.eservice'
                  : 'providedBy.eserviceTemplate'
              return (
                <Typography key={`${view.kind}:${view.id}`} sx={{ fontWeight: 600 }}>
                  {match(resource)
                    .with({ resourceKind: 'ESERVICE' }, (r) => (
                      <Link
                        underline="none"
                        to="SUBSCRIBE_CATALOG_VIEW"
                        params={{
                          eserviceId: r.eservice.id,
                          descriptorId: r.descriptor.id,
                        }}
                      >
                        {view.name}
                      </Link>
                    ))
                    .with({ resourceKind: 'ESERVICE_TEMPLATE' }, (r) => (
                      <Link
                        underline="none"
                        to="SUBSCRIBE_ESERVICE_TEMPLATE_DETAILS"
                        params={{
                          eServiceTemplateId: r.eserviceTemplate.id,
                          eServiceTemplateVersionId: r.eserviceTemplateVersion.id,
                        }}
                      >
                        {view.name}
                      </Link>
                    ))
                    .exhaustive()}
                  {' - '}
                  {t(providedByKey, { publisher: view.publisherName })}
                </Typography>
              )
            })
          ) : (
            <Typography variant="body2" color="text.secondary">
              {t('noLinkedResources')}
            </Typography>
          )}
        </Stack>
      </SectionContainer>
    </Stack>
  )
}
