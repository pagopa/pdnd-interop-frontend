import React from 'react'
import emailIllustration from '../assets/email-illustration.svg'
import { MessageNoAction } from './MessageNoAction'

export type OnboardingEmailSendProps = {
  outcome: number
  email: string
}

export function OnboardingEmailSend({ outcome, email }: OnboardingEmailSendProps) {
  const content = {
    200: {
      title: 'Ci siamo quasi...',
      description: [
        `Per completare la registrazione, segui le istruzioni che trovi nella mail che ti abbiamo inviato a <strong>${email}</strong>`,
        'Non hai ricevuto nessuna mail? Attendi qualche minuto e controlla anche nello spam. Se non arriva, <a class="link-default" href="#0" title="Contatta l\'assistenza">contattaci!</a>',
      ],
    },
    404: {
      title: "C'è stato un problema...",
      description: [
        'Il salvataggio dei dati inseriti non è andato a buon fine. Prova nuovamente a registrarti, e se il problema dovesse persistere, <a class="link-default" href="#0" title="Contatta l\'assistenza">contattaci!</a>',
      ],
    },
  }[outcome]

  return (
    <MessageNoAction
      title={content!.title}
      img={{ src: emailIllustration, alt: "Icona dell'email" }}
      description={content!.description}
    />
  )
}
