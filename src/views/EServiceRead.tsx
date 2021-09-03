import React from 'react'
import { EServiceDataType, EServiceSummary } from '../../types'
import { DescriptionBlock } from '../components/DescriptionBlock'
import { StyledIntro } from '../components/StyledIntro'
import { WhiteBackground } from '../components/WhiteBackground'

type EServiceReadProps = {
  data: EServiceDataType & EServiceSummary
}

export function EServiceRead({ data }: EServiceReadProps) {
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
    </React.Fragment>
  )
}
