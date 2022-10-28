import { useAuthContext } from '@/contexts'
import { goToLoginPage } from '@/utils/common.utils'

function LogoutPage() {
  const { clearToken } = useAuthContext()

  clearToken()
  goToLoginPage()

  return null
}

export default LogoutPage
