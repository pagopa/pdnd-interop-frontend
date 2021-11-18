import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Typography } from '@mui/material'
import { Box } from '@mui/system'
import { RequestOutcome, RequestOutcomeOptions } from '../../types'
import { parseSearch } from '../lib/router-utils'
import { requiredValidationPattern } from '../lib/validation'
import { useFeedback } from '../hooks/useFeedback'
import { MessageNoAction } from '../components/Shared/MessageNoAction'
import { StyledInputControlledFile } from '../components/Shared/StyledInputControlledFile'
import { InlineSupportLink } from '../components/Shared/InlineSupportLink'
import { StyledIntro } from '../components/Shared/StyledIntro'
import { StyledButton } from '../components/Shared/StyledButton'
import { StyledForm } from '../components/Shared/StyledForm'
import { StyledLink } from '../components/Shared/StyledLink'
import successIllustration from '../assets/success-illustration.svg'
import errorIllustration from '../assets/error-illustration.svg'

export function CompleteRegistration() {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm()
  const { runAction } = useFeedback()
  const [outcome, setOutcome] = useState<RequestOutcome>()
  const location = useLocation()

  const getJwt = () => {
    const s = parseSearch(location.search)
    return s.jwt
  }

  const onSubmit = async (data: any) => {
    const token = getJwt()
    // Append the file as form data
    const formData = new FormData()
    formData.append('contract', data.contract[0])
    // Send multipart/form-data POST request
    const { outcome } = await runAction(
      {
        path: { endpoint: 'ONBOARDING_COMPLETE_REGISTRATION', endpointParams: { token } },
        config: { data: formData, headers: { 'Content-Type': 'multipart/form-data' } },
      },
      { suppressToast: true }
    )
    // Show the outcome to the end user
    setOutcome(outcome)
  }

  const outcomeContent: RequestOutcomeOptions = {
    success: {
      img: { src: successIllustration, alt: 'Icona che rappresenta successo' },
      title: 'La registrazione è completa!',
      description: (
        <Typography>
          <StyledLink to="/">Clicca qui</StyledLink> per iniziare
        </Typography>
      ),
    },
    error: {
      img: { src: errorIllustration, alt: 'Icona che rappresenta errore' },
      title: 'Non è stato possibile completare la procedura!',
      description: (
        <Typography>
          Assicurati che il file caricato sia l’accordo firmato, e che la firma digitale appartenga
          al Legale Rappresentante. Se credi sia un errore, <InlineSupportLink />.
        </Typography>
      ),
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
            <StyledForm onSubmit={handleSubmit(onSubmit)}>
              <Box sx={{ mb: 6 }}>
                <StyledInputControlledFile
                  name="contract"
                  label="Carica accordo"
                  control={control}
                  rules={{ required: requiredValidationPattern }}
                  errors={errors}
                />
              </Box>

              <StyledButton variant="contained" size="small" type="submit">
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
