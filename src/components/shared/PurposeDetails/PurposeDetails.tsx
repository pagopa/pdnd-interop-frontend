import React from 'react'
import type { Purpose } from '@/api/api.generatedTypes'
import {
  PurposeDetailsGeneralInfoSection,
  PurposeDetailsGeneralInfoSectionSkeleton,
} from './PurposeDetailsGeneralInfoSection'
import {
  PurposeDetailsDocumentListSection,
  PurposeDetailsDocumentListSectionSkeleton,
} from './PurposeDetailsDocumentListSection'
import { ApiInfoSection, ApiInfoSectionSkeleton } from '../ApiInfoSection'
import { Grid } from '@mui/material'
import { useTranslation } from 'react-i18next'

type PurposeDetailsProps = {
  purpose?: Purpose
}

export const PurposeDetails: React.FC<PurposeDetailsProps> = ({ purpose }) => {
  const { t } = useTranslation('common', { keyPrefix: 'idLabels' })

  if (!purpose) return null

  return (
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
