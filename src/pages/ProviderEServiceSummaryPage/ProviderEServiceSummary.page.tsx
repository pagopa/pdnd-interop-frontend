import React from 'react'
import { PageContainer } from '@/components/layout/containers'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from '@/router'
import { EServiceMutations, EServiceQueries } from '@/api/eservice'
import { Button, Stack, Tooltip } from '@mui/material'
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

const ProviderEServiceSummaryPage: React.FC = () => {
  const { t } = useTranslation('eservice')
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'actions' })

  const { eserviceId, descriptorId } = useParams<'PROVIDE_ESERVICE_SUMMARY'>()
  const navigate = useNavigate()

  const { mutate: deleteVersion } = EServiceMutations.useDeleteVersionDraft()
  const { mutate: deleteDraft } = EServiceMutations.useDeleteDraft()
  const { mutate: publishVersion } = EServiceMutations.usePublishVersionDraft()

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
    publishVersion(
      { eserviceId: descriptor.eservice.id, descriptorId: descriptor.id },
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
      statusChip={{ for: 'eservice', state: 'DRAFT' }}
    >
      <Stack spacing={3}>
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
