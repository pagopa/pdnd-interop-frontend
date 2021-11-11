import React, { useContext, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { fetchWithLogs } from '../lib/api-utils'
import { MessageNoAction } from '../components/Shared/MessageNoAction'
import { RequestOutcome, RequestOutcomeOptions } from '../../types'
import successIllustration from '../assets/success-illustration.svg'
import errorIllustration from '../assets/error-illustration.svg'
import { StyledInputFile } from '../components/Shared/StyledInputFile'
import { getFetchOutcome } from '../lib/error-utils'
import { InlineSupportLink } from '../components/Shared/InlineSupportLink'
import isEmpty from 'lodash/isEmpty'
import { StyledIntro } from '../components/Shared/StyledIntro'
import { parseSearch } from '../lib/url-utils'
import { LoaderContext } from '../lib/context'
import { StyledButton } from '../components/Shared/StyledButton'
import { StyledForm } from '../components/Shared/StyledForm'
import { StyledLink } from '../components/Shared/StyledLink'
import { Box } from '@mui/system'
import { Typography } from '@mui/material'

export function CompleteRegistration() {
  const { setLoadingText } = useContext(LoaderContext)
  const [outcome, setOutcome] = useState<RequestOutcome>()
  const [contract, setContract] = useState<Blob>()
  const location = useLocation()

  const getJwt = () => {
    const s = parseSearch(location.search)
    return s.jwt
  }

  const token = getJwt()

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
      img: { src: successIllustration, alt: 'Icona che rappresenta successo' },
      title: 'La registrazione è completa!',
      description: [
        <Typography>
          <StyledLink to="/">Clicca qui</StyledLink> per iniziare
        </Typography>,
      ],
    },
    error: {
      img: { src: errorIllustration, alt: 'Icona che rappresenta errore' },
      title: 'Non è stato possibile completare la procedura!',
      description: [
        <Typography>
          Assicurati che il file caricato sia l'accordo firmato, e che la firma digitale appartenga
          al Legale Rappresentante. Se credi sia un errore, <InlineSupportLink />.
        </Typography>,
      ],
    },
  }

  return (
    <React.Fragment>
      {!outcome ? (
        <Box sx={{ m: 'auto', textAlign: 'left' }}>
          <StyledIntro sx={{ mx: 'auto' }} variant="h2">
            {{
              title: "Carica l'atto di adesione",
              description:
                "Per completare la procedura di adesione, inserisci qui l'accordo ricevuto al domicilio digitale dell'ente, firmato digitalmente dal Legale Rappresentante.",
            }}
          </StyledIntro>

          <Box sx={{ mt: 4 }}>
            <StyledForm onSubmit={handleSubmit}>
              <Box sx={{ mb: 6 }}>
                <StyledInputFile
                  id="contratto"
                  label="Carica accordo"
                  value={contract}
                  onChange={loadFile}
                />
              </Box>

              <StyledButton variant="contained" size="small" type="submit" disabled={!contract}>
                Invia
              </StyledButton>
            </StyledForm>
          </Box>
        </Box>
      ) : (
        <MessageNoAction {...outcomeContent[outcome]} />
      )}
    </React.Fragment>
  )
}
