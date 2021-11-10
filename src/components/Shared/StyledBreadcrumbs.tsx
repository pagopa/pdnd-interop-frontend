import React from 'react'
import { useLocation } from 'react-router-dom'
import { Breadcrumbs, Typography } from '@mui/material'
import { ROUTES } from '../../lib/constants'
import { StyledLink } from './StyledLink'
import { RouteConfig } from '../../../types'
import { flattenRoutes, getBits } from '../../lib/url-utils'
import { isSameRoute } from '../../lib/router-utils'

export function StyledBreadcrumbs() {
  const location = useLocation()
  const flattened = flattenRoutes(ROUTES)
  const currentRoute: RouteConfig | undefined = flattened.find((r) => isSameRoute(location, r))

  if (!currentRoute) {
    return null
  }

  const toDynamicPath = (route: RouteConfig) => {
    const locationBits = getBits(location)

    const dynamicSplit = route.SPLIT_PATH.map((pathFragment, i) => {
      const isDynamicFragment = pathFragment.charAt(0) === ':'
      return isDynamicFragment ? locationBits[i] : pathFragment
    })

    return `/${dynamicSplit.join('/')}`
  }

  const parentRoutes = (currentRoute.PARENTS || []).filter((r) => !r.HIDE_BREADCRUMB)
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
    <Breadcrumbs sx={{ mb: 4 }}>
      {links.map(({ label, path }, i) => {
        if (i === links.length - 1) {
          return (
            <Typography key={i} component="span" sx={{ fontWeight: 700 }}>
              {label}
            </Typography>
          )
        }
        return (
          <StyledLink key={i} to={path}>
            <Typography component="span">{label}</Typography>
          </StyledLink>
        )
      })}
    </Breadcrumbs>
  )
}
