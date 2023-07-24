import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useConsumerAgreementCreateDetailsContext } from '../ConsumerAgreementCreateDetailsContext'
import { Box, Divider, Stack } from '@mui/material'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import { Link } from '@/router'
import { IconLink } from '@/components/shared/IconLink'
import RuleIcon from '@mui/icons-material/Rule'

const ConsumerAgreementCreateAgreementGeneralInformation: React.FC = () => {
  const { t } = useTranslation('agreement', {
    keyPrefix: 'edit.generalInformations',
  })

  const { agreement, openCertifiedAttributesDrawer } = useConsumerAgreementCreateDetailsContext()

  if (!agreement) return <ConsumerAgreementCreateAgreementGeneralInformationSkeleton />

  const eServiceName = `${agreement.eservice.name}, ${t('eserviceField.versionLabel')} ${
    agreement.eservice.version
  }`

  return (
    <SectionContainer newDesign title={t('title')}>
      <Stack spacing={2}>
        <InformationContainer
          content={
            <Link
              to="SUBSCRIBE_CATALOG_VIEW"
              params={{ eserviceId: agreement.eservice.id, descriptorId: agreement.descriptorId }}
              target="_blank"
            >
              {eServiceName}
            </Link>
          }
          label={t('eserviceField.label')}
        />

        <InformationContainer content={agreement?.producer.name} label={t('providerField.label')} />

        <Divider />

        <Box>
          <IconLink
            onClick={openCertifiedAttributesDrawer}
            component="button"
            startIcon={<RuleIcon />}
          >
            {t('certifiedAttributesDrawerButtonLabel')}
          </IconLink>
        </Box>
      </Stack>
    </SectionContainer>
  )
}

export const ConsumerAgreementCreateAgreementGeneralInformationSkeleton: React.FC = () => {
  const height = 194

  return <SectionContainerSkeleton height={height} />
}

export default ConsumerAgreementCreateAgreementGeneralInformation
