import { EServiceQueries } from '@/api/eservice'
import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { useParams } from '@/router'
import { Divider, Stack } from '@mui/material'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { ProviderEServiceVoucherLifespanSection } from './ProviderEServiceVoucherLifespanSection'
import { ProviderEServiceUsefulLinksSection } from './ProviderEServiceUsefulLinksSection'
import { ProviderEServiceDocumentationSection } from './ProviderEServiceDocumentationSection'
import { useSuspenseQuery } from '@tanstack/react-query'
import { AuthHooks } from '@/api/auth'
import { ProviderEServiceDelegationsSection } from './ProviderEServiceDelegationsSection'

export const ProviderEServiceTechnicalInfoSection: React.FC = () => {
  const producerId = AuthHooks.useJwt().jwt?.organizationId as string

  const { t } = useTranslation('eservice', {
    keyPrefix: 'read.sections.technicalInformations',
  })
  const { t: tCommon } = useTranslation('common')

  const { eserviceId, descriptorId } = useParams<'PROVIDE_ESERVICE_MANAGE'>()
  const { data: descriptor } = useSuspenseQuery(
    EServiceQueries.getDescriptorProvider(eserviceId, descriptorId)
  )

  const asyncExchangeProperties = descriptor.asyncExchangeProperties

  return (
    <SectionContainer title={t('title')} description={t('description')}>
      <Stack spacing={2}>
        <SectionContainer innerSection>
          <Stack spacing={2}>
            <InformationContainer
              label={t('eserviceId.label')}
              content={eserviceId}
              copyToClipboard={{
                value: eserviceId,
                tooltipTitle: t('eserviceId.copySuccessFeedbackText'),
              }}
            />
            <InformationContainer
              label={t('descriptorId.label')}
              content={descriptor.id}
              copyToClipboard={{
                value: descriptor.id,
                tooltipTitle: t('descriptorId.copySuccessFeedbackText'),
              }}
            />
            <InformationContainer
              label={t('producerId.label')}
              content={producerId}
              copyToClipboard={{
                value: producerId,
                tooltipTitle: t('producerId.copySuccessFeedbackText'),
              }}
            />
            <InformationContainer
              label={t('technology')}
              content={descriptor.eservice.technology}
            />
            <InformationContainer
              label={t('exchangeType.label')}
              content={t(
                `exchangeType.value.${descriptor.eservice.asyncExchange ? 'async' : 'sync'}`
              )}
            />

            <InformationContainer label={t('audience')} content={descriptor.audience[0]} />

            <InformationContainer
              label={t('mode.label')}
              labelDescription={t('mode.labelDescription')}
              content={t(`mode.value.${descriptor.eservice.mode}`)}
            />
            {descriptor.eservice.asyncExchange && (
              <>
                <InformationContainer
                  label={t('asyncExchange.responseTime.label')}
                  content={
                    asyncExchangeProperties
                      ? `${asyncExchangeProperties.responseTime} ${tCommon('time.second', {
                          count: asyncExchangeProperties.responseTime,
                        })}`
                      : '-'
                  }
                />
                <InformationContainer
                  label={t('asyncExchange.resourceAvailableTime.label')}
                  content={
                    asyncExchangeProperties
                      ? `${asyncExchangeProperties.resourceAvailableTime} ${tCommon('time.second', {
                          count: asyncExchangeProperties.resourceAvailableTime,
                        })}`
                      : '-'
                  }
                />
                <InformationContainer
                  label={t('asyncExchange.confirmation.label')}
                  content={
                    asyncExchangeProperties
                      ? t(`asyncExchange.booleanValue.${asyncExchangeProperties.confirmation}`)
                      : '-'
                  }
                />
                <InformationContainer
                  label={t('asyncExchange.bulk.label')}
                  content={
                    asyncExchangeProperties
                      ? t(`asyncExchange.booleanValue.${asyncExchangeProperties.bulk}`)
                      : '-'
                  }
                />
                <InformationContainer
                  label={t('asyncExchange.maxResultSet.label')}
                  content={
                    asyncExchangeProperties ? String(asyncExchangeProperties.maxResultSet) : '-'
                  }
                />
              </>
            )}
          </Stack>
        </SectionContainer>
        <Divider />
        <ProviderEServiceVoucherLifespanSection descriptor={descriptor} />
        <Divider />
        <ProviderEServiceDelegationsSection descriptor={descriptor} />
        <Divider />
        <ProviderEServiceDocumentationSection descriptor={descriptor} />
        <Divider />
        <ProviderEServiceUsefulLinksSection />
      </Stack>
    </SectionContainer>
  )
}

export const ProviderEServiceTechnicalInfoSectionSkeleton = () => {
  return <SectionContainerSkeleton sx={{ mt: 4 }} height={383} />
}
