import React from 'react'
import { DescriptionBlock } from '../components/DescriptionBlock'
import { StyledIntro } from '../components/StyledIntro'
import { WhiteBackground } from '../components/WhiteBackground'

type EServiceReadProps = {
  data: any
}

export function EServiceRead({ data }: EServiceReadProps) {
  console.log(data)

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
