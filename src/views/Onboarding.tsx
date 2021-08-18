import React from 'react'
import { WhiteBackground } from '../components/WhiteBackground'
import { withLogin } from '../components/withLogin'

function OnboardingComponent() {
  return <WhiteBackground>onboarding</WhiteBackground>
}

export const Onboarding = withLogin(OnboardingComponent)
