import { PageContainer } from '@/components/layout/containers'
import { Link } from '@/router'
import React from 'react'
import { useTranslation } from 'react-i18next'

const NotFoundPage: React.FC = () => {
  const { t } = useTranslation('error')

  return (
    <PageContainer
      sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}
      title={t('notFound.title')}
      description={t('notFound.description')}
    >
      <Link as="button" variant="contained" to="PROVIDE_ESERVICE_LIST">
        {t('actions.backToHome')}
      </Link>
    </PageContainer>
  )
}

export default NotFoundPage
