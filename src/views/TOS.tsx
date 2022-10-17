import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { StyledIntro } from '../components/Shared/StyledIntro'
import { getReplacedAssetsPaths } from '../lib/guides-utils'
import { Grid } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { FE_URL } from '../lib/env'

export function TOS() {
  const { t } = useTranslation('common', { keyPrefix: 'tos' })
  const [htmlString, setHtmlString] = useState('')

  useEffect(() => {
    async function asyncFetchData() {
      const resp = await axios.get(`${FE_URL}/data/it/tos.json`)
      const html = getReplacedAssetsPaths(resp.data.html)
      setHtmlString(html)
    }

    asyncFetchData()
  }, [])

  return (
    <React.Fragment>
      <Grid container>
        <Grid item xs={8} sx={{ px: 3, py: 3 }}>
          <StyledIntro>{{ title: t('title') }}</StyledIntro>
          <div dangerouslySetInnerHTML={{ __html: htmlString }} />
        </Grid>
      </Grid>
    </React.Fragment>
  )
}
