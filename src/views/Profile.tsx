import React from 'react'
import { WhiteBackground } from '../components/WhiteBackground'
import { withLogin } from '../components/withLogin'

function ProfileComponent() {
  return <WhiteBackground>profilo</WhiteBackground>
}

export const Profile = withLogin(ProfileComponent)
