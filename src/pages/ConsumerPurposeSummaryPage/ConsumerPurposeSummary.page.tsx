import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from '@/router'
import { Button, Stack } from '@mui/material'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import CreateIcon from '@mui/icons-material/Create'
import PublishIcon from '@mui/icons-material/Publish'
import { PurposeMutations, PurposeQueries } from '@/api/purpose'
import { SummaryAccordion } from '../../components/shared/SummaryAccordion'
import { PageContainer } from '@/components/layout/containers'
import {
  ConsumerPurposeSummaryClientsAccordion,
  ConsumerPurposeSummaryGeneralInformationAccordion,
  ConsumerPurposeSummaryRiskAnalysisAccordion,
} from './components'

const ConsumerPurposeSummaryPage: React.FC = () => {
  const { t } = useTranslation('purpose')
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'actions' })

  const { purposeId } = useParams<'SUBSCRIBE_PURPOSE_SUMMARY'>()

  const navigate = useNavigate()

  const { data: purpose, isInitialLoading } = PurposeQueries.useGetSingle(purposeId)

  const { mutate: deleteDraft } = PurposeMutations.useDeleteDraft()
  const { mutate: publishDraft } = PurposeMutations.useActivateVersion()

  const handleDeleteDraft = () => {
    if (!purpose) return
    deleteDraft(
      { purposeId },
      {
        onSuccess() {
          navigate('SUBSCRIBE_PURPOSE_LIST')
        },
      }
    )
  }

  const handleEditDraft = () => {
    if (!purpose) return
    navigate('SUBSCRIBE_PURPOSE_EDIT', {
      params: {
        purposeId: purposeId,
      },
    })
  }

  const handlePublishDraft = () => {
    if (!purpose || !purpose.currentVersion) return
    publishDraft(
      { purposeId, versionId: purpose.currentVersion.id },
      {
        onSuccess() {
          navigate('SUBSCRIBE_PURPOSE_DETAILS', {
            params: {
              purposeId: purposeId,
            },
          })
        },
      }
    )
  }

  return (
    <PageContainer
      title={t('summary.title')}
      backToAction={{
        label: t('edit.backToListBtn'),
        to: 'SUBSCRIBE_PURPOSE_LIST',
      }}
      isLoading={isInitialLoading}
      statusChip={purpose ? { for: 'purpose', purpose: purpose } : undefined}
    >
      <Stack spacing={3}>
        <SummaryAccordion headline="1" title={t('summary.generalInformationSection.title')}>
          {purpose && <ConsumerPurposeSummaryGeneralInformationAccordion purpose={purpose} />}
        </SummaryAccordion>
        <SummaryAccordion headline="2" title={t('summary.riskAnalysisSection.title')}>
          {purpose && <ConsumerPurposeSummaryRiskAnalysisAccordion purpose={purpose} />}
        </SummaryAccordion>
        <SummaryAccordion headline="3" title={t('summary.clientsSection.title')}>
          {purpose && <ConsumerPurposeSummaryClientsAccordion purpose={purpose} />}
        </SummaryAccordion>
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

export default ConsumerPurposeSummaryPage
