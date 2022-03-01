import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { StyledIntro } from '../components/Shared/StyledIntro'

export function Help() {
  const [htmlString, setHtmlString] = useState('')

  useEffect(() => {
    async function asyncFetchData() {
      const resp = await axios.get(`${window.location.origin}/data/help.json`)
      setHtmlString(resp.data.html)
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
