import React from 'react'
import { Breadcrumbs as _Breadcrumbs, Link as MUILink } from '@mui/material'
import { useCurrentRoute } from '@/router'
import { getRouteParents, getSplittedPath } from '@/router/utils'
import { RouteConfig } from '@/router/types'
import { Link, useParams } from 'react-router-dom'
import useCurrentLanguage from '@/hooks/useCurrentLanguage'

export function Breadcrumbs() {
  const { routeKey, route } = useCurrentRoute()
  const currentLanguage = useCurrentLanguage()

  const params = useParams()

  const toDynamicPath = (route: RouteConfig) => {
    const subpaths = getSplittedPath(route)

    const dynamicSplit = subpaths.map((pathFragment) => {
      const isDynamicFragment = pathFragment.charAt(0) === ':'
      if (isDynamicFragment) {
        const dynamicKey = pathFragment.substring(1)
        return params[dynamicKey]
      }
      return pathFragment
    })

    return `/${dynamicSplit.join('/')}`
  }

  const parentRoutes = getRouteParents(routeKey)
  const links = [...parentRoutes, route].map((r) => ({
    label: r.LABEL[currentLanguage],
    // Remap dynamic parts of the path to their current value
    path: toDynamicPath(r),
  }))

  // Don't display breadcrumbs for first level descentants, they are useless
  if (links.length < 2) {
    return null
  }

  return (
    <_Breadcrumbs sx={{ mb: 1 }}>
      {links.map(({ label, path }, i) => {
        if (i === links.length - 1) {
          return <span key={i}>{label}</span>
        }
        return (
          <MUILink component={Link} key={i} to={path} sx={{ fontWeight: 700 }} color="inherit">
            {label}
          </MUILink>
        )
      })}
    </_Breadcrumbs>
  )
}
