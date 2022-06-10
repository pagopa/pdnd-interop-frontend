import axios from 'axios'
import { logAction, logError } from './action-log'
import { STORAGE_KEY_SESSION_TOKEN } from './constants'
import { storageRead } from './storage-utils'
import { v4 as uuidv4 } from 'uuid'

const instance = axios.create()

instance.interceptors.request.use(
  (config) => {
    const _config = { ...config }

    const sessionStorageToken = storageRead(STORAGE_KEY_SESSION_TOKEN, 'string')
    if (sessionStorageToken) {
      _config.headers.Authorization = `Bearer ${sessionStorageToken}`
    }

    _config.headers['X-Correlation-Id'] = uuidv4()

    logAction('Http request', _config)

    return _config
  },
  (error) => {
    logError(error)
    return Promise.reject(error)
  }
)

instance.interceptors.response.use(
  (response) => {
    logAction('Http response', response)
    return response
  },
  (error) => {
    logError(error)
    return Promise.reject(error)
  }
)

export default instance
