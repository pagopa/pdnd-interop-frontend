import axios from 'axios'
import qs from 'qs'
import { v4 as uuidv4 } from 'uuid'
import { STORAGE_KEY_SESSION_TOKEN } from '@/config/constants'
import { storageRead } from '@/utils/storage.utils'
import { NotAuthorizedError, NotFoundError, ServerError } from '@/utils/errors.utils'

// Performs a trim operation on each string contained in the object
const deepTrim = (object: any) => {
  if (typeof object === 'string') {
    return object.trim()
  }
  if (typeof object === 'object' && object !== null) {
    for (const key in object) {
      object[key] = deepTrim(object[key])
    }
  }

  return object
}

const axiosInstance = axios.create({
  paramsSerializer: {
    serialize: (params) => qs.stringify(params, { arrayFormat: 'comma' }),
  },
})

axiosInstance.interceptors.request.use(
  (config) => {
    const sessionStorageToken = storageRead(STORAGE_KEY_SESSION_TOKEN, 'string')
    if (sessionStorageToken) {
      config.headers.Authorization = `Bearer ${sessionStorageToken}`
    }

    config.headers['X-Correlation-Id'] = uuidv4()

    // If the request has a payload performs the trim on all its strings
    if (config.data) {
      config.data = deepTrim(config.data)
    }

    return config
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
