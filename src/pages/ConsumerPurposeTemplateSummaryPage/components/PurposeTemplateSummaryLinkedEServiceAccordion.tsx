import { Stack, Typography } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { PurposeTemplateQueries } from '@/api/purposeTemplate/purposeTemplate.queries'
import { SectionContainer } from '@/components/layout/containers'
import { Link } from '@/router'

type PurposeTemplateSummaryLinkedEServiceAccordionProps = {
  purposeTemplateId: string
}

export const PurposeTemplateSummaryLinkedEServiceAccordion: React.FC<
  PurposeTemplateSummaryLinkedEServiceAccordionProps
> = ({ purposeTemplateId }) => {
  const { data: linkedEservices } = useQuery({
    ...PurposeTemplateQueries.getEservicesLinkedToPurposeTemplatesList({
      purposeTemplateId: purposeTemplateId,
      offset: 0,
      limit: 50,
    }),
    enabled: Boolean(purposeTemplateId),
  })
  const { t } = useTranslation('purposeTemplate', {
    keyPrefix: 'edit.summary.suggestedEServicesSection',
  })

  return (
    <Stack spacing={2}>
      <SectionContainer innerSection title={t('subtitle')}>
        <Stack spacing={2}>
          {linkedEservices && linkedEservices.results && linkedEservices.results.length > 0 ? (
            linkedEservices.results.map((linkedEservice) => (
              <Typography key={linkedEservice.eservice.id} sx={{ fontWeight: 600 }}>
                <Link
                  underline="none"
                  to="SUBSCRIBE_CATALOG_VIEW"
                  params={{
                    eserviceId: linkedEservice.eservice.id,
                    descriptorId: linkedEservice.descriptor.id,
                  }}
                >
                  {linkedEservice.eservice.name}
                </Link>{' '}
                {t('providedBy')} {linkedEservice.eservice.producer.name}
              </Typography>
            ))
          ) : (
            <Typography variant="body2" color="text.secondary">
              {t('noLinkedEservices')}
            </Typography>
          )}
        </Stack>
      </SectionContainer>
    </Stack>
  )
}
