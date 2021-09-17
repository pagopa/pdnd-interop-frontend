import React from 'react'
import noop from 'lodash/noop'
import { Button, Form } from 'react-bootstrap'
import { StepperStepComponentProps } from '../../types'
import { EServiceWriteStepProps } from '../views/EServiceWrite'
import { StyledInputSelect } from './StyledInputSelect'
import { StyledIntro } from './StyledIntro'
import { WhiteBackground } from './WhiteBackground'
import { UserFeedbackHOCProps, withUserFeedback } from './withUserFeedback'

function EServiceWriteStep3AgreementComponent({
  forward,
  back,
}: StepperStepComponentProps & UserFeedbackHOCProps & EServiceWriteStepProps) {
  const options = [
    { value: '1', label: 'Template 1' },
    { value: '2', label: 'Template 2' },
    { value: '3', label: 'Template 3' },
    { value: '4', label: 'Template 4' },
    { value: '5', label: 'Template 5' },
  ]

  const submit = (e: any) => {
    e.preventDefault()

    forward()
  }

  return (
    <React.Fragment>
      <WhiteBackground>
        <Form onSubmit={submit}>
          <StyledIntro priority={2}>
            {{
              title: 'Accordo di interoperabilità*',
              description:
                'Seleziona il template di accordo che intendi proporre per sottoscrivere il servizio',
            }}
          </StyledIntro>

          <StyledInputSelect
            id="accordo"
            label="Seleziona template"
            disabled={false}
            options={options}
            onChange={noop}
          />

          <div className="mt-5 d-flex">
            <Button className="me-3" variant="primary" type="submit">
              salva bozza e prosegui
            </Button>
            <Button variant="outline-primary" onClick={back}>
              indietro
            </Button>
          </div>
        </Form>
      </WhiteBackground>
    </React.Fragment>
  )
}

export const EServiceWriteStep3Agreement = withUserFeedback(EServiceWriteStep3AgreementComponent)
