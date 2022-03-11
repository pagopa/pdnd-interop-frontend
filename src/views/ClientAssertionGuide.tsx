import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { StyledIntro } from '../components/Shared/StyledIntro'
import { URL_FE } from '../lib/constants'
import { getReplacedAssetsPaths } from '../lib/guides-utils'

export function ClientAssertionGuide() {
  const [htmlString, setHtmlString] = useState('')

  useEffect(() => {
    async function asyncFetchData() {
      const resp = await axios.get(`${URL_FE}/data/it/client-assertion.json`)
      const html = getReplacedAssetsPaths(resp.data.html)
      setHtmlString(html)
    }

    asyncFetchData()
  }, [])

  return (
    <React.Fragment>
      <StyledIntro>
        {{
          title: 'Guida alla client assertion',
          description:
            "NB: questa guida sarà sostituita da un portale documentale all'entrata in esercizio della piattaforma",
        }}
      </StyledIntro>

      <div dangerouslySetInnerHTML={{ __html: htmlString }} />
    </React.Fragment>
  )
}
