import React from 'react'
import { PageContainer } from '@/components/layout/containers'
import { Purpose } from '@/types/purpose.types'
import { useTranslation } from 'react-i18next'
import { EServiceQueries } from '@/api/eservice'
import { useJwt } from '@/hooks/useJwt'
import {
  PurposeCreateEServiceForm,
  PurposeCreateEServiceFormSkeleton,
} from './components/PurposeCreateEServiceForm'

export type PurposeCreateFormValues = {
  eserviceId: string | null
  useTemplate: boolean
  template: Purpose | null
}

const defaultValues: PurposeCreateFormValues = {
  eserviceId: '',
  useTemplate: false,
  template: null,
}

const ConsumerPurposeCreatePage: React.FC = () => {
  const { t } = useTranslation('purpose')
  const { jwt } = useJwt()
  const { data: eservices = [], isLoading: isLoadingEServices } = EServiceQueries.useGetListFlat({
    callerId: jwt?.organizationId,
    consumerId: jwt?.organizationId,
    agreementStates: ['ACTIVE'],
    state: 'PUBLISHED',
  })

  defaultValues.eserviceId = eservices[0]?.id ?? ''

  return (
    <PageContainer title={t('create.emptyTitle')}>
      {isLoadingEServices && <PurposeCreateEServiceFormSkeleton />}
      {!isLoadingEServices && <PurposeCreateEServiceForm defaultValues={defaultValues} />}
    </PageContainer>
  )
}

export default ConsumerPurposeCreatePage
