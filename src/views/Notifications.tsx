import React, { useState } from 'react'
import { Layout } from '../components/Shared/Layout'
import { StyledIntro } from '../components/Shared/StyledIntro'

type Notification = {
  type: 'info' | 'action-required'
  date: string
  title: string
  message: string
}

const mockNotifications: { [key in 'p' | 's']: Notification[] } = {
  p: [
    {
      type: 'info',
      date: '02/09/2021, h. 14:46',
      title: 'Nuova versione di e-service',
      message:
        "La tua organizzazione ha pubblicato la versione 3 dell'e-service TARI Trento (sola lettura)",
    },
    {
      type: 'info',
      date: '08/08/2021, h. 15:12',
      title: 'Nuovo accordo richiesto',
      message:
        "Ti è stata richiesta l'adesione a un accordo per l'e-service TARI Campobasso (sola lettura), versione 2 da parte dell'organizzazione Comune di Bologna",
    },
    {
      type: 'info',
      date: '05/05/2021, h. 09:55',
      title: 'Nuova chiave caricata',
      message:
        "Un'operatore di sicurezza del client IBM per l'e-service Anagrafe di Torino (sola lettura) ha caricato una nuova chiave di sicurezza",
    },
  ],
  s: [
    {
      type: 'info',
      date: '06/09/2021, h. 16:34',
      title: 'Nuovo attributo riconosciuto',
      message: "L'erogatore Comune di Venezia ti ha riconosciuto un nuovo attributo",
    },
    {
      type: 'info',
      date: '20/08/2021, h. 12:28',
      title: 'Accordo attivato',
      message:
        "Il tuo accordo per l'e-service Anagrafe di Torino (sola lettura) è stato attivato. Puoi ora creare dei client",
    },
    {
      type: 'info',
      date: '10/08/2021, h. 09:22',
      title: 'Accordo sospeso',
      message:
        "L'accordo per l'e-service Anagrafe di Milano (sola lettura), versione 2 è stato sospeso dall'Erogatore",
    },
  ],
}

export function Notifications() {
  const [view, setView] = useState<'p' | 's'>('p')

  const ICON_TYPES = {
    'action-required': 'bi-exclamation-triangle',
    info: 'bi-info-circle',
  }

  const wrapSetView = (v: 'p' | 's') => (_: any) => {
    setView(v)
  }

  return (
    <Layout>
      <StyledIntro priority={2} additionalClasses="fakeData fakeDataStart">
        {{ title: 'Notifiche' }}
      </StyledIntro>

      <div style={{ position: 'relative' }}>
        <button
          onClick={wrapSetView('p')}
          style={{
            opacity: 0,
            background: 'red',
            position: 'absolute',
            right: 0,
            top: 0,
            zIndex: 1,
          }}
        >
          erogatore
        </button>
        <button
          onClick={wrapSetView('s')}
          style={{
            opacity: 0,
            background: 'red',
            position: 'absolute',
            right: 0,
            bottom: 0,
            zIndex: 1,
          }}
        >
          fruitore
        </button>

        {mockNotifications[view].map(({ date, type, title, message }, i) => {
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
    </Layout>
  )
}
