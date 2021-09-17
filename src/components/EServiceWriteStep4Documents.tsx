import React from 'react'
import { Button } from 'react-bootstrap'
import { StepperStepComponentProps } from '../../types'
import { EServiceWriteStepProps } from '../views/EServiceWrite'
import { WhiteBackground } from './WhiteBackground'
import { UserFeedbackHOCProps, withUserFeedback } from './withUserFeedback'

function EServiceWriteStep4DocumentsComponent({
  forward,
  back,
}: StepperStepComponentProps & UserFeedbackHOCProps & EServiceWriteStepProps) {
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

export const EServiceWriteStep4Documents = withUserFeedback(EServiceWriteStep4DocumentsComponent)
