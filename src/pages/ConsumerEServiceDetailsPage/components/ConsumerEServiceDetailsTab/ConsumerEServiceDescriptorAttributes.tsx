import { AuthHooks } from '@/api/auth'
import { AttributeQueries } from '@/api/attribute'
import { EServiceQueries } from '@/api/eservice'
import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import {
  ReadOnlyDescriptorAttributes,
  type AttributeOwnershipData,
} from '@/components/shared/ReadOnlyDescriptorAttributes'
import { useParams } from '@/router'
import { useSuspenseQueries, useSuspenseQuery } from '@tanstack/react-query'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import { Divider, Stack } from '@mui/material'
import { formatThousands } from '@/utils/format.utils'
import type {
  DelegationTenant,
  DescriptorAttributes,
  TenantAttributes,
} from '@/api/api.generatedTypes'
import { isAttributeOwned } from '@/utils/attribute.utils'

function getCustomizedDailyCallsPerConsumer(
  descriptorAttributes: DescriptorAttributes['certified'],
  ownedAttributes: TenantAttributes['certified']
): number | undefined {
  return descriptorAttributes.flat().reduce<number | undefined>((max, attribute) => {
    if (
      attribute.dailyCallsPerConsumer === undefined ||
      !isAttributeOwned(
        'certified',
        attribute.id,
        ownedAttributes,
        attribute.discreteConfig ? { discreteConfig: attribute.discreteConfig } : undefined
      )
    ) {
      return max
    }

    return max === undefined
      ? attribute.dailyCallsPerConsumer
      : Math.max(max, attribute.dailyCallsPerConsumer)
  }, undefined)
}

type ConsumerEServiceDescriptorAttributesProps = {
  delegators?: DelegationTenant[]
}

export const ConsumerEServiceDescriptorAttributes: React.FC<
  ConsumerEServiceDescriptorAttributesProps
> = ({ delegators = [] }) => {
  const { t } = useTranslation('eservice', { keyPrefix: 'read.sections.attributes' })
  const { jwt, isReviewer } = AuthHooks.useJwt()

  const { eserviceId, descriptorId } = useParams<'SUBSCRIBE_CATALOG_VIEW'>()
  const { data: descriptor } = useSuspenseQuery(
    EServiceQueries.getDescriptorCatalog(eserviceId, descriptorId)
  )

  const [{ data: ownedCertified }, { data: ownedVerified }, { data: ownedDeclared }] =
    useSuspenseQueries({
      queries: [
        AttributeQueries.getPartyCertifiedList(jwt?.organizationId),
        AttributeQueries.getPartyVerifiedList(jwt?.organizationId),
        AttributeQueries.getPartyDeclaredList(jwt?.organizationId),
      ],
    })

  const delegatorCertifiedAttributes = useSuspenseQueries({
    queries: delegators.map(({ id }) => AttributeQueries.getPartyCertifiedList(id)),
  })

  const ownershipData: AttributeOwnershipData = React.useMemo(
    () => ({
      certified: ownedCertified.attributes,
      verified: ownedVerified.attributes,
      declared: ownedDeclared.attributes,
      producerId: descriptor.eservice.producer.id,
    }),
    [ownedCertified, ownedVerified, ownedDeclared, descriptor.eservice.producer.id]
  )

  const customizedThresholds = React.useMemo(() => {
    const currentTenantThreshold = isReviewer
      ? undefined
      : getCustomizedDailyCallsPerConsumer(
          descriptor.attributes.certified,
          ownedCertified.attributes
        )

    const delegatorThresholds = delegators.flatMap((delegator, index) => {
      const ownedAttributes = delegatorCertifiedAttributes[index]?.data.attributes
      if (!ownedAttributes) return []

      const dailyCallsPerConsumer = getCustomizedDailyCallsPerConsumer(
        descriptor.attributes.certified,
        ownedAttributes
      )

      return dailyCallsPerConsumer === undefined
        ? []
        : [{ id: delegator.id, label: delegator.name, dailyCallsPerConsumer }]
    })

    return currentTenantThreshold === undefined
      ? delegatorThresholds
      : [
          {
            id: jwt?.organizationId ?? 'current-tenant',
            label: t('thresholds.customized.currentTenantLabel'),
            dailyCallsPerConsumer: currentTenantThreshold,
          },
          ...delegatorThresholds,
        ]
  }, [
    delegators,
    delegatorCertifiedAttributes,
    descriptor.attributes.certified,
    isReviewer,
    jwt?.organizationId,
    ownedCertified.attributes,
    t,
  ])

  return (
    <SectionContainer title={t('title')} description={t('description')}>
      <SectionContainer innerSection title={t('thresholds.title')}>
        <Stack spacing={2}>
          <InformationContainer
            label={t('thresholds.dailyCallsPerConsumer.label')}
            content={
              descriptor.dailyCallsPerConsumer
                ? `${formatThousands(descriptor.dailyCallsPerConsumer)}`
                : ''
            }
          />
          <InformationContainer
            label={t('thresholds.dailyCallsTotal.label')}
            content={
              descriptor.dailyCallsTotal ? `${formatThousands(descriptor.dailyCallsTotal)}` : ''
            }
          />
        </Stack>
      </SectionContainer>
      {customizedThresholds.length > 0 && (
        <SectionContainer innerSection title={t('thresholds.customized.title')}>
          <Stack spacing={2}>
            {customizedThresholds.map(({ id, label, dailyCallsPerConsumer }) => (
              <InformationContainer
                key={id}
                label={label}
                content={`${formatThousands(dailyCallsPerConsumer)}`}
              />
            ))}
          </Stack>
        </SectionContainer>
      )}
      <Divider sx={{ my: 3 }} />
      <ReadOnlyDescriptorAttributes
        descriptorAttributes={descriptor.attributes}
        ownershipData={ownershipData}
      />
    </SectionContainer>
  )
}

export const ConsumerEServiceDescriptorAttributesSkeleton: React.FC = () => {
  return <SectionContainerSkeleton height={1000} />
}
