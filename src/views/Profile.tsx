import React from 'react'
import { WhiteBackground } from '../components/WhiteBackground'
import { withLogin } from '../components/withLogin'

function ProfileComponent() {
  return (
    <WhiteBackground>
      <h2>Profilo</h2>
    </WhiteBackground>
  )
}

export const Profile = withLogin(ProfileComponent)
