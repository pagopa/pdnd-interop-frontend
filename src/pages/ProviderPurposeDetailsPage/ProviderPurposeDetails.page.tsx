import { PurposeQueries } from '@/api/purpose'
import { PageContainer } from '@/components/layout/containers'
import useGetProviderPurposesActions from '@/hooks/useGetProviderPurposesActions'
import { useParams } from '@/router'
import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import {
  ProviderPurposeDetailsGeneralInfoSection,
  ProviderPurposeDetailsGeneralInfoSectionSkeleton,
} from './components/ProviderPurposeDetailsGeneralInfoSection'
import { Alert, Grid, Link, Stack, Typography } from '@mui/material'
import {
  ProviderPurposeDetailsLoadEstimateSection,
  ProviderPurposeDetailsLoadEstimateSectionSkeleton,
} from './components/ProviderPurposeDetailsLoadEstimateSection'
import useGetPurposeStateAlertProps from './hooks/useGetPurposeStateAlertProps'
import { useDrawerState } from '@/hooks/useDrawerState'
import { RejectReasonDrawer } from '@/components/shared/RejectReasonDrawer'
import { useQuery } from '@tanstack/react-query'

const ProviderPurposeDetailsPage: React.FC = () => {
  const { t } = useTranslation('purpose')
  const { purposeId } = useParams<'PROVIDE_PURPOSE_DETAILS'>()

  const { data: purpose, isLoading } = useQuery(PurposeQueries.getSingle(purposeId))

  const { actions } = useGetProviderPurposesActions(purpose)

  const { isOpen, openDrawer, closeDrawer } = useDrawerState()

  const alertProps = useGetPurposeStateAlertProps(purpose)

  return (
    <PageContainer
      title={purpose?.title}
      isLoading={isLoading}
      topSideActions={actions}
      statusChip={purpose ? { for: 'purpose', purpose: purpose } : undefined}
      backToAction={{
        label: t('backToListBtn'),
        to: 'PROVIDE_PURPOSE_LIST',
      }}
    >
      {alertProps && (
        <Alert severity={alertProps.severity} sx={{ mb: 3 }} variant={alertProps.variant}>
          <Typography variant="body2">
            <Trans
              components={{
                1: (
                  <Link
                    onClick={openDrawer}
                    variant="body2"
                    fontWeight={700}
                    sx={{ cursor: 'pointer' }}
                  />
                ),
              }}
            >
              {alertProps.content}
            </Trans>
          </Typography>
        </Alert>
      )}
      <Grid container>
        <Grid item xs={8}>
          {!purpose ? (
            <ProviderPurposeDetailsPageSkeleton />
          ) : (
            <Stack spacing={3}>
              <ProviderPurposeDetailsGeneralInfoSection purpose={purpose} />
              <ProviderPurposeDetailsLoadEstimateSection
                purpose={purpose}
                openRejectReasonDrawer={openDrawer}
              />
            </Stack>
          )}
        </Grid>
      </Grid>
      {purpose && purpose.rejectedVersion?.rejectionReason && (
        <RejectReasonDrawer
          isOpen={isOpen}
          onClose={closeDrawer}
          rejectReason={purpose.rejectedVersion.rejectionReason}
          rejectedValue={purpose.rejectedVersion.dailyCalls}
        />
      )}
    </PageContainer>
  )
}

const ProviderPurposeDetailsPageSkeleton: React.FC = () => {
  return (
    <Stack spacing={3}>
      <ProviderPurposeDetailsGeneralInfoSectionSkeleton />
      <ProviderPurposeDetailsLoadEstimateSectionSkeleton />
    </Stack>
  )
}

export default ProviderPurposeDetailsPage
