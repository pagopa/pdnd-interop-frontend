import React from 'react'
import { withLogin } from '../components/withLogin'

function ProfileComponent() {
  return <div>profilo</div>
}

export const Profile = withLogin(ProfileComponent)
