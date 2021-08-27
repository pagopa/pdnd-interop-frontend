import React from 'react'
import { StyledIntro } from '../components/StyledIntro'
import { WhiteBackground } from '../components/WhiteBackground'
import { withLogin } from '../components/withLogin'

type Notification = {
  type: 'info' | 'action-required'
  date: string
  title: string
  message: string
}

const mockNotifications: Notification[] = [
  {
    type: 'info',
    date: '02/09/2021, h. 14:46',
    title: 'Nuova chiave caricata',
    message:
      "Un'operatore di sicurezza del client IBM per il servizio Anagrafe di Torino (sola lettura) ha caricato una nuova chiave di sicurezza",
  },
  {
    type: 'info',
    date: '20/08/2021, h. 12:28',
    title: 'Accordo attivato',
    message:
      'Il tuo accordo per il servizio Anagrafe di Torino (sola lettura) è stato attivato. Puoi ora creare dei client',
  },
  {
    type: 'info',
    date: '10/08/2021, h. 09:22',
    title: 'Accordo sospeso',
    message:
      "L'accordo per il servizio Anagrafe di Milano (sola lettura), versione 2 è stato sospeso dall'Erogatore",
  },
]

function NotificationsComponent() {
  const ICON_TYPES = {
    'action-required': 'bi-exclamation-triangle',
    info: 'bi-info-circle',
  }

  return (
    <WhiteBackground>
      <StyledIntro>{{ title: 'Notifiche' }}</StyledIntro>

      <div>
        {mockNotifications.map(({ date, type, title, message }, i) => {
          return (
            <div className="my-3 p-3 border border-secondary" key={i}>
              <p className="d-flex align-items-center text-primary my-0">
                <i className={`me-2 fs-5 bi ${ICON_TYPES[type]}`} />
                <strong className="me-2">{title}</strong> — <span className="ms-2">{date}</span>
              </p>
              <p className="my-2">{message}</p>
            </div>
          )
        })}
      </div>
    </WhiteBackground>
  )
}

export const Notifications = withLogin(NotificationsComponent)
