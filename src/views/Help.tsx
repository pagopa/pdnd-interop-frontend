import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { StyledIntro } from '../components/Shared/StyledIntro'
import { URL_FE } from '../lib/constants'
import { getReplacedAssetsPaths } from '../lib/guides-utils'
import { Grid } from '@mui/material'

export function Help() {
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
      <StyledIntro>
        {{
          title: 'Guida introduttiva',
          description:
            "In questa pagina puoi trovare informazioni utili per gestire le operazioni e i problemi più comuni. NB: questa guida sarà sostituita da un portale documentale all'entrata in esercizio della piattaforma",
        }}
      </StyledIntro>

      <Grid container>
        <Grid item xs={8}>
          <div dangerouslySetInnerHTML={{ __html: htmlString }} />
        </Grid>
      </Grid>
    </React.Fragment>
  )
}
