import { useAuthContext } from '@/contexts'
import { goToLoginPage } from '@/utils/common.utils'

const LogoutPage: React.FC = () => {
  const { clearToken } = useAuthContext()

  clearToken()
  goToLoginPage()

  return null
}

export default LogoutPage
