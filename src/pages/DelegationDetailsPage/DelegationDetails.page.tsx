import { DelegationQueries } from '@/api/delegation'
import { PageContainer } from '@/components/layout/containers'
import { useParams } from '@/router'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import {
  DelegationGeneralInfoSection,
  DelegationGeneralInfoSectionSkeleton,
} from './components/DelegationGeneralInfoSection'
import { Alert, Link } from '@mui/material'
import { useDrawerState } from '@/hooks/useDrawerState'
import { RejectReasonDrawer } from '@/components/shared/RejectReasonDrawer'
import { useGetDelegationActions } from '@/hooks/useGetDelegationActions'

export const DelegationDetailsPage: React.FC = () => {
  const { delegationId } = useParams<'DELEGATION_DETAILS'>()
  const { t } = useTranslation('party', { keyPrefix: 'delegations.details' })

  const { data: delegation, isLoading } = useQuery(
    DelegationQueries.getSingle({ delegationId: delegationId })
  )

  const { isOpen, openDrawer, closeDrawer } = useDrawerState()

  const { actions } = useGetDelegationActions(delegation)

  return (
    <PageContainer
      title={t('title')}
      isLoading={isLoading}
      backToAction={{
        label: t('backToDelegationList'),
        to: 'DELEGATIONS',
        urlParams: { tab: 'delegationsReceived' },
      }}
      topSideActions={actions}
    >
      {delegation && delegation.state === 'REJECTED' && delegation.rejectionReason && (
        <Alert severity="error" sx={{ mb: 3 }} variant="outlined">
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
            {t('rejectedDelegationAlert')}
          </Trans>
        </Alert>
      )}
      <React.Suspense fallback={<DelegationGeneralInfoSectionSkeleton />}>
        <DelegationGeneralInfoSection delegationId={delegationId} />
      </React.Suspense>
      {delegation && delegation.rejectionReason && (
        <RejectReasonDrawer
          isOpen={isOpen}
          onClose={closeDrawer}
          rejectReason={delegation.rejectionReason}
        />
      )}
    </PageContainer>
  )
}
