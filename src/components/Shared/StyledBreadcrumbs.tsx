import React from 'react'
import { useLocation } from 'react-router-dom'
import { Breadcrumbs } from '@mui/material'
import { StyledLink } from './StyledLink'
import { MappedRouteConfig } from '../../../types'
import { getBits, isSamePath } from '../../lib/router-utils'
import { useRoute } from '../../hooks/useRoute'

export function StyledBreadcrumbs() {
  const location = useLocation()
  const { routes } = useRoute()
  const currentRoute: MappedRouteConfig | undefined = Object.values(routes).find((r) =>
    isSamePath(location.pathname, r.PATH)
  )

  if (!currentRoute) {
    return null
  }

  const toDynamicPath = (route: MappedRouteConfig) => {
    const locationBits = getBits(location)

    const dynamicSplit = route.SPLIT_PATH.map((pathFragment, i) => {
      const isDynamicFragment = pathFragment.charAt(0) === ':'
      return isDynamicFragment ? locationBits[i] : pathFragment
    })

    return `/${dynamicSplit.join('/')}`
  }

  const parentRoutes = currentRoute.PARENTS || []
  const links = [...parentRoutes, currentRoute].map((r) => ({
    label: r.LABEL,
    // Remap dynamic parts of the path to their current value
    path: toDynamicPath(r),
  }))

  // Don't display breadcrumbs for first level descentants, they are useless
  if (links.length < 2) {
    return null
  }

  return (
    <Breadcrumbs sx={{ mb: 0 }}>
      {links.map(({ label, path }, i) => {
        if (i === links.length - 1) {
          return <span>{label}</span>
        }
        return (
          <StyledLink key={i} to={path} sx={{ fontWeight: 700 }} color="inherit">
            {label}
          </StyledLink>
        )
      })}
    </Breadcrumbs>
  )
}
