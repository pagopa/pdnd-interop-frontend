import React from 'react'
import { Layout } from './Shared/Layout'
import { StyledIntro } from './Shared/StyledIntro'

export function Unauthorized() {
  return (
    <Layout>
      <StyledIntro>
        {{
          title: 'Autorizzazione insufficiente',
          description: 'Spiacenti, non hai permessi sufficienti per accedere a questa funzionalità',
        }}
      </StyledIntro>
    </Layout>
  )
}
