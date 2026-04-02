import React from 'react'
import { PageContainer } from '@/components/layout/containers'
import { useTranslation } from 'react-i18next'
import { PurposeCreateForm } from './components/PurposeCreateForm'
import { useParams } from '@/router'
import { RequiredTextLabel } from '@/components/shared/RequiredTextLabel'

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
      <RequiredTextLabel />
      <PurposeCreateForm purposeTemplateId={purposeTemplateId} />
    </PageContainer>
  )
}

export default ConsumerPurposeCreatePage
