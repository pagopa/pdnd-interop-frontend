import React from 'react'
import { WhiteBackground } from './WhiteBackground'
import emailIllustration from '../assets/email-illustration.svg'

export type OnboardingEmailSendProps = {
  outcome: number
  email: string
}

export function OnboardingEmailSend({ outcome, email }: OnboardingEmailSendProps) {
  const content = {
    200: {
      title: 'Ci siamo quasi...',
      p1: `Per completare la registrazione, segui le istruzioni che trovi nella mail che ti abbiamo inviato a <strong>${email}</strong>`,
      p2: 'Non hai ricevuto nessuna mail? Attendi qualche minuto e controlla anche nello spam. Se non arriva, <a class="link-default" href="#0" title="Contatta l\'assistenza">contattaci!</a>',
    },
    404: {
      title: "C'è stato un problema...",
      p1: 'Il salvataggio dei dati inseriti non è andato a buon fine. Prova nuovamente a registrarti, e se il problema dovesse persistere, <a class="link-default" href="#0" title="Contatta l\'assistenza">contattaci!</a>',
    },
  }[outcome]

  return (
    <WhiteBackground verticallyCentered={true}>
      <div className="text-center mx-auto" style={{ maxWidth: 400 }}>
        <i>
          <img src={emailIllustration} alt="Icona dell'email" />
        </i>
        <p className="fw-bold mt-4 mb-3 h1">{content!.title}</p>
        {content!.p1 && <p dangerouslySetInnerHTML={{ __html: content!.p1 }} />}
        {content!.p2 && <p dangerouslySetInnerHTML={{ __html: content!.p2 }} />}
      </div>
    </WhiteBackground>
  )
}
