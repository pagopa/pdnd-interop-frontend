import React from 'react'
import { Button } from 'react-bootstrap'
import { StepperStepComponentProps } from '../../types'
import { WhiteBackground } from './WhiteBackground'

export function EServiceWriteStep4Documents({ forward, back }: StepperStepComponentProps) {
  return (
    <React.Fragment>
      <WhiteBackground>content</WhiteBackground>
      <WhiteBackground>
        <Button variant="primary" onClick={forward}>
          salva bozza e prosegui
        </Button>
        <Button variant="primary-outline" onClick={back}>
          indietro
        </Button>
      </WhiteBackground>
    </React.Fragment>
  )
}
