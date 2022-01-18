import axios from 'axios'
import { logAction, logError } from './action-log'
import { storageRead } from './storage-utils'

const instance = axios.create({ baseURL: process.env.REACT_APP_API_BASE_URL })

instance.interceptors.request.use(
  (config) => {
    logAction('Log request', config)

    const sessionStorageUser = storageRead('user', 'object')
    if (sessionStorageUser && sessionStorageUser.id) {
      config.headers.Authorization = `Bearer ${sessionStorageUser.id}`
    }

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
