import React /* useEffect, useState */ from 'react'
// import axios from 'axios'
import { StyledIntro } from '../components/Shared/StyledIntro'
// import { BASE_URL_FE_PROD, isProduction } from '../lib/constants'

export function Help() {
  // const [htmlString, setHtmlString] = useState('')

  // useEffect(() => {
  //   async function asyncFetchData() {
  //     const resp = await axios.get(
  //       `${isProduction ? `${BASE_URL_FE_PROD}/ui` : window.location.origin}/data/help.json`
  //     )
  //     console.log(window.location)
  //     setHtmlString(resp.data.html)
  //   }

  //   asyncFetchData()
  // }, [])

  return (
    <React.Fragment>
      <StyledIntro>
        {{
          title: 'Guida introduttiva',
          description:
            "In questa pagina puoi trovare informazioni utili per gestire le operazioni e i problemi più comuni. NB: questa guida sarà sostituita da un portale documentale all'entrata in esercizio della piattaforma",
        }}
      </StyledIntro>

      <div dangerouslySetInnerHTML={{ __html: '' }} />
    </React.Fragment>
  )
}
