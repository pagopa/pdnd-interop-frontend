import axios from 'axios'
import { logAction, logError } from './action-log'
import { API_HOST, STORAGE_KEY_TOKEN } from './constants'
import { storageRead } from './storage-utils'

const instance = axios.create()

instance.interceptors.request.use(
  (config) => {
    const sessionStorageToken = storageRead(STORAGE_KEY_TOKEN, 'string')
    if (sessionStorageToken) {
      config.headers.Authorization = `Bearer ${sessionStorageToken}`
    }

    logAction('Log request', config)

    return { ...config, baseURL: API_HOST }
  },
  (error) => {
    logError(error)
    return Promise.reject(error)
  }
)

instance.interceptors.response.use(
  (response) => {
    logAction('Log response', response)
    return response
  },
  (error) => {
    logError(error)
    return Promise.reject(error)
  }
)

export default instance
