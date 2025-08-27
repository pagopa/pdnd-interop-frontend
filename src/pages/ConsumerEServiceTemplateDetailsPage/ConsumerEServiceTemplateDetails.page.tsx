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

  const { data: template } = useQuery(
    EServiceTemplateQueries.getSingle(eServiceTemplateId, eServiceTemplateVersionId)
  )

  const isAlreadyInstantiated = template?.isAlreadyInstantiated ?? false
  const hasRequesterRiskAnalysis = template?.hasRequesterRiskAnalysis ?? true

  const { actions } = useGetConsumerEServiceTemplateActions(
    eServiceTemplateId,
    isAlreadyInstantiated,
    hasRequesterRiskAnalysis,
    template?.state
  )
  return (
    <PageContainer
      title={template?.eserviceTemplate.name || ''}
      isLoading={!template}
      topSideActions={actions}
      statusChip={
        template
          ? {
              for: 'eserviceTemplate',
              state: template?.state,
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
