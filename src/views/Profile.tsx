import React from 'react'
import { StyledIntro } from '../components/StyledIntro'
import { WhiteBackground } from '../components/WhiteBackground'
import { withLogin } from '../components/withLogin'

function ProfileComponent() {
  return (
    <WhiteBackground>
      <StyledIntro>{{ title: 'Profilo' }}</StyledIntro>
    </WhiteBackground>
  )
}

export const Profile = withLogin(ProfileComponent)
