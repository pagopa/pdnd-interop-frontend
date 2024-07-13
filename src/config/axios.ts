import axios from 'axios'
import { STORAGE_KEY_SESSION_TOKEN } from '@/config/constants'
import { NotFoundError, AuthenticationError } from '@/utils/errors.utils'
import i18next from 'i18next'
import type { LangCode } from '@/types/common.types'

// Performs a trim operation on each string contained in the object
const deepTrim = (object: string | Record<string, unknown>) => {
  if (object instanceof File) {
    return object
  }

  if (typeof object === 'string') {
    return object.trim()
  }

  if (typeof object === 'object' && object !== null) {
    for (const key in object) {
      object[key] = deepTrim(object[key] as string | Record<string, unknown>)
    }
  }

  return object
}

/** This function helps to serialize correctly arrays in url params  */
const serializeParams = (query: Record<string, unknown>) => {
  return (
    Object.entries(query)
      // This filter is needed to remove undefined and null values, it is needed
      // ONLY to avoid undefined/null to be passed as a query params value, falsy values
      // like 0 or '' are allowed
      .filter(([, value]) => value !== undefined && value !== null)
      .map(([key, value]) =>
        Array.isArray(value) ? `${key}=${value.join(',')}` : `${key}=${value}`
      )
      .join('&')
  )
}

const axiosInstance = axios.create({
  paramsSerializer: {
    serialize: serializeParams,
  },
})

const acceptLanguageHeader: Record<LangCode, string> = {
  it: 'it-IT',
  en: 'en-EN',
}

axiosInstance.interceptors.request.use(
  (config) => {
    const sessionStorageToken = window.localStorage.getItem(STORAGE_KEY_SESSION_TOKEN)
    if (sessionStorageToken) {
      config.headers.Authorization = `Bearer ${sessionStorageToken}`
    }

    config.headers['Accept-Language'] = acceptLanguageHeader[i18next.language as LangCode]
    config.headers['X-Correlation-Id'] = crypto.randomUUID()

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
      return Promise.reject(new AuthenticationError())
    }

    return Promise.reject(error)
  }
)

export default axiosInstance
