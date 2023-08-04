import React from 'react'
import { FE_LOGIN_URL } from '@/config/env'
import { STORAGE_KEY_SESSION_TOKEN } from '@/config/constants'

const LogoutPage: React.FC = () => {
  React.useEffect(() => {
    window.localStorage.removeItem(STORAGE_KEY_SESSION_TOKEN)
    window.location.assign(FE_LOGIN_URL)
  }, [])

  return null
}

export default LogoutPage
