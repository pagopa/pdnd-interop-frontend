import React, { useState } from 'react'
import { WhiteBackground } from '../components/WhiteBackground'
import { LoadingOverlay } from '../components/LoadingOverlay'
import { Link, useLocation } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import { fetchWithLogs } from '../lib/api-utils'
import { MessageNoAction } from '../components/MessageNoAction'
import { RequestOutcome, RequestOutcomeOptions } from '../../types'
import checkIllustration from '../assets/check-illustration.svg'
import redXIllustration from '../assets/red-x-illustration.svg'
import { StyledInputFile } from '../components/StyledInputFile'
import { getFetchOutcome } from '../lib/error-utils'

export function CompleteRegistration() {
  const [loading, setLoading] = useState(false)
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
    const bits = location.pathname.split('/').filter((b) => b !== '')
    return bits[bits.length - 1]
  }

  const token = getJwt()
  // const parsedToken = parseJwt(token)

  const handleSubmit = async (e: React.SyntheticEvent) => {
    // Avoid page reload
    e.preventDefault()
    // Start the loader
    setLoading(true)
    // Append the file as form data
    const formData = new FormData()
    formData.append('contract', contract!)
    // Send multipart/form-data POST request
    const contractPostResponse = await fetchWithLogs(
      { endpoint: 'ONBOARDING_COMPLETE_REGISTRATION', endpointParams: { token } },
      { method: 'POST', data: formData, headers: { 'Content-Type': 'multipart/form-data' } }
    )
    // Stop the loader
    setLoading(false)

    // Check the outcome
    const outcome = getFetchOutcome(contractPostResponse)

    // Show it to the end user
    setOutcome(outcome)
  }

  const loadFile = (e: any) => {
    setContract(e.target.files[0])
  }

  const outcomeContent: RequestOutcomeOptions = {
    success: {
      img: { src: checkIllustration, alt: "Icona dell'email" },
      title: 'Congratulazioni',
      description: [
        <p>
          La registrazione è completa.{' '}
          <Link to="/" className="link-default">
            Clicca qui
          </Link>{' '}
          per iniziare
        </p>,
      ],
    },
    error: {
      img: { src: redXIllustration, alt: "Icona dell'email" },
      title: 'Qualcosa è andato storto!',
      description: [
        <p>
          C'è stato un errore nel completamento della procedura. Assicurati che il file che hai
          caricato sia effettivamente il contratto firmato e ritenta ricaricando questa pagina. Se
          l'errore dovesse persistere,{' '}
          <a className="link-default" href="#0" title="Contatta l'assistenza">
            contatta l'assistenza
          </a>
          .
        </p>,
      ],
    },
  }

  return !outcome ? (
    <React.Fragment>
      <WhiteBackground>
        <div className="form-max-width">
          <p className="h1">Ciao</p>
          <p>
            Per completare la procedura di registrazione, carica qui sotto il file che hai ricevuto
            via email, completo della firma in originale del rappresentante legale.
          </p>
        </div>

        <Form onSubmit={handleSubmit}>
          <StyledInputFile id="contratto" onChange={loadFile} />

          <Button variant="primary" type="submit" disabled={!contract}>
            prosegui
          </Button>
        </Form>
      </WhiteBackground>
      {loading && <LoadingOverlay loadingText="Stiamo caricando il tuo contratto" />}
    </React.Fragment>
  ) : (
    <MessageNoAction
      title={outcomeContent[outcome].title}
      img={outcomeContent[outcome].img}
      description={outcomeContent[outcome]!.description}
    />
  )
}
