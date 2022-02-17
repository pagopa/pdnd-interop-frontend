import React from 'react'
import { useLocation } from 'react-router-dom'
import { Breadcrumbs, Typography } from '@mui/material'
import { StyledLink } from './StyledLink'
import { RouteConfig } from '../../../types'
import { getBits, isSamePath } from '../../lib/router-utils'
import { ROUTES } from '../../config/routes'

export function StyledBreadcrumbs() {
  const location = useLocation()
  const currentRoute: RouteConfig | undefined = Object.values(ROUTES).find((r) =>
    isSamePath(location.pathname, r.PATH)
  )

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
    <Breadcrumbs sx={{ mb: 5 }}>
      {links.map(({ label, path }, i) => {
        if (i === links.length - 1) {
          return (
            <Typography component="span" color="text.secondary" key={i}>
              {label}
            </Typography>
          )
        }
        return (
          <StyledLink key={i} to={path} sx={{ fontWeight: 700 }}>
            {label}
          </StyledLink>
        )
      })}
    </Breadcrumbs>
  )
}
