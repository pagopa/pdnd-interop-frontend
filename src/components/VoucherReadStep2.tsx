import React from 'react'
import { Paper, Typography } from '@mui/material'
import { VoucherStepProps } from '../views/VoucherRead'
import { StepActions } from './Shared/StepActions'
import { StyledIntro } from './Shared/StyledIntro'
import { DescriptionBlock } from './DescriptionBlock'
import { InlineClipboard } from './Shared/InlineClipboard'

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

      <DescriptionBlock label="Endpoint dell'authorization server">
        <InlineClipboard
          text="https://uat.gateway.test.pdnd-interop.pagopa.it/api-gateway/0.1/as/token.oauth2"
          successFeedbackText="URL copiata correttamente"
        />
      </DescriptionBlock>

      <StyledIntro component="h3">{{ title: 'Body della richiesta' }}</StyledIntro>

      <DescriptionBlock label="Client_id">
        <InlineClipboard text={clientId} successFeedbackText="Id copiato correttamente" />
      </DescriptionBlock>

      <DescriptionBlock label="Client_assertion">
        <Typography>Il JWS ottenuto dallo step precedente (comincia per “ey”)</Typography>
      </DescriptionBlock>

      <DescriptionBlock
        label="Client_assertion_type"
        labelDescription="Il formato della client assertion, come indicato in RFC"
      >
        <InlineClipboard
          text="urn:ietf:params:oauth:client-assertion-type:jwt-bearer"
          successFeedbackText="Tipo copiato correttamente"
        />
      </DescriptionBlock>

      <DescriptionBlock
        label="Grant_type"
        labelDescription="La tipologia di flusso utilizzato, come indicato in RFC"
      >
        <InlineClipboard
          text="client_credentials"
          successFeedbackText="Tipo copiato correttamente"
        />
      </DescriptionBlock>

      <StepActions
        back={{ label: 'Indietro', type: 'button', onClick: back }}
        forward={{ label: 'Avanti', type: 'button', onClick: forward }}
      />
    </Paper>
  )
}
