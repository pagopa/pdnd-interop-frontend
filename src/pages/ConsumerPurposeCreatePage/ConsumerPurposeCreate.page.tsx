import React from 'react'
import { PageContainer } from '@/components/layout/containers'
import { useTranslation } from 'react-i18next'
import { PurposeCreateEServiceForm } from './components/PurposeCreateEServiceForm'
import { PurposeQueries } from '@/api/purpose'

const ConsumerPurposeCreatePage: React.FC = () => {
  const { t } = useTranslation('purpose')
  const { data: riskAnalysis } = PurposeQueries.useGetRiskAnalysisLatest({
    suspense: false,
  })
  console.log(riskAnalysis)

  return (
    <PageContainer title={t('create.emptyTitle')}>
      <PurposeCreateEServiceForm />
    </PageContainer>
  )
}

export default ConsumerPurposeCreatePage
