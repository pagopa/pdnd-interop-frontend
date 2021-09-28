import React from 'react'
import { Row, Container } from 'react-bootstrap'
import { StepperStepComponentProps } from '../../types'
import { OnboardingStepActions } from './OnboardingStepActions'
import { StyledIntro } from './StyledIntro'
import { StyledInputTextArea } from './StyledInputTextArea'
import { WhiteBackground } from './WhiteBackground'

const bozzaAccordo =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam sit amet leo sed magna pellentesque aliquet sed at libero. Suspendisse potenti. Aenean accumsan pretium ullamcorper. Duis tincidunt est sit amet facilisis consequat. Duis hendrerit quis velit sit amet euismod. Vivamus sit amet diam efficitur, faucibus nisi efficitur, iaculis nisi. Maecenas eu eros sed velit tincidunt gravida id et leo. Nullam elementum augue vitae turpis condimentum, ac dapibus ex pretium. Quisque tincidunt turpis malesuada risus auctor, id porttitor neque sagittis. Nam at nunc id enim feugiat consequat. Proin fringilla, felis sit amet accumsan convallis, sapien elit ultricies tortor, quis vehicula risus tellus in purus. Nulla facilisi. Integer sit amet ante nibh. Donec eu nisl tempor nisi feugiat rutrum. Sed ante ex, tristique in purus in, bibendum finibus mi. Nullam placerat, diam eget scelerisque rhoncus, orci arcu ullamcorper sem, sed imperdiet odio nibh at ipsum. Fusce fringilla ante massa, vitae lobortis sem sagittis nec. Nunc non erat id dui tristique malesuada. Donec odio nisl, ullamcorper id viverra vitae, convallis eu urna. Nam porttitor felis tellus, non feugiat lectus euismod at. Duis mauris neque, molestie vel odio non, aliquet lacinia metus. Etiam nec urna blandit, cursus leo at, gravida orci. Morbi euismod odio orci. Curabitur eros risus, viverra quis accumsan sed, semper in urna. Fusce vitae felis mollis,'

export function OnboardingStep3({ forward, back }: StepperStepComponentProps) {
  const onForwardAction = () => {
    forward!()
  }

  return (
    <WhiteBackground>
      <Container className="container-align-left form-max-width">
        <StyledIntro>
          {{
            title: 'Verifica i dati e i termini dell’accordo di adesione*',
            description:
              'Questo è l’accordo che ti verrà inviato via mail da firmare e restituire per l’attivazione dell’account sulla piattaforma interoperabilità.',
          }}
        </StyledIntro>
        <Row className="mt-4 mb-3">
          <StyledInputTextArea
            readOnly={true}
            value={bozzaAccordo}
            height={200}
            readOnlyBgWhite={true}
          />
        </Row>
        <OnboardingStepActions
          back={{ action: back, label: 'indietro', disabled: false }}
          forward={{ action: onForwardAction, label: 'invia', disabled: false }}
        />
      </Container>
    </WhiteBackground>
  )
}
