import React from 'react'
import { StyledIntro } from './StyledIntro'
import { WhiteBackground } from './WhiteBackground'

export function Unauthorized() {
  return (
    <WhiteBackground>
      <StyledIntro>
        {{
          title: 'Autorizzazione insufficiente',
          description: 'Spiacenti, non hai permessi sufficienti per accedere a questa funzionalità',
        }}
      </StyledIntro>
    </WhiteBackground>
  )
}
