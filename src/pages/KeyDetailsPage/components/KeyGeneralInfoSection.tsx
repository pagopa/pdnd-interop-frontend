import { ClientQueries } from '@/api/client'
import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { clientKeyGuideLink } from '@/config/constants'
import { formatDateString } from '@/utils/format.utils'
import { Alert, Grid } from '@mui/material'
import { Stack } from '@mui/system'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import React from 'react'
import { useTranslation } from 'react-i18next'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'

type KeyGeneralInfoSectionProps = {
  clientId: string
  kid: string
}

export const KeyGeneralInfoSection: React.FC<KeyGeneralInfoSectionProps> = ({ clientId, kid }) => {
  const { t } = useTranslation('key', { keyPrefix: 'edit.generalInformations' })
  const { data: publicKey } = ClientQueries.useGetSingleKey(clientId, kid)

  return (
    <Grid container>
      <Grid item xs={7}>
        <SectionContainer
          newDesign
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
              content={publicKey ? formatDateString(publicKey.createdAt) : ''}
            />
            <InformationContainer
              label={t('uploaderField.label')}
              content={`${publicKey?.operator.name ?? ''} ${publicKey?.operator.familyName ?? ''}`}
            />
            <InformationContainer
              label={t('kidField.label')}
              content={publicKey?.keyId ?? ''}
              copyToClipboard={
                publicKey?.keyId
                  ? {
                      value: publicKey.keyId,
                      tooltipTitle: t('kidField.copySuccessFeedbackText'),
                    }
                  : undefined
              }
            />
            <InformationContainer
              label={t('clientIdField.label')}
              content={clientId}
              copyToClipboard={{
                value: clientId,
                tooltipTitle: t('clientIdField.copySuccessFeedbackText'),
              }}
            />
            {publicKey?.isOrphan && (
              <Alert severity="info">{t('operatorDeletedAlertMessage')}</Alert>
            )}
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
