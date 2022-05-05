import React from 'react'
import { Divider, Paper, Typography } from '@mui/material'
import { VoucherStepProps } from '../views/VoucherRead'
import { StepActions } from './Shared/StepActions'
import { StyledIntro } from './Shared/StyledIntro'
import { DescriptionBlock } from './DescriptionBlock'
import { InlineClipboard } from './Shared/InlineClipboard'

const AUTH_SERVER_URL =
  'https://uat.gateway.test.pdnd-interop.pagopa.it/api-gateway/0.1/as/token.oauth2'
const CLIENT_ASSERTION_TYPE = 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer'
const GRANT_TYPE = 'client_credentials'

export const VoucherReadStep2 = ({ clientId, back, forward }: VoucherStepProps) => {
  return (
    <Paper sx={{ bgcolor: 'background.paper', p: 3, mt: 2 }}>
      <StyledIntro component="h2">
        {{
          title: 'Access token',
          description:
            'Una volta creato il JWS firmato con la propria chiave privata, bisogna utilizzarlo per fare una richiesta di access token verso l’authorization server di Interoperabilità PDND. Se va a buon fine, verrà restituito un Voucher spendibile presso l’E-Service dell’Erogatore. È possibile fare un test sullo Swagger dedicato',
        }}
      </StyledIntro>

      <DescriptionBlock label="Endpoint authorization server">
        <InlineClipboard
          textToCopy={AUTH_SERVER_URL}
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

      <Typography component="p" variant="caption" sx={{ bgcolor: 'background.paper', p: 2 }}>
        <code>
          curl --location --request POST &apos;{AUTH_SERVER_URL}&apos; \<br />
          --header &apos;Content-Type: application/x-www-form-urlencoded&apos; \<br />
          --data-urlencode &apos;client_id={clientId}&apos; \<br />
          --data-urlencode &apos;client_assertion=[LA_TUA_CLIENT_ASSERTION]&apos; \<br />
          --data-urlencode &apos;client_assertion_type={CLIENT_ASSERTION_TYPE}&apos; \<br />
          --data-urlencode &apos;grant_type={GRANT_TYPE}&apos;
        </code>
      </Typography>

      <StepActions
        back={{ label: 'Indietro', type: 'button', onClick: back }}
        forward={{ label: 'Avanti', type: 'button', onClick: forward }}
      />
    </Paper>
  )
}
