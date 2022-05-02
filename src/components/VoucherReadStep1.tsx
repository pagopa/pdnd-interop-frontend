import React from 'react'
import { Alert, Divider, Paper, Typography } from '@mui/material'
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

export const VoucherReadStep1 = ({ clientId, purposeId, forward }: VoucherStepProps) => {
  const { routes } = useRoute()

  const {
    data: keysData,
    error,
    isLoading,
  } = useAsyncFetch<PublicKeys>({
    path: { endpoint: 'KEY_GET_LIST', endpointParams: { clientId } },
  })

  console.log(keysData)

  return (
    <Paper sx={{ bgcolor: 'background.paper', p: 3, mt: 2 }}>
      <StyledIntro component="h2">
        {{
          title: 'Client assertion',
          description:
            'Il primo passaggio è creare un’asserzione firmata dal tuo ente con la chiave privata corrispondente a una delle chiavi pubbliche che hai caricato in questo client. Di seguito i dettagli per creare il JWS secondo la specifica RFC-7521',
        }}
      </StyledIntro>

      <StyledIntro component="h3">{{ title: "Header dell'asserzione" }}</StyledIntro>

      <DescriptionBlock
        label="KID"
        labelDescription="La chiave pubblica da scegliere è quella corrispondente a quella privata che userai per firmare l’asserzione"
      >
        {isLoading && (
          <LoadingWithMessage label="Stiamo caricando le chiavi" transparentBackground={true} />
        )}
        {error && <Alert severity="error">Non è stato possibile caricare le chiavi</Alert>}
        {keysData && Boolean(keysData.keys.length > 0) ? (
          keysData.keys.map((k, i) => {
            return (
              <Box key={i}>
                <InlineClipboard text={k.key.kid} successFeedbackText="Id copiato correttamente" />
              </Box>
            )
          })
        ) : (
          <Typography>Non ci sono chiavi disponibili</Typography>
        )}
      </DescriptionBlock>

      <DescriptionBlock
        label="ALG"
        labelDescription="L’algoritmo usato per firmare questo JWT. In questo momento si può firmare solo con RS256"
      >
        <InlineClipboard text="RS256" successFeedbackText="Testo copiato correttamente" />
      </DescriptionBlock>

      <DescriptionBlock
        label="TYP"
        labelDescription="Il tipo di oggetto che si sta inviando, in questo caso “JWT”"
      >
        <InlineClipboard text="JWT" successFeedbackText="Testo copiato correttamente" />
      </DescriptionBlock>

      <Divider />

      <StyledIntro component="h3">{{ title: "Payload dell'asserzione" }}</StyledIntro>

      <DescriptionBlock label="ISS" labelDescription="L’issuer, in questo caso il clientId">
        <InlineClipboard text={clientId} successFeedbackText="Id copiato correttamente" />
      </DescriptionBlock>

      <DescriptionBlock
        label="SUB"
        labelDescription="Il subject, in questo caso sempre il clientId"
      >
        <InlineClipboard text={clientId} successFeedbackText="Id copiato correttamente" />
      </DescriptionBlock>

      <DescriptionBlock label="AUD" labelDescription="L'audience">
        <InlineClipboard
          text="test.interop.pdnd.it"
          successFeedbackText="Id copiato correttamente"
        />
      </DescriptionBlock>

      <DescriptionBlock
        label="PurposeId"
        labelDescription="L’id della finalità per la quale si richiederà di accedere alle risorse dell’Erogatore"
      >
        <InlineClipboard text={purposeId} successFeedbackText="Id copiato correttamente" />
      </DescriptionBlock>

      <DescriptionBlock
        label="JTI"
        labelDescription="Il JWT ID, un id unico (uuid) random assegnato da chi vuole creare il token, serve per tracciare il token stesso. È cura del chiamante assicurarsi che l'id sia unico"
      >
        <Typography>
          Questo parametro devi generarlo tu (valore esempio: 261cd445-3da6-421b-9ef4-7ba556efda5f)
        </Typography>
      </DescriptionBlock>

      <DescriptionBlock
        label="IAT"
        labelDescription="Issued at, il timestamp riportante data e ora in cui viene creato il token, espresso in UNIX epoch (valore numerico, non stringa)"
      >
        <Typography>
          Questo parametro devi generarlo tu (valore esempio: 2022-04-28 14:20:33.594200)
        </Typography>
      </DescriptionBlock>

      <DescriptionBlock
        label="EXP"
        labelDescription="Expiration, il timestamp riportante data e ora di scadenza del token, espresso in UNIX epoch (valore numerico, non stringa)"
      >
        <Typography>
          Questo parametro devi generarlo tu (valore esempio: 2022-05-28 14:20:33.594200)
        </Typography>
      </DescriptionBlock>

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
