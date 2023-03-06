import { FE_LOGIN_URL } from '@/config/env'
import { useAuth } from '@/stores'

const LogoutPage: React.FC = () => {
  const { clearSessionToken } = useAuth()

  const goToLoginPage = () => {
    window.location.assign(FE_LOGIN_URL)
  }

  clearSessionToken()
  goToLoginPage()

  return null
}

export default LogoutPage
