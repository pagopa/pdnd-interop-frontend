import React from 'react'
import { withLogin } from '../components/withLogin'

function NotificationsComponent() {
  return <div>notifiche</div>
}

export const Notifications = withLogin(NotificationsComponent)
