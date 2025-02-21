import React from 'react'
import { PageContainer } from '@/components/layout/containers'
import { useParams } from '@/router'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { useActiveTab } from '@/hooks/useActiveTab'
import { TemplateQueries } from '@/api/template'
import { ProviderEServiceTemplateDetailsTab } from '../ProviderEServiceTemplateDetailsPage/components/ProviderEServiceTemplateDetailsTab/ProviderEServiceTemplateDetailsTab'
import { ConsumerEServiceTemplateDetails } from './components'

const ConsumerEServiceTemplateDetailsPage: React.FC = () => {
  const { t } = useTranslation('template', { keyPrefix: 'read' })
  const { eServiceTemplateId, eServiceTemplateVersionId } =
    useParams<'SUBSCRIBE_ESERVICE_TEMPLATE_DETAILS'>()

  const { data: template } = useQuery(
    TemplateQueries.getSingle(eServiceTemplateId, eServiceTemplateVersionId)
  )

  return (
    <PageContainer
      title={template?.eserviceTemplate.name || ''}
      isLoading={!template}
      statusChip={
        //TODO è la chip per template è già implementata nel branch pin-6016
        template
          ? {
              for: 'eservice', // TODO sostituire con template
              state: template?.state,
            }
          : undefined
      }
      backToAction={{
        label: t('actions.backToEserviceTemplateListLabel'),
        to: 'PROVIDE_ESERVICE_TEMPLATES_LIST',
      }}
    >
      <ConsumerEServiceTemplateDetails />
    </PageContainer>
  )
}

export default ConsumerEServiceTemplateDetailsPage
