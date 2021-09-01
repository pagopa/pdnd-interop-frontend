import React from 'react'
import { useLocation } from 'react-router-dom'
import { DescriptionBlock } from '../components/DescriptionBlock'
import { LoadingOverlay } from '../components/LoadingOverlay'
import { StyledIntro } from '../components/StyledIntro'
import { WhiteBackground } from '../components/WhiteBackground'
import { useAsyncFetch } from '../hooks/useAsyncFetch'
import { getLastBit } from '../lib/url-utils'

export function EServiceRead() {
  const eserviceId = getLastBit(useLocation())
  const { data, loading } = useAsyncFetch<any>(
    {
      path: { endpoint: 'ESERVICE_GET_SINGLE', endpointParams: { eserviceId } },
      config: { method: 'GET' },
    },
    {}
  )

  return (
    <React.Fragment>
      <WhiteBackground>
        <StyledIntro>{{ title: data?.name }}</StyledIntro>

        <DescriptionBlock label="Descrizione">
          <span>{data?.description}</span>
        </DescriptionBlock>

        <DescriptionBlock label="Tecnologia">
          <span>{data?.technology}</span>
        </DescriptionBlock>

        <DescriptionBlock label="Durata del voucher">
          <span>{data?.voucherLifespan} secondi</span>
        </DescriptionBlock>

        <DescriptionBlock label="Audience">
          <span>{data?.audience?.join(', ')}</span>
        </DescriptionBlock>
      </WhiteBackground>

      {loading && <LoadingOverlay loadingText="Stiamo caricando il tuo e-service" />}
    </React.Fragment>
  )
}
