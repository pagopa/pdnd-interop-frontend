import { KeychainQueries } from '@/api/keychain/keychain.queries'
import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { Grid, Stack } from '@mui/material'
import { useSuspenseQuery } from '@tanstack/react-query'
import React from 'react'
import { useTranslation } from 'react-i18next'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import { formatDateString } from '@/utils/format.utils'

type ProviderKeychainPublicKeyDetailsGeneralInfoSectionProps = {
  keychainId: string
  keyId: string
}

export const ProviderKeychainPublicKeyDetailsGeneralInfoSection: React.FC<
  ProviderKeychainPublicKeyDetailsGeneralInfoSectionProps
> = ({ keychainId, keyId }) => {
  const { t } = useTranslation('keychain', { keyPrefix: 'publicKey' })
  const { data: publicKey } = useSuspenseQuery(
    KeychainQueries.getProducerKeychainKey({ producerKeychainId: keychainId, keyId })
  )

  return (
    <Grid container>
      <Grid item xs={7}>
        <SectionContainer
          title={t('generalInformations')}
          bottomActions={[
            {
              label: t('goToTechnicalDocButton'),
              target: '_blank',
              href: 'TODO',
              startIcon: <OpenInNewIcon fontSize="small" />,
            },
          ]}
        >
          <Stack spacing={2}>
            <InformationContainer
              label={t('creationDateField.label')}
              content={formatDateString(publicKey.createdAt)}
            />
            <InformationContainer
              label={t('uploaderField.label')}
              content={`${publicKey.user.name} ${publicKey.user.familyName}`}
            />
            <InformationContainer
              label={t('keyIdField.label')}
              content={publicKey.keyId}
              copyToClipboard={{
                value: publicKey.keyId,
                tooltipTitle: t('keyIdField.copySuccessFeedbackText'),
              }}
            />
          </Stack>
        </SectionContainer>
      </Grid>
    </Grid>
  )
}

export const ProviderKeychainPublicKeyDetailsGeneralInfoSectionSkeleton = () => {
  return (
    <Grid container>
      <Grid item xs={7}>
        <SectionContainerSkeleton sx={{ mt: 4 }} height={318} />
      </Grid>
    </Grid>
  )
}
