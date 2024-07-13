import { useTranslation } from 'react-i18next'
import { AppLayout } from '../layout'
import { PageContainer } from '../layout/containers'
import { RouterButton } from './RouterButton'

export function NotFoundComponent() {
  const { t } = useTranslation('error')

  return (
    <AppLayout hideSideNav>
      <PageContainer
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          textAlign: 'center',
        }}
        title={t('notFound.title')}
        description={t('notFound.description')}
      >
        <RouterButton sx={{ mt: 4 }} variant="contained" to="/fruizione/catalogo-e-service">
          {t('actions.backToHome')}
        </RouterButton>
      </PageContainer>
    </AppLayout>
  )
}
