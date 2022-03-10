import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { StyledIntro } from '../components/Shared/StyledIntro'
import { PUBLIC_URL, URL_FE } from '../lib/constants'

const anchorBitsRegex = /href="(#.*)"/gi
const localAssetsRegex = /..\/..\/..\/public/gi

export function Help() {
  const [htmlString, setHtmlString] = useState('')

  useEffect(() => {
    async function asyncFetchData() {
      const { pathname } = window.location
      const resp = await axios.get(`${URL_FE}/data/help.json`)
      const html = resp.data.html
        .replace(anchorBitsRegex, `href="${pathname}$1"`)
        .replace(localAssetsRegex, PUBLIC_URL)
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

      <div dangerouslySetInnerHTML={{ __html: htmlString }} />
    </React.Fragment>
  )
}
