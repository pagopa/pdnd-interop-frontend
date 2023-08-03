import React from 'react'
import { PageContainer } from '@/components/layout/containers'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from '@/router'
import { EServiceMutations, EServiceQueries } from '@/api/eservice'
import { Button, Stack } from '@mui/material'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import CreateIcon from '@mui/icons-material/Create'
import PublishIcon from '@mui/icons-material/Publish'
import { SummaryAccordion } from '@/components/shared/SummaryAccordion'

const ProviderEServiceSummaryPage: React.FC = () => {
  const { t } = useTranslation('eservice')
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'actions' })

  const params = useParams<'PROVIDE_ESERVICE_SUMMARY'>()
  const navigate = useNavigate()

  const { mutate: deleteVersion } = EServiceMutations.useDeleteVersionDraft()
  const { mutate: publishVersion } = EServiceMutations.usePublishVersionDraft()

  const { data: descriptor, isInitialLoading } = EServiceQueries.useGetDescriptorProvider(
    params?.eserviceId,
    params?.descriptorId,
    {
      suspense: false,
    }
  )

  const handleDeleteDraft = () => {
    if (!descriptor) return
    deleteVersion(
      { eserviceId: descriptor.eservice.id, descriptorId: descriptor.id },
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

  console.log({ descriptor })

  return (
    <PageContainer
      title={t('summary.title', {
        eserviceName: descriptor?.eservice.name,
        versionNumber: descriptor?.version,
      })}
      backToAction={{
        label: t('backToListBtn'),
        to: 'PROVIDE_ESERVICE_LIST',
      }}
      isLoading={isInitialLoading}
      statusChip={{ for: 'eservice', state: 'DRAFT' }}
    >
      <Stack spacing={3}>
        <SummaryAccordion headline="1" title={t('summary.generalInformationSection.title')}>
          <div>Summary</div>
        </SummaryAccordion>
        <SummaryAccordion headline="2" title={t('summary.versionInformationSection.title')}>
          <div>Summary</div>
        </SummaryAccordion>
        <SummaryAccordion headline="3" title={t('summary.attributeVersion.title')}>
          <div>Summary</div>
        </SummaryAccordion>
        <SummaryAccordion headline="4" title={t('summary.documentationSection.title')}>
          <div>Summary</div>
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

export default ProviderEServiceSummaryPage
