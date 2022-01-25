import axios from 'axios'
import { logAction, logError } from './action-log'
import { STORAGE_KEY_TOKEN } from './constants'
import { storageRead } from './storage-utils'

const instance = axios.create({ baseURL: process.env.REACT_APP_API_BASE_URL })

instance.interceptors.request.use(
  (config) => {
    const sessionStorageToken = storageRead(STORAGE_KEY_TOKEN, 'string')
    if (sessionStorageToken) {
      config.headers.Authorization = `Bearer ${sessionStorageToken}`
    }

    logAction('Log request', config)

    return config
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
