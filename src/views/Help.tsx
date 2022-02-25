import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { StyledIntro } from '../components/Shared/StyledIntro'
import { Contained } from '../components/Shared/Contained'

export function Help() {
  const [htmlString, setHtmlString] = useState('')

  useEffect(() => {
    async function asyncFetchData() {
      const resp = await axios.get(`${window.location.origin}/data/help.txt`)
      setHtmlString(resp.data)
    }

    asyncFetchData()
  }, [])

  return (
    <React.Fragment>
      <StyledIntro sx={{ mb: 2 }}>
        {{
          title: 'Guida introduttiva',
          description:
            "In questa pagina puoi trovare informazioni utili per gestire le operazioni e i problemi più comuni. NB: questa guida sarà sostituita da un portale documentale all'entrata in esercizio della piattaforma",
        }}
      </StyledIntro>

      <Contained>
        <div dangerouslySetInnerHTML={{ __html: htmlString }} />
      </Contained>
    </React.Fragment>
  )
}
