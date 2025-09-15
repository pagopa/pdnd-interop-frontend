import { Stack, Typography } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSuspenseQuery } from '@tanstack/react-query'
import { PurposeTemplateQueries } from '@/api/purposeTemplate/purposeTemplate.queries'
import { SectionContainer } from '@/components/layout/containers'
import { Link } from '@/router'

type PurposeTemplateSummaryLinkedEServiceAccordionProps = {
  purposeTemplateId: string
}

export const PurposeTemplateSummaryLinkedEServiceAccordion: React.FC<
  PurposeTemplateSummaryLinkedEServiceAccordionProps
> = ({ purposeTemplateId }) => {
  const { data: linkedEservices } = useSuspenseQuery(
    PurposeTemplateQueries.getEservicesLinkedToPurposeTemplatesList() //TODO: NEED A PURPOSE TEMPLATE ID?
  )
  const { t } = useTranslation('purposeTemplate', {
    keyPrefix: 'edit.summary.suggestedEServicesSection',
  })

  return (
    <Stack spacing={2}>
      <SectionContainer innerSection title={t('subtitle')}>
        <Stack spacing={2}>
          {linkedEservices.map((eservice) => (
            <Typography key={eservice.eserviceId} sx={{ fontWeight: 600 }}>
              <Link
                underline="none"
                to="SUBSCRIBE_CATALOG_VIEW"
                params={{
                  eserviceId: eservice.eserviceId as string,
                  descriptorId: eservice.descriptorId,
                }}
              >
                {eservice.eserviceName}
              </Link>{' '}
              {t('providedBy')} {eservice.producerName}
            </Typography>
          ))}
        </Stack>
      </SectionContainer>
    </Stack>
  )
}
