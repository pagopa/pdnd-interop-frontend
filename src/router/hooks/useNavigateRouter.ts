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
      let generatedPath = '#'

      if (args[0] && 'params' in args[0]) {
        generatedPath = generatePath(pathname, args[0].params)
      }

      if (args[0]?.urlParams) {
        generatedPath = `${generatedPath}?${new URLSearchParams(args[0].urlParams).toString()}`
      }

      return generatedPath
    },
    [currentLanguage]
  )

  /* eslint-disable @typescript-eslint/ban-ts-comment */
  const navigate = useCallback<Navigate>(
    (route, ...config) => {
      console.log(config)
      if (config[0] && 'params' in config[0]) {
        _navigate(
          //@ts-ignore
          buildDynamicUrl(route, { params: config[0].params, urlParams: config[0]?.urlParams }),
          config[0]
        )
      } else {
        //@ts-ignore
        _navigate(buildDynamicUrl(route, { urlParams: config[0]?.urlParams }), config[0])
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
