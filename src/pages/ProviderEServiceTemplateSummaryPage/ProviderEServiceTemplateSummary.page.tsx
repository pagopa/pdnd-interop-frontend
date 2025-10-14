import React from 'react'
import { PageContainer } from '@/components/layout/containers'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from '@/router'
import { Button, Stack, Tooltip } from '@mui/material'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import CreateIcon from '@mui/icons-material/Create'
import PublishIcon from '@mui/icons-material/Publish'
import { SummaryAccordion, SummaryAccordionSkeleton } from '@/components/shared/SummaryAccordion'
import { useQuery } from '@tanstack/react-query'
import { EServiceTemplateMutations, EServiceTemplateQueries } from '@/api/eserviceTemplate'
import { ProviderEServiceTemplateGeneralInfoSummary } from './components/ProviderEServiceTemplateGeneralInfoSummary'
import {
  ProviderEServiceTemplateAttributeVersionSummary,
  ProviderEServiceTemplateDocumentationSummary,
  ProviderEServiceTemplateVersionInfoSummary,
} from './components'
import { ProviderEServiceTemplateRiskAnalysisSummaryList } from './components/ProviderEServiceTemplateRiskAnalysisSummaryList'
import { FEATURE_FLAG_ESERVICE_PERSONAL_DATA } from '@/config/env'

const ProviderEServiceTemplateSummaryPage: React.FC = () => {
  const { t } = useTranslation('eserviceTemplate')
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'actions' })

  const { eServiceTemplateId, eServiceTemplateVersionId } =
    useParams<'PROVIDE_ESERVICE_TEMPLATE_SUMMARY'>()
  const navigate = useNavigate()

  const { mutate: deleteVersion } = EServiceTemplateMutations.useDeleteVersionDraft()
  const { mutate: publishVersion } = EServiceTemplateMutations.usePublishVersionDraft()

  const { data: eserviceTemplate, isLoading } = useQuery(
    EServiceTemplateQueries.getSingle(eServiceTemplateId, eServiceTemplateVersionId)
  )

  const handleDeleteDraft = () => {
    if (!eserviceTemplate) return

    deleteVersion(
      { eServiceTemplateId, eServiceTemplateVersionId },
      { onSuccess: () => navigate('PROVIDE_ESERVICE_TEMPLATE_LIST') }
    )
  }

  const handleEditDraft = () => {
    if (!eserviceTemplate) return
    navigate('PROVIDE_ESERVICE_TEMPLATE_EDIT', {
      params: {
        eServiceTemplateId: eServiceTemplateId,
        eServiceTemplateVersionId: eServiceTemplateVersionId,
      },
      state: { stepIndexDestination: 1 },
    })
  }

  const handlePublishDraft = () => {
    if (!eserviceTemplate) return

    publishVersion(
      {
        eServiceTemplateId: eServiceTemplateId,
        eServiceTemplateVersionId: eServiceTemplateVersionId,
      },
      {
        onSuccess: () =>
          navigate('PROVIDE_ESERVICE_TEMPLATE_DETAILS', {
            params: {
              eServiceTemplateId: eServiceTemplateId,
              eServiceTemplateVersionId: eServiceTemplateVersionId,
            },
          }),
      }
    )
  }

  const canBePublished = () => {
    return !!eserviceTemplate?.interface
  }

  const isReceiveMode = eserviceTemplate?.eserviceTemplate.mode === 'RECEIVE'

  return (
    <PageContainer
      title={t('summary.title', {
        eserviceTemplateName: eserviceTemplate?.eserviceTemplate.name,
        versionEserviceTemplateNumber: eserviceTemplate?.version ?? '1',
      })}
      backToAction={{
        label: t('backToListBtn'),
        to: 'PROVIDE_ESERVICE_TEMPLATE_LIST',
      }}
      isLoading={isLoading}
      statusChip={{
        for: 'eserviceTemplate',
        state: 'DRAFT',
      }}
    >
      <Stack spacing={3}>
        <React.Suspense fallback={<SummaryAccordionSkeleton />}>
          <SummaryAccordion headline="1" title={t('summary.generalInfoSummary.title')}>
            <ProviderEServiceTemplateGeneralInfoSummary />
          </SummaryAccordion>
        </React.Suspense>

        {isReceiveMode && (
          <React.Suspense fallback={<SummaryAccordionSkeleton />}>
            <SummaryAccordion headline="2" title={t('summary.riskAnalysisSummaryList.title')}>
              <ProviderEServiceTemplateRiskAnalysisSummaryList />
            </SummaryAccordion>
          </React.Suspense>
        )}

        <React.Suspense fallback={<SummaryAccordionSkeleton />}>
          <SummaryAccordion
            headline={isReceiveMode ? '3' : '2'}
            title={t('summary.versionInfoSummary.title')}
          >
            <ProviderEServiceTemplateVersionInfoSummary />
          </SummaryAccordion>
        </React.Suspense>

        <React.Suspense fallback={<SummaryAccordionSkeleton />}>
          <SummaryAccordion
            headline={isReceiveMode ? '4' : '3'}
            title={t('summary.attributeVersionSummary.title')}
          >
            <ProviderEServiceTemplateAttributeVersionSummary />
          </SummaryAccordion>
        </React.Suspense>

        <React.Suspense fallback={<SummaryAccordionSkeleton />}>
          <SummaryAccordion
            headline={isReceiveMode ? '5' : '4'}
            title={t('summary.documentationSummary.title')}
          >
            <ProviderEServiceTemplateDocumentationSummary />
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
        <PublishButton
          onClick={handlePublishDraft}
          disabled={!canBePublished()}
          arePersonalDataSet={
            FEATURE_FLAG_ESERVICE_PERSONAL_DATA === 'true'
              ? !!eserviceTemplate?.eserviceTemplate.personalData
              : true
          }
        />
      </Stack>
    </PageContainer>
  )
}

type PublishButtonProps = {
  disabled: boolean
  onClick: VoidFunction
  arePersonalDataSet: boolean
}

const PublishButton: React.FC<PublishButtonProps> = ({ disabled, onClick, arePersonalDataSet }) => {
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'actions' })
  const { t } = useTranslation('eserviceTemplate', { keyPrefix: 'summary' })

  const Wrapper = disabled
    ? ({ children }: { children: React.ReactElement }) => (
        <Tooltip
          arrow
          title={
            arePersonalDataSet ? t('notPublishableTooltip.label') : t('missingPersonalDataField')
          }
        >
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

export default ProviderEServiceTemplateSummaryPage
