import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { StyledIntro } from '../components/Shared/StyledIntro'
import { URL_FE } from '../lib/constants'

const linkBitsRegex = /<a\shref="*(.*)">(.*)<\/a>/gi

export function Help() {
  const [htmlString, setHtmlString] = useState('')

  useEffect(() => {
    async function asyncFetchData() {
      const { pathname } = window.location
      const resp = await axios.get(`${URL_FE}/data/help.json`)
      const html = resp.data.html.replace(linkBitsRegex, `<a href="${pathname}$1">$2<\/a>`)
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
