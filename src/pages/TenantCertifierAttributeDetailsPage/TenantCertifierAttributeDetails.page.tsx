import { AttributeQueries } from '@/api/attribute'
import {
  PageContainer,
  SectionContainer,
  SectionContainerSkeleton,
} from '@/components/layout/containers'
import { useParams } from '@/router'
import { Grid } from '@mui/material'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import { useQuery, useSuspenseQuery } from '@tanstack/react-query'
import React, { Suspense } from 'react'
import { useTranslation } from 'react-i18next'

const TenantCertifierAttributeDetails: React.FC = () => {
  const { t } = useTranslation('party', { keyPrefix: 'tenantCertifier.attributeDetails' })
  const { attributeId } = useParams<'TENANT_CERTIFIER_ATTRIBUTE_DETAILS'>()

  const { data: attributeName = '', isLoading } = useQuery({
    ...AttributeQueries.getSingle(attributeId),
    select: (d) => d.name,
  })

  return (
    <PageContainer
      title={attributeName}
      isLoading={isLoading}
      backToAction={{
        label: t('backToTenantCertifierBtn'),
        to: 'TENANT_CERTIFIER',
      }}
    >
      <Grid container>
        <Grid item xs={8}>
          <Suspense fallback={<SectionContainerSkeleton height={92} />}>
            <TenantCertifierAttributeDetailsInfoSection attributeId={attributeId} />
          </Suspense>
        </Grid>
      </Grid>
    </PageContainer>
  )
}

type TenantCertifierAttributeDetailsInfoSectionProps = {
  attributeId: string
}

const TenantCertifierAttributeDetailsInfoSection: React.FC<
  TenantCertifierAttributeDetailsInfoSectionProps
> = ({ attributeId }) => {
  const { t } = useTranslation('party', { keyPrefix: 'tenantCertifier.attributeDetails' })
  const { data: attribute } = useSuspenseQuery(AttributeQueries.getSingle(attributeId))

  return (
    <SectionContainer>
      <InformationContainer
        direction="column"
        label={t('descriptionField.label')}
        content={attribute.description}
      />
    </SectionContainer>
  )
}

export default TenantCertifierAttributeDetails
