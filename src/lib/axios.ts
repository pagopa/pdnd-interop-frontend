import axios from 'axios'
import qs from 'qs'
import { v4 as uuidv4 } from 'uuid'
import { STORAGE_KEY_SESSION_TOKEN } from '@/config/constants'
import { storageRead } from '@/utils/storage.utils'

const axiosInstance = axios.create({
  paramsSerializer: {
    serialize: (params) => qs.stringify(params, { arrayFormat: 'comma' }),
  },
})

axiosInstance.interceptors.request.use(
  (config) => {
    const _config = { ...config, headers: { ...config.headers } }

    const sessionStorageToken = storageRead(STORAGE_KEY_SESSION_TOKEN, 'string')
    if (sessionStorageToken) {
      _config.headers.Authorization = `Bearer ${sessionStorageToken}`
    }

    _config.headers['X-Correlation-Id'] = uuidv4()

    return _config
  },
  (error) => {
    return Promise.reject(error)
  }
)

axiosInstance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    console.error(error)
    return Promise.reject(error)
  }
)

export default axiosInstance
