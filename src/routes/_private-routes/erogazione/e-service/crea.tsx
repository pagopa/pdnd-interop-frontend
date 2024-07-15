import { PageContainer } from '@/components/layout/containers'
import { createFileRoute } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { EServiceCreationSteps } from './-components/EServiceCreationSteps'

export const Route = createFileRoute('/_private-routes/erogazione/e-service/crea')({
  component: ProviderEServiceCreatePage,
  staticData: {
    routeKey: 'PROVIDE_ESERVICE_CREATE',
    authLevels: ['admin', 'api'],
    hideSideNav: true,
  },
})

function ProviderEServiceCreatePage() {
  const { t } = useTranslation('eservice')

  return (
    <PageContainer
      title={t('create.emptyTitle')}
      backToAction={{
        label: t('backToListBtn'),
        to: '/erogazione/e-service',
      }}
    >
      <EServiceCreationSteps />
    </PageContainer>
  )
}
