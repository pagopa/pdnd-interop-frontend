import React from 'react'
import { PageContainer } from '@/components/layout/containers'
import { useTranslation } from 'react-i18next'
import { PurposeCreateForm } from './components/PurposeCreateForm'
import { useParams } from '@/router'
import { Typography } from '@mui/material'

const ConsumerPurposeCreatePage: React.FC = () => {
  const { t } = useTranslation('purpose')
  const { purposeTemplateId } = useParams<'SUBSCRIBE_PURPOSE_CREATE_FROM_TEMPLATE'>()

  return (
    <PageContainer
      title={t('create.emptyTitle')}
      backToAction={{
        label: t('backToListBtn'),
        to: 'SUBSCRIBE_PURPOSE_LIST',
      }}
    >
      <Typography
        sx={{
          fontSize: 16,
          fontWeight: 700,
          color: 'text.secondary',
        }}
      >
        {t('create.requiredLabel')}
      </Typography>
      <PurposeCreateForm purposeTemplateId={purposeTemplateId} />
    </PageContainer>
  )
}

export default ConsumerPurposeCreatePage
