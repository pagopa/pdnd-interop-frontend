import { Alert, Stack, Typography } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { match } from 'ts-pattern'
import { PurposeTemplateQueries } from '@/api/purposeTemplate/purposeTemplate.queries'
import { SectionContainer } from '@/components/layout/containers'
import { Link } from '@/router'
import { NotFoundError } from '@/utils/errors.utils'

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

  const hasResults =
    linkableResources && linkableResources.results && linkableResources.results.length > 0

  return (
    <Stack spacing={2}>
      <SectionContainer innerSection title={t('subtitle')}>
        <Stack spacing={2}>
          {error instanceof NotFoundError ? (
            <Alert severity="warning">{t('orphanLinkedResources')}</Alert>
          ) : hasResults ? (
            linkableResources!.results.map((resource, idx) =>
              match(resource)
                .with({ resourceKind: 'ESERVICE' }, (r) => (
                  <Typography key={`ESERVICE:${r.eservice.id}:${idx}`} sx={{ fontWeight: 600 }}>
                    <Link
                      underline="none"
                      to="SUBSCRIBE_CATALOG_VIEW"
                      params={{
                        eserviceId: r.eservice.id,
                        descriptorId: r.descriptor.id,
                      }}
                    >
                      {r.eservice.name}
                    </Link>{' '}
                    {t('providedBy.eservice', { publisher: r.eservice.producer.name })}
                  </Typography>
                ))
                .with({ resourceKind: 'ESERVICE_TEMPLATE' }, (r) => (
                  <Typography
                    key={`ESERVICE_TEMPLATE:${r.eserviceTemplate.id}:${idx}`}
                    sx={{ fontWeight: 600 }}
                  >
                    <Link
                      underline="none"
                      to="SUBSCRIBE_ESERVICE_TEMPLATE_DETAILS"
                      params={{
                        eServiceTemplateId: r.eserviceTemplate.id,
                        eServiceTemplateVersionId: r.eserviceTemplateVersion.id,
                      }}
                    >
                      {r.eserviceTemplate.name}
                    </Link>{' '}
                    {t('providedBy.eserviceTemplate', { publisher: r.eserviceTemplate.creator.name })}
                  </Typography>
                ))
                .exhaustive()
            )
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
