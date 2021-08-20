import React from 'react'
import { WhiteBackground } from '../components/WhiteBackground'
import { withLogin } from '../components/withLogin'

function NotificationsComponent() {
  return (
    <WhiteBackground>
      <h2>Notifiche</h2>
    </WhiteBackground>
  )
}

export const Notifications = withLogin(NotificationsComponent)
