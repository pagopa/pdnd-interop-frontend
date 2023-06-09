import React from 'react'
import { Alert } from '@mui/material'
import {
  ConsumerPurposeDetailsLoadEstimateUpdateSection,
  ConsumerPurposeDetailsLoadEstimateUpdateSectionSkeleton,
} from './ConsumerPurposeDetailsLoadEstimateUpdateSection'
import { PurposeQueries } from '@/api/purpose'
import { Trans, useTranslation } from 'react-i18next'
import { Link } from '@/router'
import {
  PurposeDetails,
  PurposeDetailsSkeleton,
} from '@/components/shared/PurposeDetails/PurposeDetails'

interface PurposeDetailsTabProps {
  purposeId: string
}

export const PurposeDetailsTab: React.FC<PurposeDetailsTabProps> = ({ purposeId }) => {
  const { t } = useTranslation('purpose', { keyPrefix: 'view' })
  const { data: purpose } = PurposeQueries.useGetSingle(purposeId)

  return (
    <>
      <PurposeDetails purpose={purpose} />
      <ConsumerPurposeDetailsLoadEstimateUpdateSection purpose={purpose} />
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
      <PurposeDetailsSkeleton />
      <ConsumerPurposeDetailsLoadEstimateUpdateSectionSkeleton />
    </>
  )
}
