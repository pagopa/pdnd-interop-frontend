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
import { Link } from '@/router'
import { ApiInfoSection, ApiInfoSectionSkeleton } from '@/components/shared/ApiInfoSection'

interface PurposeDetailsTabProps {
  purposeId: string
}

export const PurposeDetailsTab: React.FC<PurposeDetailsTabProps> = ({ purposeId }) => {
  const { t } = useTranslation('purpose', { keyPrefix: 'view' })
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'idLabels' })
  const { data: purpose } = PurposeQueries.useGetSingle(purposeId)

  return (
    <>
      <Grid spacing={2} container>
        <Grid item xs={7}>
          <PurposeDetailsGeneralInfoSection purposeId={purposeId} />
          <PurposeDetailsDocumentListSection purposeId={purposeId} />
        </Grid>
        <Grid item xs={5}>
          {purpose && (
            <ApiInfoSection
              ids={[
                { name: tCommon('eserviceId'), id: purpose.eservice.id },
                { name: tCommon('descriptorId'), id: purpose.eservice.descriptor.id },
                { name: tCommon('agreementId'), id: purpose.agreement.id },
                { name: tCommon('purposeId'), id: purpose.id },
                { name: tCommon('providerId'), id: purpose.eservice.producer.id },
                { name: tCommon('consumerId'), id: purpose.consumer.id },
              ]}
            />
          )}
        </Grid>
      </Grid>
      <PurposeDetailsLoadEstimateUpdateSection purposeId={purposeId} />
      {purpose?.currentVersion?.state !== 'ARCHIVED' && purpose?.clients.length === 0 && (
        <Alert sx={{ mt: 2 }} severity="info">
          <Trans
            components={{
              1: (
                <Link
                  to="SUBSCRIBE_PURPOSE_DETAILS"
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
          <PurposeDetailsDocumentListSectionSkeleton />
        </Grid>
        <Grid item xs={5}>
          <ApiInfoSectionSkeleton />
        </Grid>
      </Grid>
      <PurposeDetailsLoadEstimateUpdateSectionSkeleton />
    </>
  )
}
