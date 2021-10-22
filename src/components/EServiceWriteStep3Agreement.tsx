import React from 'react'
import noop from 'lodash/noop'
import { Button, Form } from 'react-bootstrap'
import { StepperStepComponentProps } from '../../types'
import { EServiceWriteStepProps } from '../views/EServiceWrite'
import { StyledInputSelect } from './Shared/StyledInputSelect'
import { StyledIntro } from './Shared/StyledIntro'
import { WhiteBackground } from './WhiteBackground'

export function EServiceWriteStep3Agreement({
  forward,
  back,
}: StepperStepComponentProps & EServiceWriteStepProps) {
  const options = [
    { value: '1', label: 'Template pubbliche amministrazioni' },
    { value: '2', label: 'Template privati' },
    { value: '3', label: 'Template ...' },
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
              title: 'Crea e-service: accordo di interoperabilità*',
              description: 'Seleziona il template di accordo che intendi proporre al fruitore',
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
