import React, { useEffect, useState } from 'react'
import { Alert, Chip, Divider, Paper, Typography } from '@mui/material'
import { useRoute } from '../hooks/useRoute'
import { buildDynamicPath } from '../lib/router-utils'
import { VoucherStepProps } from '../views/VoucherRead'
import { StepActions } from './Shared/StepActions'
import { StyledIntro } from './Shared/StyledIntro'
import { DescriptionBlock } from './DescriptionBlock'
import { useAsyncFetch } from '../hooks/useAsyncFetch'
import { PublicKeys } from '../../types'
import { LoadingWithMessage } from './Shared/LoadingWithMessage'
import { InlineClipboard } from './Shared/InlineClipboard'
import { Box } from '@mui/system'
import { Link } from '@mui/material'
import { StyledLink } from './Shared/StyledLink'
import axios from 'axios'
import { URL_FE } from '../lib/constants'
import { StyledButton } from './Shared/StyledButton'
import { FixedClipboard } from './Shared/FixedClipboard'

export const VoucherReadStep1 = ({ clientId, purposeId, forward }: VoucherStepProps) => {
  const { routes } = useRoute()

  const {
    data: keysData,
    error,
    isLoading,
  } = useAsyncFetch<PublicKeys>({
    path: { endpoint: 'KEY_GET_LIST', endpointParams: { clientId } },
  })

  const [pythonCodeSnippet, setPythonCodeSnippet] = useState('')

  useEffect(() => {
    async function asyncFetchData() {
      const resp = await axios.get(`${URL_FE}/data/it/voucher-python.txt`)
      setPythonCodeSnippet(resp.data)
    }

    asyncFetchData()
  }, [])

  return (
    <Paper sx={{ bgcolor: 'background.paper', p: 3, mt: 2 }}>
      <StyledIntro component="h2">
        {{
          title: 'Client assertion',
          description: (
            <React.Fragment>
              Il primo passaggio è creare un’asserzione firmata dal tuo ente con la chiave privata
              corrispondente a una delle chiavi pubbliche che hai caricato in questo client. Di
              seguito i dettagli per creare il JWS secondo la specifica{' '}
              <Link
                href="https://datatracker.ietf.org/doc/html/rfc7521"
                target="_blank"
                rel="noreferrer"
              >
                RFC7521
              </Link>
            </React.Fragment>
          ),
        }}
      </StyledIntro>

      <StyledIntro component="h3" sx={{ mt: 3 }}>
        {{ title: "Header dell'asserzione" }}
      </StyledIntro>

      <DescriptionBlock
        label="KID"
        labelDescription="Scegli la chiave pubblica corrispondente a quella privata che userai per firmare l’asserzione"
      >
        {isLoading && (
          <LoadingWithMessage label="Stiamo caricando le chiavi" transparentBackground={true} />
        )}
        {error ? (
          <Alert severity="error">Non è stato possibile caricare le chiavi</Alert>
        ) : keysData && Boolean(keysData.keys.length > 0) ? (
          keysData.keys.map((k, i) => {
            return (
              <Box key={i}>
                <InlineClipboard
                  label={k.name}
                  textToCopy={k.key.kid}
                  successFeedbackText="Id copiato correttamente"
                />
              </Box>
            )
          })
        ) : (
          <React.Fragment>
            <Typography>
              Non ci sono chiavi disponibili.
              <br />
              <StyledLink
                to={buildDynamicPath(
                  routes.SUBSCRIBE_CLIENT_EDIT.PATH,
                  { clientId },
                  { tab: 'publicKeys' }
                )}
              >
                Torna al client
              </StyledLink>{' '}
              per creare la tua prima chiave
            </Typography>
          </React.Fragment>
        )}
      </DescriptionBlock>

      <DescriptionBlock
        label="ALG"
        labelDescription="L’algoritmo usato per firmare questo JWT. In questo momento si può firmare solo con RS256"
      >
        <InlineClipboard textToCopy="RS256" successFeedbackText="Testo copiato correttamente" />
      </DescriptionBlock>

      <DescriptionBlock
        label="TYP"
        labelDescription="Il tipo di oggetto che si sta inviando, in questo caso “JWT”"
      >
        <InlineClipboard textToCopy="JWT" successFeedbackText="Testo copiato correttamente" />
      </DescriptionBlock>

      <Divider />

      <StyledIntro component="h3" sx={{ mt: 3 }}>
        {{ title: "Payload dell'asserzione" }}
      </StyledIntro>

      <DescriptionBlock label="ISS" labelDescription="L’issuer, in questo caso l'id del client">
        <InlineClipboard textToCopy={clientId} successFeedbackText="Id copiato correttamente" />
      </DescriptionBlock>

      <DescriptionBlock
        label="SUB"
        labelDescription="Il subject, in questo caso sempre l'id del client"
      >
        <InlineClipboard textToCopy={clientId} successFeedbackText="Id copiato correttamente" />
      </DescriptionBlock>

      <DescriptionBlock label="AUD" labelDescription="L'audience">
        <InlineClipboard
          textToCopy="test.interop.pdnd.it"
          successFeedbackText="Id copiato correttamente"
        />
      </DescriptionBlock>

      <DescriptionBlock
        label="PurposeId"
        labelDescription="L’id della finalità per la quale si richiederà di accedere alle risorse dell’Erogatore"
      >
        <InlineClipboard textToCopy={purposeId} successFeedbackText="Id copiato correttamente" />
      </DescriptionBlock>

      <DescriptionBlock
        label="JTI"
        labelDescription="Il JWT ID, un id unico (uuid) random assegnato da chi vuole creare il token, serve per tracciare il token stesso. È cura del chiamante assicurarsi che l'id sia unico"
      >
        <Typography>
          Questo parametro devi generarlo tu.
          <br />
          Valore esempio: 261cd445-3da6-421b-9ef4-7ba556efda5f
        </Typography>
      </DescriptionBlock>

      <DescriptionBlock
        label="IAT"
        labelDescription="Issued at, il timestamp riportante data e ora in cui viene creato il token, espresso in UNIX epoch (valore numerico, non stringa)"
      >
        <Typography>
          Questo parametro devi generarlo tu.
          <br />
          Valore esempio: 1651738540
        </Typography>
      </DescriptionBlock>

      <DescriptionBlock
        label="EXP"
        labelDescription="Expiration, il timestamp riportante data e ora di scadenza del token, espresso in UNIX epoch (valore numerico, non stringa)"
      >
        <Typography>
          Questo parametro devi generarlo tu.
          <br />
          Valore esempio: 1651659340
        </Typography>
      </DescriptionBlock>

      <Divider />

      <StyledIntro component="h3" sx={{ mt: 3, mb: 3 }}>
        {{ title: "Script esempio per generare un'asserzione" }}
      </StyledIntro>

      <Box sx={{ display: 'flex' }}>
        <Typography sx={{ mr: 1 }}>Linguaggio: </Typography>
        <Box>
          <Chip size="small" label="python" color="primary" />
        </Box>
      </Box>
      <Box sx={{ position: 'relative' }}>
        <Box sx={{ position: 'absolute', right: 0, top: 0, zIndex: 1 }}>
          <Box sx={{ mr: 2, mt: 0 }}>
            <FixedClipboard
              textToCopy={pythonCodeSnippet}
              successFeedbackText="Script copiato correttamente"
            />
          </Box>
        </Box>
        <Box
          sx={{
            my: 1,
            maxHeight: 300,
            overflowY: 'auto',
            border: 2,
            borderColor: 'divider',
            px: 1,
          }}
        >
          <Typography variant="caption">
            <code>
              {pythonCodeSnippet.split('\n').map((a, i) => (
                <React.Fragment key={i}>
                  {a}
                  <br />
                </React.Fragment>
              ))}
            </code>
          </Typography>
        </Box>
      </Box>

      <Alert severity="info">
        Script esempio in altri linguaggi saranno aggiunti nelle prossime settimane
      </Alert>

      <StepActions
        back={{
          label: 'Torna al client',
          type: 'link',
          to: buildDynamicPath(routes.SUBSCRIBE_PURPOSE_LIST.PATH, { clientId }),
        }}
        forward={{ label: 'Avanti', type: 'button', onClick: forward }}
      />
    </Paper>
  )
}
