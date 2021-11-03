import React from 'react'
import { StyledIntro } from './Shared/StyledIntro'

export function Unauthorized() {
  return (
    <StyledIntro>
      {{
        title: 'Autorizzazione insufficiente',
        description: 'Spiacenti, non hai permessi sufficienti per accedere a questa funzionalità',
      }}
    </StyledIntro>
  )
}
