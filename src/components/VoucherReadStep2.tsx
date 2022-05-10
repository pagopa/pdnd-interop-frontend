import React from 'react'
import { Divider, Link, Paper, Typography } from '@mui/material'
import { InteropM2MVoucherStepProps } from './VoucherRead'
import { StepActions } from './Shared/StepActions'
import { StyledIntro } from './Shared/StyledIntro'
import { DescriptionBlock } from './DescriptionBlock'
import { InlineClipboard } from './Shared/InlineClipboard'
import { API_GATEWAY_URL, AUTHORIZATION_SERVER_ACCESS_TOKEN_URL } from '../config/api-endpoints'
import { CodeSnippetPreview } from './Shared/CodeSnippedPreview'
import { URL_FE } from '../lib/constants'

const CLIENT_ASSERTION_TYPE = 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer'
const GRANT_TYPE = 'client_credentials'

export const VoucherReadStep2 = ({
  clientKind,
  clientId,
  back,
  forward,
}: InteropM2MVoucherStepProps) => {
  return (
    <Paper sx={{ bgcolor: 'background.paper', p: 3, mt: 2 }}>
      <StyledIntro component="h2">
        {{
          title: 'Access token',
          description:
            clientKind === 'CONSUMER' ? (
              'Una volta creato il JWS firmato con la propria chiave privata, bisogna utilizzarlo per fare una richiesta di access token verso l’authorization server di Interoperabilità PDND. Se va a buon fine, verrà restituito un Voucher spendibile presso l’E-Service dell’Erogatore'
            ) : (
              <React.Fragment>
                Una volta creato il JWS firmato con la propria chiave privata, bisogna utilizzarlo
                per fare una richiesta di access token verso l’authorization server di
                Interoperabilità PDND. Se va a buon fine, verrà restituito un Voucher spendibile
                presso l’API gateway di Interoperabilità. È possibile fare un test sullo{' '}
                <Link
                  href={`${API_GATEWAY_URL}/swagger/docs/index.html`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Swagger
                </Link>{' '}
                dedicato
              </React.Fragment>
            ),
        }}
      </StyledIntro>

      <DescriptionBlock label="Endpoint authorization server">
        <InlineClipboard
          textToCopy={AUTHORIZATION_SERVER_ACCESS_TOKEN_URL}
          successFeedbackText="URL copiata correttamente"
        />
      </DescriptionBlock>

      <Divider />

      <StyledIntro component="h3" sx={{ mt: 3 }}>
        {{ title: 'Body della richiesta' }}
      </StyledIntro>

      <DescriptionBlock label="Client_id">
        <InlineClipboard textToCopy={clientId} successFeedbackText="Id copiato correttamente" />
      </DescriptionBlock>

      <DescriptionBlock label="Client_assertion">
        <Typography>Il JWS ottenuto dallo step precedente (comincia per “ey”)</Typography>
      </DescriptionBlock>

      <DescriptionBlock
        label="Client_assertion_type"
        labelDescription="Il formato della client assertion, come indicato in RFC"
      >
        <InlineClipboard
          textToCopy={CLIENT_ASSERTION_TYPE}
          successFeedbackText="Tipo copiato correttamente"
        />
      </DescriptionBlock>

      <DescriptionBlock
        label="Grant_type"
        labelDescription="La tipologia di flusso utilizzato, come indicato in RFC"
      >
        <InlineClipboard textToCopy={GRANT_TYPE} successFeedbackText="Tipo copiato correttamente" />
      </DescriptionBlock>

      <Divider />

      <StyledIntro component="h3" sx={{ mt: 3 }}>
        {{
          title: 'Esempio di cURL',
          description: (
            <React.Fragment>
              Sostituisci il segnaposto con l’asserzione che hai ottenuto allo step precedente e
              lancia la cURL
            </React.Fragment>
          ),
        }}
      </StyledIntro>

      <CodeSnippetPreview
        sx={{ mt: 2 }}
        title="cURL di esempio"
        activeLang="curl"
        entries={[{ url: `${URL_FE}/data/it/session_token_curl.txt`, value: 'curl' }]}
        scriptSubstitutionValues={{
          AUTHORIZATION_SERVER_ACCESS_TOKEN_URL: AUTHORIZATION_SERVER_ACCESS_TOKEN_URL,
          CLIENT_ID: clientId,
          CLIENT_ASSERTION_TYPE: CLIENT_ASSERTION_TYPE,
          GRANT_TYPE: GRANT_TYPE,
        }}
      />

      <StepActions
        back={{ label: 'Indietro', type: 'button', onClick: back }}
        forward={{ label: 'Avanti', type: 'button', onClick: forward }}
      />
    </Paper>
  )
}
