import React from 'react'
import { Paper } from '@mui/material'
import { useRoute } from '../hooks/useRoute'
import { buildDynamicPath } from '../lib/router-utils'
import { VoucherStepProps } from '../views/VoucherRead'
import { StepActions } from './Shared/StepActions'
import { StyledIntro } from './Shared/StyledIntro'
import { DescriptionBlock } from './DescriptionBlock'
import { InlineClipboard } from './Shared/InlineClipboard'
import { StyledLink } from './Shared/StyledLink'

export const VoucherReadStep3 = ({ data, clientId, back }: VoucherStepProps) => {
  const { routes } = useRoute()

  return (
    <Paper sx={{ bgcolor: 'background.paper', p: 3, mt: 2 }}>
      <StyledIntro component="h2">
        {{
          title: 'Accesso all’E-Service dell’Erogatore',
          description:
            'A questo punto il voucher ottenuto è spendibile presso l’E-Service dell’Erogatore',
        }}
      </StyledIntro>

      <DescriptionBlock label="AUD" labelDescription="L'audience">
        <InlineClipboard text="dsfmdopmop" successFeedbackText="Id copiato correttamente" />
      </DescriptionBlock>

      <DescriptionBlock label="Dettagli E-Service">
        <StyledLink
          to={buildDynamicPath(routes.SUBSCRIBE_CATALOG_VIEW.PATH, {
            eserviceId: data?.eservice.id,
            descriptorId: data?.eservice.descriptor.id,
          })}
        >
          {data?.eservice.name}
        </StyledLink>
      </DescriptionBlock>

      <StepActions
        back={{ label: 'Indietro', type: 'button', onClick: back }}
        forward={{
          label: 'Torna al client',
          type: 'link',
          to: buildDynamicPath(routes.SUBSCRIBE_PURPOSE_LIST.PATH, { clientId }),
        }}
      />
    </Paper>
  )
}
