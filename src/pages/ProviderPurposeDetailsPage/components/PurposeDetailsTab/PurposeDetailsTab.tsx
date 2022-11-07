import React from 'react'
import { Alert, Grid } from '@mui/material'
import {
  PurposeDetailsGeneralInfoSection,
  PurposeDetailsGeneralInfoSectionSkeleton,
} from './PurposeDetailsGeneralInfoSection'
import {
  PurposeDetailsDocumentListSection,
  PurposeDetailsDocumentListSectionSkeleton,
} from './PurposeDetailsDocumentListSection'
import {
  PurposeDetailsLoadEstimateUpdateSection,
  PurposeDetailsLoadEstimateUpdateSectionSkeleton,
} from './PurposeDetailsLoadEstimateUpdateSection'
import { PurposeQueries } from '@/api/purpose'
import { Trans, useTranslation } from 'react-i18next'
import { RouterLink } from '@/router'

interface PurposeDetailsTabProps {
  purposeId: string
}

export const PurposeDetailsTab: React.FC<PurposeDetailsTabProps> = ({ purposeId }) => {
  const { t } = useTranslation('purpose', { keyPrefix: 'view' })
  const { data: purpose } = PurposeQueries.useGetSingle(purposeId)

  return (
    <>
      <Grid spacing={2} container>
        <Grid item xs={7}>
          <PurposeDetailsGeneralInfoSection purposeId={purposeId} />
        </Grid>
        <Grid item xs={5}>
          <PurposeDetailsDocumentListSection purposeId={purposeId} />
        </Grid>
      </Grid>
      <PurposeDetailsLoadEstimateUpdateSection purposeId={purposeId} />
      {purpose?.clients.length === 0 && (
        <Alert sx={{ mt: 2 }} severity="info">
          <Trans
            components={{
              1: (
                <RouterLink
                  to="SUBSCRIBE_PURPOSE_VIEW"
                  params={{ purposeId }}
                  options={{ urlParams: { tab: 'clients' } }}
                />
              ),
            }}
          >
            {t('noClientsAlert')}
          </Trans>
        </Alert>
      )}
    </>
  )
}

export const PurposeDetailsTabSkeleton: React.FC = () => {
  return (
    <>
      <Grid spacing={2} container>
        <Grid item xs={7}>
          <PurposeDetailsGeneralInfoSectionSkeleton />
        </Grid>
        <Grid item xs={5}>
          <PurposeDetailsDocumentListSectionSkeleton />
        </Grid>
      </Grid>
      <PurposeDetailsLoadEstimateUpdateSectionSkeleton />
    </>
  )
}
