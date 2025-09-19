import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from '@/router'
import { Button, Stack } from '@mui/material'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import CreateIcon from '@mui/icons-material/Create'
import PublishIcon from '@mui/icons-material/Publish'
import {
  SummaryAccordion,
  SummaryAccordionSkeleton,
} from '../../components/shared/SummaryAccordion'
import { PageContainer } from '@/components/layout/containers'
import { PurposeTemplateQueries } from '@/api/purposeTemplate/purposeTemplate.queries'
import { useQuery } from '@tanstack/react-query'
import { PurposeTemplateMutations } from '@/api/purposeTemplate/purposeTemplate.mutations'
import { PurposeTemplateTemplateSummaryGeneralInformationAccordion } from './components'
import { PurposeTemplateSummaryLinkedEServiceAccordion } from './components/PurposeTemplateSummaryLinkedEServiceAccordion'
import { PurposeTemplateSummaryRiskAnalysisAccordion } from './components/PurposeTemplateSummaryRiskAnalysisAccordion'

const ConsumerPurposeTemplateTemplateSummaryPage: React.FC = () => {
  const { t } = useTranslation('purposeTemplate')
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'actions' })

  const { purposeTemplateId } = useParams<'SUBSCRIBE_PURPOSE_TEMPLATE_SUMMARY'>()

  const navigate = useNavigate()

  const { data: purposeTemplate, isLoading } = useQuery(
    PurposeTemplateQueries.getSingle(purposeTemplateId)
  )

  const { mutate: deleteDraft } = PurposeTemplateMutations.useDeleteDraft()
  const { mutate: publishDraft } = PurposeTemplateMutations.usePublishDraft()

  const handleDeleteDraft = () => {
    deleteDraft(
      { id: purposeTemplateId },
      {
        onSuccess() {
          navigate('SUBSCRIBE_PURPOSE_LIST')
        },
      }
    )
  }

  const handleEditDraft = () => {
    //TODO REMOVE COMMENT WHEN READY
    // navigate('SUBSCRIBE_PURPOSE_TEMPLATE_EDIT', {
    //   params: {
    //     purposeTemplateId,
    //   },
    // })
  }

  const handlePublishDraft = () => {
    publishDraft(
      { id: purposeTemplateId },
      {
        onSuccess() {
          //TODO REMOVE COMMENT WHEN READY, REMOVE NAVIGATE TO NOT_FOUND
          //   navigate('SUBSCRIBE_PURPOSE_TEMPLATE_DETAILS', {
          //     params: {
          //       purposeTemplateId,
          //     },
          //   })
          navigate('NOT_FOUND')
        },
      }
    )
  }
  purposeTemplate?.state

  return (
    <PageContainer
      title={t('edit.summary.title')}
      isLoading={isLoading}
      backToAction={{
        label: t('backToListBtn'),
        to: 'SUBSCRIBE_PURPOSE_TEMPLATE_LIST',
      }}
      statusChip={
        purposeTemplate ? { for: 'purposeTemplate', state: purposeTemplate.state } : undefined
      }
    >
      <Stack spacing={3}>
        <React.Suspense fallback={<SummaryAccordionSkeleton />}>
          <SummaryAccordion headline="1" title={t('edit.summary.generalInformationSection.title')}>
            <PurposeTemplateTemplateSummaryGeneralInformationAccordion
              purposeTemplateId={purposeTemplateId}
            />
          </SummaryAccordion>
        </React.Suspense>
        <React.Suspense fallback={<SummaryAccordionSkeleton />}>
          <SummaryAccordion headline="2" title={t('edit.summary.suggestedEServicesSection.title')}>
            <PurposeTemplateSummaryLinkedEServiceAccordion purposeTemplateId={purposeTemplateId} />
          </SummaryAccordion>
        </React.Suspense>
        <React.Suspense fallback={<SummaryAccordionSkeleton />}>
          <SummaryAccordion headline="3" title={t('edit.summary.riskAnalysisSection.title')}>
            <PurposeTemplateSummaryRiskAnalysisAccordion purposeTemplateId={purposeTemplateId} />
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
        <Button startIcon={<PublishIcon />} variant="contained" onClick={handlePublishDraft}>
          {tCommon('publish')}
        </Button>
      </Stack>
    </PageContainer>
  )
}

export default ConsumerPurposeTemplateTemplateSummaryPage
