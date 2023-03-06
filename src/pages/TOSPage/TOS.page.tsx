import React from 'react'
import { PageContainer } from '@/components/layout/containers'
import { FE_URL } from '@/config/env'
import axiosInstance from '@/config/axios'
import { useTranslation } from 'react-i18next'

const TOSPage: React.FC = () => {
  const { t } = useTranslation('common', { keyPrefix: 'tos' })
  const [htmlString, setHtmlString] = React.useState('')

  React.useEffect(() => {
    async function asyncFetchData() {
      const resp = await axiosInstance.get(`${FE_URL}/data/it/tos.json`)
      setHtmlString(resp.data.html)
    }

    asyncFetchData()
  }, [])

  return (
    <PageContainer sx={{ maxWidth: 800, mx: 'auto', py: 12 }} title={t('title')}>
      <div dangerouslySetInnerHTML={{ __html: htmlString }} />
    </PageContainer>
  )
}

export default TOSPage
