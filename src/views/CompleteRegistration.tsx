import React, { useContext, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { fetchWithLogs } from '../lib/api-utils'
import { MessageNoAction } from '../components/MessageNoAction'
import { RequestOutcome, RequestOutcomeOptions } from '../../types'
import checkIllustration from '../assets/check-illustration.svg'
import redXIllustration from '../assets/red-x-illustration.svg'
import { StyledInputFile } from '../components/Shared/StyledInputFile'
import { getFetchOutcome } from '../lib/error-utils'
import { InlineSupportLink } from '../components/InlineSupportLink'
import isEmpty from 'lodash/isEmpty'
import { StyledIntro } from '../components/Shared/StyledIntro'
import { parseSearch } from '../lib/url-utils'
import { LoaderContext } from '../lib/context'
import { StyledButton } from '../components/Shared/StyledButton'
import { StyledForm } from '../components/Shared/StyledForm'
import { StyledLink } from '../components/Shared/StyledLink'

export function CompleteRegistration() {
  const { setLoadingText } = useContext(LoaderContext)
  const [outcome, setOutcome] = useState<RequestOutcome>()
  const [contract, setContract] = useState<Blob>()
  const location = useLocation()

  // From: https://stackoverflow.com/a/38552302
  // const parseJwt = (token: string) => {
  //   const base64Url = token.split('.')[1]
  //   const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
  //   const jsonPayload = decodeURIComponent(
  //     atob(base64)
  //       .split('')
  //       .map(function (c) {
  //         return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
  //       })
  //       .join('')
  //   )

  //   return JSON.parse(jsonPayload)
  // }

  const getJwt = () => {
    const s = parseSearch(location.search)
    return s.jwt
  }

  const token = getJwt()
  // const parsedToken = parseJwt(token)

  const handleSubmit = async (e: React.SyntheticEvent) => {
    // Avoid page reload
    e.preventDefault()
    // Start the loader
    setLoadingText('Stiamo caricando il tuo contratto')
    // Append the file as form data
    const formData = new FormData()
    formData.append('contract', contract!)
    // Send multipart/form-data POST request
    const contractPostResponse = await fetchWithLogs({
      path: { endpoint: 'ONBOARDING_COMPLETE_REGISTRATION', endpointParams: { token } },
      config: { data: formData, headers: { 'Content-Type': 'multipart/form-data' } },
    })
    // Stop the loader
    setLoadingText(null)

    // Check the outcome
    const outcome = getFetchOutcome(contractPostResponse)

    // Show it to the end user
    setOutcome(outcome)
  }

  const loadFile = (e: any) => {
    if (!isEmpty(e.target.files) && e.target.files.length > 0) {
      setContract(e.target.files[0])
    }
  }

  const outcomeContent: RequestOutcomeOptions = {
    success: {
      img: { src: checkIllustration, alt: "Icona dell'email" },
      title: 'Congratulazioni',
      description: [
        <p>
          La registrazione è completa. <StyledLink to="/">Clicca qui</StyledLink> per iniziare
        </p>,
      ],
    },
    error: {
      img: { src: redXIllustration, alt: "Icona dell'email" },
      title: 'Attenzione!',
      description: [
        <p>
          C'è stato un errore nel completamento della procedura. Assicurati che il file caricato sia
          l'accordo firmato. Per ritentare, ricarica la pagina. Se credi sia un errore,{' '}
          <InlineSupportLink />.
        </p>,
      ],
    },
  }

  return (
    <React.Fragment>
      {!outcome ? (
        <div className="mx-auto my-auto text-center">
          <StyledIntro sx={{ mx: 'auto' }}>
            {{
              title: 'Ciao!',
              description:
                "Per completare la procedura di registrazione, carica l'accordo ricevuto via email, completo della firma in originale del rappresentante legale",
            }}
          </StyledIntro>

          <StyledForm className="mt-4" onSubmit={handleSubmit}>
            <StyledInputFile
              id="contratto"
              onChange={loadFile}
              value={contract}
              label="carica accordo"
            />

            <StyledButton variant="contained" type="submit" disabled={!contract}>
              Prosegui
            </StyledButton>
          </StyledForm>
        </div>
      ) : (
        <MessageNoAction {...outcomeContent[outcome]} />
      )}
    </React.Fragment>
  )
}
