import { ClientQueries } from '@/api/client'
import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { clientKeyGuideLink } from '@/config/constants'
import { formatDateString } from '@/utils/format.utils'
import { Grid } from '@mui/material'
import { Stack } from '@mui/system'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import React from 'react'
import { useTranslation } from 'react-i18next'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import { useSuspenseQuery } from '@tanstack/react-query'

type KeyGeneralInfoSectionProps = {
  clientId: string
  kid: string
}

export const KeyGeneralInfoSection: React.FC<KeyGeneralInfoSectionProps> = ({ clientId, kid }) => {
  const { t } = useTranslation('key', { keyPrefix: 'edit.generalInformations' })
  const { data: publicKey } = useSuspenseQuery(ClientQueries.getSingleKey(clientId, kid))

  return (
    <Grid container>
      <Grid item xs={7}>
        <SectionContainer
          title={t('title')}
          bottomActions={[
            {
              label: t('goToTechnicalDocButton'),
              target: '_blank',
              href: clientKeyGuideLink,
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
              label={t('kidField.label')}
              content={publicKey.keyId}
              copyToClipboard={{
                value: publicKey.keyId,
                tooltipTitle: t('kidField.copySuccessFeedbackText'),
              }}
            />
            <InformationContainer
              label={t('clientIdField.label')}
              content={clientId}
              copyToClipboard={{
                value: clientId,
                tooltipTitle: t('clientIdField.copySuccessFeedbackText'),
              }}
            />
          </Stack>
        </SectionContainer>
      </Grid>
    </Grid>
  )
}

export const KeyGeneralInfoSectionSkeleton = () => {
  return (
    <Grid container>
      <Grid item xs={7}>
        <SectionContainerSkeleton sx={{ mt: 4 }} height={318} />
      </Grid>
    </Grid>
  )
}
