import axios from 'axios'
import qs from 'qs'
import { v4 as uuidv4 } from 'uuid'
import { STORAGE_KEY_SESSION_TOKEN } from '@/config/constants'
import { storageRead } from '@/utils/storage.utils'
import { NotAuthorizedError, NotFoundError, ServerError } from '@/utils/errors.utils'

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
    const isAxiosError = axios.isAxiosError(error)
    if (isAxiosError && error.response?.status === 404) {
      return Promise.reject(new NotFoundError())
    }
    if (isAxiosError && error.response?.status === 401) {
      return Promise.reject(new NotAuthorizedError())
    }
    if (
      isAxiosError &&
      error.response?.status &&
      (error.response?.status >= 500 || error.response?.status === 400)
    ) {
      return Promise.reject(
        new ServerError(error.message, error.code, error.config, error.request, error.response)
      )
    }

    return Promise.reject(error)
  }
)

export default axiosInstance
