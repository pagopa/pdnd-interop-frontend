import type { LangCode } from '@/types/common.types'
import type { RouteKey } from '@/router/router.types'
import { generatePath, useLocation, useNavigate, useParams } from 'react-router-dom'
import { getLocalizedPath } from '../router.utils'
import React from 'react'
import useCurrentRoute from './useCurrentRoute'

export function useSwitchPathLang() {
  const location = useLocation()
  const navigate = useNavigate()
  const { routeKey } = useCurrentRoute()
  const params = useParams()

  const switchPathLang = React.useCallback(
    (toLang: LangCode) => {
      const localizedPath = getLocalizedPath(routeKey as RouteKey, toLang)
      let newPath = generatePath(localizedPath, params)

      if (location.search) {
        newPath += location.search
      }

      if (location.hash) {
        newPath += location.hash
      }

      navigate(newPath, { replace: true })
    },
    [location.hash, location.search, navigate, params, routeKey]
  )

  return { switchPathLang }
}
