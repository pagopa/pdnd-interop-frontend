import { GetRouteUrl, Navigate } from '@/router/types'
import { getLocalizedRoutePathname } from '@/router/utils'
import { useCallback } from 'react'
import { generatePath, useNavigate } from 'react-router-dom'
import useCurrentLanguage from '@/hooks/useCurrentLanguage'

function useNavigateRouter() {
  const currentLanguage = useCurrentLanguage()
  const _navigate = useNavigate()

  const buildDynamicUrl = useCallback<GetRouteUrl>(
    (route, ...args) => {
      const currentLang = currentLanguage
      const pathname = getLocalizedRoutePathname(route, currentLang).substring(3)
      return generatePath(pathname, ...args)
    },
    [currentLanguage]
  )

  /* eslint-disable @typescript-eslint/ban-ts-comment */
  const navigate = useCallback<Navigate>(
    (route, ...config) => {
      if (config[0] && 'params' in config[0]) {
        // @ts-ignore
        _navigate(buildDynamicUrl(route, config[0].params), config[0])
      } else {
        // @ts-ignore
        _navigate(buildDynamicUrl(route), config[0])
      }
    },
    [buildDynamicUrl, _navigate]
  )

  const getRouteUrl = useCallback<GetRouteUrl>(
    (params, ...args) => {
      return buildDynamicUrl(params, ...args)
    },
    [buildDynamicUrl]
  )

  return { navigate: navigate as Navigate, getRouteUrl }
}

export default useNavigateRouter
