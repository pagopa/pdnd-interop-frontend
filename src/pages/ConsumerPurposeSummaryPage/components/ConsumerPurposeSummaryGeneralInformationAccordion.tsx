import { Stack } from '@mui/material'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import React from 'react'
import { Link } from '@/router'
import { SectionContainer } from '@/components/layout/containers'
import { useTranslation } from 'react-i18next'
import { PurposeQueries } from '@/api/purpose'

type ConsumerPurposeSummaryGeneralInformationAccordionProps = {
  purposeId: string
}

export const ConsumerPurposeSummaryGeneralInformationAccordion: React.FC<
  ConsumerPurposeSummaryGeneralInformationAccordionProps
> = ({ purposeId }) => {
  const { data: purpose } = PurposeQueries.useGetSingle(purposeId)
  const { t } = useTranslation('purpose', { keyPrefix: 'summary.generalInformationSection' })

  if (!purpose) return null

  return (
    <Stack spacing={2}>
      <InformationContainer
        content={purpose.title}
        direction="row"
        label={t('purpose.purposeTitle')}
      />
      <InformationContainer
        content={purpose.description}
        direction="row"
        label={t('description.label')}
      />
      <InformationContainer
        content={
          <Link
            to="SUBSCRIBE_CATALOG_VIEW"
            params={{
              eserviceId: purpose.eservice.id,
              descriptorId: purpose.eservice.descriptor.id,
            }}
            target="_blank"
          >
            {t('eservice.value', {
              name: purpose.eservice.name,
              version: purpose.eservice.descriptor.version,
            })}
          </Link>
        }
        direction="row"
        label={t('eservice.label')}
      />
      <InformationContainer
        content={purpose.eservice.producer.name}
        direction="row"
        label={t('producer.label')}
      />
      <SectionContainer innerSection sx={{ pt: 4 }} title={t('loadEstimationSection.title')}>
        <Stack spacing={2}>
          <InformationContainer
            content={t('loadEstimationSection.dailyCalls.value', {
              value: purpose.currentVersion?.dailyCalls,
            })}
            direction="row"
            label={t('loadEstimationSection.dailyCalls.label')}
          />
          <InformationContainer
            content={t('loadEstimationSection.dailyCallsPerConsumer.value', {
              value: purpose.dailyCallsPerConsumer,
            })}
            direction="row"
            label={t('loadEstimationSection.dailyCallsPerConsumer.label')}
          />
          <InformationContainer
            content={t('loadEstimationSection.dailyCallsTotal.value', {
              value: purpose.dailyCallsTotal,
            })}
            direction="row"
            label={t('loadEstimationSection.dailyCallsTotal.label')}
          />
        </Stack>
      </SectionContainer>
    </Stack>
  )
}
