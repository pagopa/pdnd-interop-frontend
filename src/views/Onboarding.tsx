import React from 'react'
import { withLogin } from '../components/withLogin'

function OnboardingComponent() {
  return <div>onboarding</div>
}

export const Onboarding = withLogin(OnboardingComponent)
