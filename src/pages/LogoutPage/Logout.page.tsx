import { useAuth } from '@/stores'
import { goToLoginPage } from '@/utils/common.utils'

const LogoutPage: React.FC = () => {
  const { clearSessionToken } = useAuth()

  clearSessionToken()
  goToLoginPage()

  return null
}

export default LogoutPage
