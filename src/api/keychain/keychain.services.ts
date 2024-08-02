import { BACKEND_FOR_FRONTEND_URL } from '@/config/env'
import axiosInstance from '@/config/axios'

function deleteKeychain({ client }: { client: string }) {
  return 'DELETED'
}

const KeychainServices = {
  deleteKeychain,
}

export default KeychainServices
