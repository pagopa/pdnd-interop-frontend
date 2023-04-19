import React from 'react'
import { Grid } from '@mui/material'
import {
  PurposeDetailsGeneralInfoSection,
  PurposeDetailsGeneralInfoSectionSkeleton,
} from './PurposeDetailsGeneralInfoSection'
import {
  PurposeDetailsDocumentListSection,
  PurposeDetailsDocumentListSectionSkeleton,
} from './PurposeDetailsDocumentListSection'
import { PurposeDetailsLoadEstimateUpdateSection } from './PurposeDetailsLoadEstimateUpdateSection'
import { useJwt } from '@/hooks/useJwt'
import { ApiInfoSection, ApiInfoSectionSkeleton } from '@/components/shared/ApiInfoSection'
import { useTranslation } from 'react-i18next'
import { PurposeQueries } from '@/api/purpose'

interface PurposeDetailsProps {
  purposeId: string
}

export const PurposeDetails: React.FC<PurposeDetailsProps> = ({ purposeId }) => {
  const { t } = useTranslation('common', { keyPrefix: 'idLabels' })
  const { isAdmin } = useJwt()

  const { data: purpose } = PurposeQueries.useGetSingle(purposeId)

  return (
    <>
      <Grid spacing={2} container>
        <Grid item xs={7}>
          <PurposeDetailsGeneralInfoSection purpose={purpose} />
          <PurposeDetailsDocumentListSection purpose={purpose} />
        </Grid>
        <Grid item xs={5}>
          {purpose && (
            <ApiInfoSection
              ids={[
                { name: t('eserviceId'), id: purpose.eservice.id },
                { name: t('descriptorId'), id: purpose.eservice.descriptor.id },
                { name: t('agreementId'), id: purpose.agreement.id },
                { name: t('purposeId'), id: purpose.id },
                { name: t('providerId'), id: purpose.eservice.producer.id },
                { name: t('consumerId'), id: purpose.consumer.id },
              ]}
            />
          )}
        </Grid>
      </Grid>
      {purpose?.waitingForApprovalVersion && isAdmin && (
        <PurposeDetailsLoadEstimateUpdateSection purpose={purpose} />
      )}
    </>
  )
}

export const PurposeDetailsSkeleton: React.FC = () => {
  return (
    <Grid spacing={2} container>
      <Grid item xs={7}>
        <PurposeDetailsGeneralInfoSectionSkeleton />
        <PurposeDetailsDocumentListSectionSkeleton />
      </Grid>
      <Grid item xs={5}>
        <ApiInfoSectionSkeleton />
      </Grid>
    </Grid>
  )
}
