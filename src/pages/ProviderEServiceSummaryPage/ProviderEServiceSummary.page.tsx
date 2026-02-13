import React from 'react'
import { PageContainer } from '@/components/layout/containers'
import { Trans, useTranslation } from 'react-i18next'
import { useNavigate, useParams } from '@/router'
import { EServiceMutations, EServiceQueries } from '@/api/eservice'
import { Alert, Button, Link, Stack, Tooltip, Typography } from '@mui/material'
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
import { useGetProducerDelegationUserRole } from '@/hooks/useGetProducerDelegationUserRole'
import { useDialog } from '@/stores'
import { FEATURE_FLAG_ESERVICE_PERSONAL_DATA } from '@/config/env'
import { UpdatePersonalDataDrawer } from '@/components/shared/UpdatePersonalDataDrawer'
import type { EServiceMode } from '@/api/api.generatedTypes'

const ProviderEServiceSummaryPage: React.FC = () => {
  const { t } = useTranslation('eservice')
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'actions' })
  const { t: tDialogApproveDelegatedVersionDraft } = useTranslation('shared-components', {
    keyPrefix: 'dialogApproveDelegatedVersionDraft',
  })
  const { jwt } = AuthHooks.useJwt()
  const { isSupport } = AuthHooks.useJwt()

  const { eserviceId, descriptorId } = useParams<'PROVIDE_ESERVICE_SUMMARY'>()
  const navigate = useNavigate()
  const { openDialog, closeDialog } = useDialog()

  const { isOpen, openDrawer, closeDrawer } = useDrawerState()

  const { isDelegator, isDelegate, producerDelegations } = useGetProducerDelegationUserRole({
    eserviceId,
    organizationId: jwt?.organizationId,
  })

  const delegation = producerDelegations?.find(
    (delegation) => delegation.eservice?.id === eserviceId
  )

  const { mutate: deleteVersion } = EServiceMutations.useDeleteVersionDraft()
  const { mutate: deleteDraft } = EServiceMutations.useDeleteDraft()
  const { mutate: publishVersion } = EServiceMutations.usePublishVersionDraft({
    isByDelegation: isDelegate,
  })
  const { mutate: approveDelegatedVersionDraft } =
    EServiceMutations.useApproveDelegatedVersionDraft()

  const { data: descriptor, isLoading } = useQuery(
    EServiceQueries.getDescriptorProvider(eserviceId, descriptorId)
  )

  const { mutate: updateEservicePersonalData } =
    EServiceMutations.useUpdateEServicePersonalDataFlagAfterPublication()

  const { mutate: setEservicePersonalDataFirstDraft } = EServiceMutations.useUpdateDraft()

  const isEServiceFromTemplate = descriptor?.templateRef

  const hasOnlyOneDraft = descriptor?.eservice.descriptors.length === 0

  const handleDeleteDraft = () => {
    if (!descriptor) return

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

  const handleRejectDelegatedVersionDraft = () => {
    openDialog({
      type: 'rejectDelegatedVersionDraft',
      eserviceId,
      descriptorId,
    })
  }

  const handleApproveDelegatedVersionDraft = () => {
    const handleProceed = () => {
      approveDelegatedVersionDraft(
        { eserviceId, descriptorId },
        {
          onSuccess: () =>
            navigate('PROVIDE_ESERVICE_MANAGE', { params: { eserviceId, descriptorId } }),
        }
      )
      closeDialog()
    }

    openDialog({
      type: 'basic',
      title: tDialogApproveDelegatedVersionDraft('title'),
      description: tDialogApproveDelegatedVersionDraft('description', {
        eserviceName: delegation?.eservice?.name,
        delegateName: delegation?.delegate.name,
      }),
      proceedLabel: tDialogApproveDelegatedVersionDraft('actions.approveAndPublish'),
      onProceed: handleProceed,
    })
  }

  const checklistEServiceFromTemplate = (): boolean => {
    // if the descriptor is not from a template, return true, means that in canBePublished has not to have any condition
    if (!isEServiceFromTemplate) {
      return true
    }

    return !!descriptor.templateRef?.interfaceMetadata
  }

  const isReceiveMode = descriptor?.eservice.mode === 'RECEIVE'

  const arePersonalDataSet = descriptor?.eservice.personalData !== undefined

  const eserviceRiskAnalyses = descriptor?.eservice.riskAnalysis

  const isRulesetExpired =
    eserviceRiskAnalyses &&
    eserviceRiskAnalyses.some(
      (riskAnalysis) =>
        riskAnalysis.rulesetExpiration && new Date(riskAnalysis.rulesetExpiration) < new Date()
    )

  const canBePublished = () => {
    return (
      !!(
        descriptor &&
        descriptor.interface &&
        descriptor.description &&
        descriptor.audience[0] &&
        descriptor.voucherLifespan &&
        descriptor.dailyCallsPerConsumer &&
        descriptor.dailyCallsTotal >= descriptor.dailyCallsPerConsumer &&
        (FEATURE_FLAG_ESERVICE_PERSONAL_DATA ? arePersonalDataSet : true) &&
        !isRulesetExpired
      ) && checklistEServiceFromTemplate()
    )
  }

  const requireDelegateCorrections =
    descriptor?.rejectionReasons && descriptor.rejectionReasons.length > 0

  const sortedRejectedReasons = descriptor?.rejectionReasons?.slice().sort((a, b) => {
    const dateA = new Date(a.rejectedAt)
    const dateB = new Date(b.rejectedAt)
    return dateB.getTime() - dateA.getTime()
  })

  const eserviceLabel = t('summary.alertMissingPersonalData.eserviceLabel')
    .split('\n')
    .map((line, idx) => (
      <span key={idx}>
        {line}
        <br />
      </span>
    ))

  const {
    isOpen: isEServiceUpdatePersonalDataDrawerOpen,
    openDrawer: openUpdatePersonalDataDrawer,
    closeDrawer: closeEServiceUpdatePersonalDataDrawer,
  } = useDrawerState()

  const handleEServicePersonalDataUpdate = (eserviceId: string, personalData: boolean) => {
    if (hasOnlyOneDraft) {
      setEservicePersonalDataFirstDraft(
        {
          eserviceId: descriptor.eservice.id,
          description: descriptor.eservice.description,
          mode: descriptor.eservice.mode,
          name: descriptor.eservice.name,
          technology: descriptor.eservice.technology,
          isClientAccessDelegable: descriptor.eservice.isClientAccessDelegable,
          isConsumerDelegable: descriptor.eservice.isConsumerDelegable,
          isSignalHubEnabled: descriptor.eservice.isSignalHubEnabled,
          personalData: personalData,
        },
        { onSuccess: closeEServiceUpdatePersonalDataDrawer }
      )
    } else {
      updateEservicePersonalData(
        {
          eserviceId: eserviceId,
          personalData: personalData,
        },
        { onSuccess: closeEServiceUpdatePersonalDataDrawer }
      )
    }
  }

  const isGeneralInfoSectionValid =
    Boolean(descriptor?.eservice.description) &&
    Boolean(descriptor?.eservice.technology) &&
    (FEATURE_FLAG_ESERVICE_PERSONAL_DATA ? arePersonalDataSet : true)

  const isVersionInfoSectionValid =
    Boolean(descriptor?.description) &&
    Boolean(descriptor?.audience?.length) &&
    Boolean(descriptor?.voucherLifespan)

  const isDocumentationSectionValid = Boolean(descriptor?.interface)

  return (
    <>
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
          state: descriptor?.state || 'DRAFT',
          isDraftToCorrect: requireDelegateCorrections,
        }}
      >
        <Stack spacing={3}>
          {requireDelegateCorrections && (
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
            <SummaryAccordion
              headline="1"
              title={t('summary.generalInfoSummary.title')}
              defaultExpanded={true}
              showWarning={!isGeneralInfoSectionValid}
              warningLabel={t('summary.missingInformationsLabel')}
            >
              <ProviderEServiceGeneralInfoSummary />
            </SummaryAccordion>
          </React.Suspense>
          <React.Suspense fallback={<SummaryAccordionSkeleton />}>
            <SummaryAccordion headline="2" title={t('summary.attributeVersionSummary.title')}>
              <ProviderEServiceAttributeVersionSummary />
            </SummaryAccordion>
          </React.Suspense>
          {isReceiveMode && (
            <React.Suspense fallback={<SummaryAccordionSkeleton />}>
              <SummaryAccordion headline="3" title={t('summary.riskAnalysisSummaryList.title')}>
                <ProviderEServiceRiskAnalysisSummaryList />
              </SummaryAccordion>
            </React.Suspense>
          )}
          <React.Suspense fallback={<SummaryAccordionSkeleton />}>
            <SummaryAccordion
              headline={isReceiveMode ? '4' : '3'}
              title={t('summary.documentationSummary.title')}
              showWarning={!isVersionInfoSectionValid}
              warningLabel={t('summary.missingInformationsLabel')}
            >
              <ProviderEServiceDocumentationSummary />
            </SummaryAccordion>
          </React.Suspense>
          <React.Suspense fallback={<SummaryAccordionSkeleton />}>
            <SummaryAccordion
              headline={isReceiveMode ? '5' : '4'}
              title={t('summary.versionInfoSummary.title')}
              showWarning={!isDocumentationSectionValid}
              warningLabel={t('summary.missingInformationsLabel')}
            >
              <ProviderEServiceVersionInfoSummary />
            </SummaryAccordion>
          </React.Suspense>
          {FEATURE_FLAG_ESERVICE_PERSONAL_DATA &&
            !arePersonalDataSet &&
            isDelegator &&
            descriptor?.state === 'WAITING_FOR_APPROVAL' && (
              <Alert severity="error">
                {isEServiceFromTemplate
                  ? t('summary.alertMissingPersonalData.eserviceTemplateLabel')
                  : eserviceLabel}
              </Alert>
            )}
          {FEATURE_FLAG_ESERVICE_PERSONAL_DATA &&
            !arePersonalDataSet &&
            !isLoading &&
            !isDelegator &&
            !isEServiceFromTemplate && (
              <Alert severity="warning" sx={{ alignItems: 'center' }} variant="outlined">
                <Stack spacing={35} direction="row" alignItems="center">
                  {' '}
                  {/**TODO FIX SPACING */}
                  <Typography>{t('summary.alertUpdatePersonalData.label')}</Typography>
                  <Button
                    variant="naked"
                    size="medium"
                    sx={{ fontWeight: 700, mr: 1, alignSelf: 'flex-end' }}
                    onClick={openUpdatePersonalDataDrawer}
                  >
                    {tCommon('specifyProcessing')}
                  </Button>
                </Stack>
              </Alert>
            )}
        </Stack>
        {!isDelegator && (
          <>
            {!canBePublished() && (
              <Alert severity="warning" sx={{ mt: 3 }}>
                {t('summary.publishWarningLabel')}
              </Alert>
            )}
            <Stack spacing={1} sx={{ mt: 3 }} direction="row" justifyContent="end">
              <Button
                startIcon={<DeleteOutlineIcon />}
                variant="text"
                color="error"
                onClick={handleDeleteDraft}
                disabled={isSupport}
              >
                {tCommon('deleteDraft')}
              </Button>
              <Button
                startIcon={<CreateIcon />}
                variant="text"
                onClick={handleEditDraft}
                disabled={isSupport}
              >
                {tCommon('editDraft')}
              </Button>
              <PublishButton
                onClick={handlePublishDraft}
                disabled={!canBePublished() || isSupport}
                arePersonalDataSet={arePersonalDataSet}
                isRulesetExpired={isRulesetExpired}
              />
            </Stack>
          </>
        )}
        {isDelegator && descriptor?.state === 'WAITING_FOR_APPROVAL' && (
          <Stack spacing={1} sx={{ mt: 4 }} direction="row" justifyContent="end">
            <Button
              startIcon={<DeleteOutlineIcon />}
              variant="text"
              color="error"
              onClick={handleRejectDelegatedVersionDraft}
              disabled={isSupport}
            >
              {tCommon('reject')}
            </Button>
            <Tooltip title={arePersonalDataSet ? '' : t('summary.missingPersonalDataField')} arrow>
              <span>
                <Button
                  startIcon={<PublishIcon />}
                  variant="contained"
                  onClick={handleApproveDelegatedVersionDraft}
                  disabled={isSupport || !arePersonalDataSet}
                >
                  {tCommon('publish')}
                </Button>
              </span>
            </Tooltip>
          </Stack>
        )}
        {requireDelegateCorrections && sortedRejectedReasons && (
          <RejectReasonDrawer
            isOpen={isOpen}
            onClose={closeDrawer}
            rejectReason={sortedRejectedReasons[0].rejectionReason}
          />
        )}
      </PageContainer>
      <UpdatePersonalDataDrawer
        isOpen={isEServiceUpdatePersonalDataDrawerOpen}
        onClose={closeEServiceUpdatePersonalDataDrawer}
        eserviceId={descriptor?.eservice.id as string}
        personalData={descriptor?.eservice.personalData}
        onSubmit={handleEServicePersonalDataUpdate}
        eserviceMode={descriptor?.eservice.mode as EServiceMode}
        where="e-service"
      />
    </>
  )
}

type PublishButtonProps = {
  disabled: boolean
  onClick: VoidFunction
  arePersonalDataSet?: boolean
  isRulesetExpired?: boolean
}

const PublishButton: React.FC<PublishButtonProps> = ({
  disabled,
  onClick,
  arePersonalDataSet,
  isRulesetExpired,
}) => {
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'actions' })
  const { t } = useTranslation('eservice', { keyPrefix: 'summary' })
  let tooltipToShow = t('notPublishableTooltip.label')

  if (!arePersonalDataSet && FEATURE_FLAG_ESERVICE_PERSONAL_DATA) {
    tooltipToShow = t('missingPersonalDataField')
  } else if (isRulesetExpired) {
    tooltipToShow = t('rulesetExpiredTooltip.label')
  }

  const Wrapper = disabled
    ? ({ children }: { children: React.ReactElement }) => (
        <Tooltip arrow title={tooltipToShow}>
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
