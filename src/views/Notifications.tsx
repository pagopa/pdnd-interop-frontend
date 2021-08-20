import React from 'react'
import { WhiteBackground } from '../components/WhiteBackground'
import { withLogin } from '../components/withLogin'

function NotificationsComponent() {
  return <WhiteBackground>notifiche</WhiteBackground>
}

export const Notifications = withLogin(NotificationsComponent)
