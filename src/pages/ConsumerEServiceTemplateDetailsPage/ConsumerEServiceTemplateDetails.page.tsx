import React from 'react'
import { PageContainer } from '@/components/layout/containers'
import { useParams } from '@/router'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { EServiceTemplateQueries } from '@/api/eserviceTemplate'
import { ConsumerEServiceTemplateDetails } from './components'
import { useGetConsumerEServiceTemplateActions } from './hooks/useGetConsumerEServiceTemplateActions'

const ConsumerEServiceTemplateDetailsPage: React.FC = () => {
  const { t } = useTranslation('eserviceTemplate', { keyPrefix: 'read' })
  const { eServiceTemplateId, eServiceTemplateVersionId } =
    useParams<'SUBSCRIBE_ESERVICE_TEMPLATE_DETAILS'>()

  const { data: eserviceTemplate } = useQuery(
    EServiceTemplateQueries.getSingle(eServiceTemplateId, eServiceTemplateVersionId)
  )

  const isAlreadyInstantiated = eserviceTemplate?.isAlreadyInstantiated ?? false
  const hasRequesterRiskAnalysis = eserviceTemplate?.hasRequesterRiskAnalysis ?? true
  const hasPersonalDataValue = eserviceTemplate?.eserviceTemplate.personalData !== undefined

  const { actions } = useGetConsumerEServiceTemplateActions(
    eServiceTemplateId,
    isAlreadyInstantiated,
    hasRequesterRiskAnalysis,
    eserviceTemplate?.state,
    hasPersonalDataValue
  )
  return (
    <PageContainer
      title={eserviceTemplate?.eserviceTemplate.name || ''}
      isLoading={!eserviceTemplate}
      topSideActions={actions}
      statusChip={
        eserviceTemplate
          ? {
              for: 'eserviceTemplate',
              state: eserviceTemplate?.state,
            }
          : undefined
      }
      backToAction={{
        label: t('actions.backToEserviceTemplateCatalog'),
        to: 'PROVIDE_ESERVICE_TEMPLATE_CATALOG',
      }}
    >
      <ConsumerEServiceTemplateDetails />
    </PageContainer>
  )
}

export default ConsumerEServiceTemplateDetailsPage
