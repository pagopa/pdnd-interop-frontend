import React from 'react'
import { AssistanceForm } from './components/AssistanceForm'
import { STAGE } from '@/config/env'

export const AssistancePage: React.FC = () => {
  return (
    <AssistanceForm
      language={'it'}
      productId={STAGE === 'UAT' ? 'prod-interop-coll' : 'prod-interop'}
      subscriptionKey=""
      onBackBtnClick={() => window.history.back()}
    />
  )
}
