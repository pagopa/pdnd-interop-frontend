import type { Purpose } from '@/api/api.generatedTypes'
import { Stack, Typography } from '@mui/material'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import React from 'react'
import { Link } from '@/router'

type ConsumerPurposeSummaryGeneralInformationAccordionProps = {
  purpose: Purpose
}

export const ConsumerPurposeSummaryGeneralInformationAccordion: React.FC<
  ConsumerPurposeSummaryGeneralInformationAccordionProps
> = ({ purpose }) => {
  return (
    <Stack spacing={2}>
      <InformationContainer
        content={
          <Link
            to="SUBSCRIBE_CATALOG_VIEW"
            params={{
              eserviceId: purpose.eservice.id,
              descriptorId: purpose.eservice.descriptor.id,
            }}
            target="_blank"
          >{`E-service ${purpose.eservice.name}, versione ${purpose.eservice.descriptor.version}`}</Link>
        }
        direction="row"
        label={'E-service di riferimento'}
      />
      <InformationContainer
        content={purpose.eservice.producer.name}
        direction="row"
        label={'Erogatore'}
      />
      <InformationContainer content={purpose.description} direction="row" label={'Descrizione'} />
      <Typography sx={{ pt: 4, pb: 1 }} variant="sidenav">
        Stima di carico
      </Typography>
      <InformationContainer
        content={`${purpose.currentVersion?.dailyCalls} chiamate API/giorno`}
        direction="row"
        label={'Il tuo piano richiesto'}
      />
      <InformationContainer
        content={`${purpose.dailyCallsPerConsumer} chiamate API/giorno`}
        direction="row"
        label={"Soglia per fruitore imposta dall'erogatore"}
      />
      <InformationContainer
        content={`${purpose.dailyCallsTotal} chiamate API/giorno`}
        direction="row"
        label={"Soglia totale imposta dall'erogatore"}
      />
    </Stack>
  )
}
