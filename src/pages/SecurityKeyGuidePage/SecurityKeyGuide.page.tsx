import React from 'react'
import { PageContainer } from '@/components/layout/containers'
import { useTranslation } from 'react-i18next'
import axiosInstance from '@/config/axios'
import { FE_URL } from '@/config/env'
import { Grid } from '@mui/material'

const SecurityKeyGuidePage: React.FC = () => {
  const { t } = useTranslation('common', { keyPrefix: 'securityKeyGuide' })
  const [htmlString, setHtmlString] = React.useState('')

  React.useEffect(() => {
    async function asyncFetchData() {
      const resp = await axiosInstance.get(`${FE_URL}/data/it/public-key.json`)
      setHtmlString(resp.data.html)
    }

    asyncFetchData()
  }, [])

  return (
    <PageContainer title={t('title')}>
      <Grid container>
        <Grid item xs={8}>
          <div dangerouslySetInnerHTML={{ __html: htmlString }} />
        </Grid>
      </Grid>
    </PageContainer>
  )
}

export default SecurityKeyGuidePage
