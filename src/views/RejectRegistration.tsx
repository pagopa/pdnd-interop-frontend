import React, { useEffect, useState } from 'react'
import { MessageNoAction } from '../components/Shared/MessageNoAction'
import checkIllustration from '../assets/check-illustration.svg'
import redXIllustration from '../assets/red-x-illustration.svg'
import { RequestOutcome, RequestOutcomeOptions } from '../../types'
import { parseSearch } from '../lib/url-utils'
import { fetchWithLogs } from '../lib/api-utils'
import { getFetchOutcome } from '../lib/error-utils'
import { useLocation } from 'react-router'
import { LoadingOverlay } from '../components/Shared/LoadingOverlay'
import { InlineSupportLink } from '../components/Shared/InlineSupportLink'
import { Typography } from '@mui/material'

export function RejectRegistration() {
  const location = useLocation()
  const [outcome, setOutcome] = useState<RequestOutcome>()

  const getJwt = () => {
    const s = parseSearch(location.search)
    return s.jwt
  }

  const token = getJwt()

  useEffect(() => {
    async function asyncSendDeleteRequest() {
      // Send DELETE request
      const contractPostResponse = await fetchWithLogs({
        path: { endpoint: 'ONBOARDING_COMPLETE_REGISTRATION', endpointParams: { token } },
      })

      // Check the outcome
      const outcome = getFetchOutcome(contractPostResponse)

      // Show it to the end user
      setOutcome(outcome)
    }

    asyncSendDeleteRequest()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const outcomeContent: RequestOutcomeOptions = {
    success: {
      img: { src: checkIllustration, alt: 'Icona del check' },
      title: 'Congratulazioni',
      description: [<Typography>La registrazione è stata cancellata correttamente</Typography>],
    },
    error: {
      img: { src: redXIllustration, alt: 'Icona della X' },
      title: 'Attenzione!',
      description: [
        <Typography>
          C'è stato un errore nel completamento della procedura. Per favore, riprova! Se non riesci
          a cancellarti, <InlineSupportLink />.
        </Typography>,
      ],
    },
  }

  return !outcome ? (
    <LoadingOverlay loadingText="Stiamo cancellando la tua iscrizione" />
  ) : (
    <MessageNoAction {...outcomeContent[outcome!]} />
  )
}
