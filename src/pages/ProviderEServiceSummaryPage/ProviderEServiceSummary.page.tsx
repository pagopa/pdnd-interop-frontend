import React from 'react'
import { PageContainer } from '@/components/layout/containers'
import { Trans, useTranslation } from 'react-i18next'
import { useNavigate, useParams } from '@/router'
import { EServiceMutations, EServiceQueries } from '@/api/eservice'
import { Alert, Button, Link, Stack, Tooltip } from '@mui/material'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import CreateIcon from '@mui/icons-material/Create'
import PublishIcon from '@mui/icons-material/Publish'
import { SummaryAccordion, SummaryAccordionSkeleton } from '@/components/shared/SummaryAccordion'
import {
  ProviderEServiceDocumentationSummary,
  ProviderEServiceGeneralInfoSummary,
  ProviderEServiceVersionInfoSummary,
} from './components'
import { ProviderEServiceAttributeVersionSummary } from './components/ProviderEServiceAttributeVersionSummary'
import { ProviderEServiceRiskAnalysisSummaryList } from './components/ProviderEServiceRiskAnalysisSummaryList'
import { useQuery } from '@tanstack/react-query'
import { RejectReasonDrawer } from '@/components/shared/RejectReasonDrawer'
import { useDrawerState } from '@/hooks/useDrawerState'
import { AuthHooks } from '@/api/auth'
import { useGetDelegationUserRole } from '@/hooks/useGetDelegationUserRole'

const ProviderEServiceSummaryPage: React.FC = () => {
  const { t } = useTranslation('eservice')
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'actions' })
  const { jwt } = AuthHooks.useJwt()

  const { eserviceId, descriptorId } = useParams<'PROVIDE_ESERVICE_SUMMARY'>()
  const navigate = useNavigate()

  const { isOpen, openDrawer, closeDrawer } = useDrawerState()

  const { isDelegator, isDelegate, producerDelegations } = useGetDelegationUserRole({
    eserviceId,
    organizationId: jwt?.organizationId,
  })

  const { mutate: deleteVersion } = EServiceMutations.useDeleteVersionDraft()
  const { mutate: deleteDraft } = EServiceMutations.useDeleteDraft()
  const { mutate: publishVersion } = EServiceMutations.usePublishVersionDraft({
    isByDelegation: isDelegate,
  })

  const { data: descriptor, isLoading } = useQuery(
    EServiceQueries.getDescriptorProvider(eserviceId, descriptorId)
  )

  const handleDeleteDraft = () => {
    if (!descriptor) return

    const hasOnlyOneDraft = descriptor.eservice.descriptors.length === 0

    // In case the e-service has only one draft, we call the deleteDraft mutation
    if (hasOnlyOneDraft) {
      deleteDraft({ eserviceId }, { onSuccess: () => navigate('PROVIDE_ESERVICE_LIST') })
      return
    }

    // ...otherwise, if the e-service has more than one descriptor with the last draft, we call the deleteVersion mutation
    deleteVersion(
      { eserviceId, descriptorId },
      { onSuccess: () => navigate('PROVIDE_ESERVICE_LIST') }
    )
  }

  const handleEditDraft = () => {
    if (!descriptor) return
    navigate('PROVIDE_ESERVICE_EDIT', {
      params: {
        eserviceId: descriptor.eservice.id,
        descriptorId: descriptor.id,
      },
      state: { stepIndexDestination: 1 },
    })
  }

  const handlePublishDraft = () => {
    if (!descriptor) return

    const delegation = producerDelegations?.find(
      (delegation) => delegation.eservice?.id === eserviceId
    )

    publishVersion(
      {
        eserviceId: descriptor.eservice.id,
        descriptorId: descriptor.id,
        delegatorName: delegation?.delegator.name,
        eserviceName: delegation?.eservice?.name,
      },
      {
        onSuccess: () =>
          navigate('PROVIDE_ESERVICE_MANAGE', {
            params: {
              eserviceId: descriptor.eservice.id,
              descriptorId: descriptor.id,
            },
          }),
      }
    )
  }

  const canBePublished = () => {
    return !!(
      descriptor &&
      descriptor.interface &&
      descriptor.description &&
      descriptor.audience[0] &&
      descriptor.voucherLifespan &&
      descriptor.dailyCallsPerConsumer &&
      descriptor.dailyCallsTotal >= descriptor.dailyCallsPerConsumer
    )
  }

  const isReceiveMode = descriptor?.eservice.mode === 'RECEIVE'

  const sortedRejectedReasons = descriptor?.rejectionReasons?.slice().sort((a, b) => {
    const dateA = new Date(a.rejectedAt)
    const dateB = new Date(b.rejectedAt)
    return dateB.getTime() - dateA.getTime()
  })

  return (
    <PageContainer
      title={t('summary.title', {
        eserviceName: descriptor?.eservice.name,
        versionNumber: descriptor?.version ?? '1',
      })}
      backToAction={{
        label: t('backToListBtn'),
        to: 'PROVIDE_ESERVICE_LIST',
      }}
      isLoading={isLoading}
      statusChip={{
        for: 'eservice',
        state: 'DRAFT',
        isDraftToCorrect: descriptor?.rejectionReasons && descriptor.rejectionReasons.length > 0,
      }}
    >
      <Stack spacing={3}>
        {descriptor && descriptor.rejectionReasons?.length !== 0 && (
          <Alert severity="error" variant="outlined">
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
              {isDelegator
                ? t('summary.rejectedDelegatedVersionDraftAlert.delegator')
                : t('summary.rejectedDelegatedVersionDraftAlert.delegate')}
            </Trans>
          </Alert>
        )}

        <React.Suspense fallback={<SummaryAccordionSkeleton />}>
          <SummaryAccordion headline="1" title={t('summary.generalInfoSummary.title')}>
            <ProviderEServiceGeneralInfoSummary />
          </SummaryAccordion>
        </React.Suspense>

        {isReceiveMode && (
          <React.Suspense fallback={<SummaryAccordionSkeleton />}>
            <SummaryAccordion headline="2" title={t('summary.riskAnalysisSummaryList.title')}>
              <ProviderEServiceRiskAnalysisSummaryList />
            </SummaryAccordion>
          </React.Suspense>
        )}

        <React.Suspense fallback={<SummaryAccordionSkeleton />}>
          <SummaryAccordion
            headline={isReceiveMode ? '3' : '2'}
            title={t('summary.versionInfoSummary.title')}
          >
            <ProviderEServiceVersionInfoSummary />
          </SummaryAccordion>
        </React.Suspense>

        <React.Suspense fallback={<SummaryAccordionSkeleton />}>
          <SummaryAccordion
            headline={isReceiveMode ? '4' : '3'}
            title={t('summary.attributeVersionSummary.title')}
          >
            <ProviderEServiceAttributeVersionSummary />
          </SummaryAccordion>
        </React.Suspense>

        <React.Suspense fallback={<SummaryAccordionSkeleton />}>
          <SummaryAccordion
            headline={isReceiveMode ? '5' : '4'}
            title={t('summary.documentationSummary.title')}
          >
            <ProviderEServiceDocumentationSummary />
          </SummaryAccordion>
        </React.Suspense>
      </Stack>
      {isDelegate && (
        <Stack spacing={1} sx={{ mt: 4 }} direction="row" justifyContent="end">
          <Button
            startIcon={<DeleteOutlineIcon />}
            variant="text"
            color="error"
            onClick={handleDeleteDraft}
          >
            {tCommon('deleteDraft')}
          </Button>
          <Button startIcon={<CreateIcon />} variant="text" onClick={handleEditDraft}>
            {tCommon('editDraft')}
          </Button>
          <PublishButton onClick={handlePublishDraft} disabled={!canBePublished()} />
        </Stack>
      )}

      {sortedRejectedReasons && sortedRejectedReasons.length !== 0 && (
        <RejectReasonDrawer
          isOpen={isOpen}
          onClose={closeDrawer}
          rejectReason={sortedRejectedReasons[0].rejectionReason}
        />
      )}
    </PageContainer>
  )
}

type PublishButtonProps = {
  disabled: boolean
  onClick: VoidFunction
}

const PublishButton: React.FC<PublishButtonProps> = ({ disabled, onClick }) => {
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'actions' })
  const { t } = useTranslation('eservice', { keyPrefix: 'summary' })

  const Wrapper = disabled
    ? ({ children }: { children: React.ReactElement }) => (
        <Tooltip arrow title={t('notPublishableTooltip.label')}>
          <span tabIndex={disabled ? 0 : undefined}>{children}</span>
        </Tooltip>
      )
    : React.Fragment

  return (
    <Wrapper>
      <Button disabled={disabled} startIcon={<PublishIcon />} variant="contained" onClick={onClick}>
        {tCommon('publish')}
      </Button>
    </Wrapper>
  )
}

export default ProviderEServiceSummaryPage
