import { AttributeQueries } from '@/api/attribute'
import { PageContainer, SectionContainer } from '@/components/layout/containers'
import { useParams } from '@/router'
import { Grid } from '@mui/material'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import React from 'react'
import { useTranslation } from 'react-i18next'

const TenantCertifierAttributeDetails: React.FC = () => {
  const { t } = useTranslation('party', { keyPrefix: 'tenantCertifier.attributeDetails' })
  const { attributeId } = useParams<'TENANT_CERTIFIER_ATTRIBUTE_DETAILS'>()

  const { data: attribute } = AttributeQueries.useGetSingle(attributeId, { suspense: false })

  if (!attribute) return null

  return (
    <PageContainer
      title={`${attribute?.name}`}
      isLoading={!attribute}
      backToAction={{
        label: t('backToTenantCertifierBtn'),
        to: 'TENANT_CERTIFIER',
      }}
    >
      <Grid container>
        <Grid item xs={8}>
          <SectionContainer>
            <InformationContainer
              direction="column"
              label={t('descriptionField.label')}
              content={attribute?.description}
            />
          </SectionContainer>
        </Grid>
      </Grid>
    </PageContainer>
  )
}

export default TenantCertifierAttributeDetails
