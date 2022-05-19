import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { StyledIntro } from '../components/Shared/StyledIntro'
import { URL_FE } from '../lib/constants'
import { getReplacedAssetsPaths } from '../lib/guides-utils'
import { Grid } from '@mui/material'
import { useTranslation } from 'react-i18next'

export function Help() {
  const { t } = useTranslation('common', { keyPrefix: 'help' })
  const [htmlString, setHtmlString] = useState('')

  useEffect(() => {
    async function asyncFetchData() {
      const resp = await axios.get(`${URL_FE}/data/it/help.json`)
      const html = getReplacedAssetsPaths(resp.data.html)
      setHtmlString(html)
    }

    asyncFetchData()
  }, [])

  return (
    <React.Fragment>
      <StyledIntro>{{ title: t('title'), description: t('description') }}</StyledIntro>

      <Grid container>
        <Grid item xs={8}>
          <div dangerouslySetInnerHTML={{ __html: htmlString }} />
        </Grid>
      </Grid>
    </React.Fragment>
  )
}
