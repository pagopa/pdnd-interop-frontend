import React from 'react'
import { useLocation } from 'react-router-dom'
import { Breadcrumbs, Typography } from '@mui/material'
import { ROUTES } from '../../lib/constants'
import { StyledLink } from './StyledLink'
import { RouteConfig } from '../../../types'
import { flattenRoutes } from '../../lib/url-utils'
import { isSameRoute } from '../../lib/router-utils'

export function StyledBreadcrumbs() {
  const location = useLocation()
  const flattened = flattenRoutes(ROUTES)
  const currentRoute: RouteConfig | undefined = flattened.find((r) => isSameRoute(location, r))

  if (!currentRoute) {
    return null
  }

  const links = [...(currentRoute.PARENTS || []), currentRoute]

  // Don't display breadcrumbs for first level descentants, they are useless
  if (links.length < 2) {
    return null
  }

  return (
    <Breadcrumbs sx={{ mb: 4 }}>
      {links.map((link, i) => {
        if (i === links.length - 1) {
          return (
            <Typography key={i} component="span">
              {link.LABEL}
            </Typography>
          )
        }
        return (
          <StyledLink key={i} to={link.PATH}>
            {link.LABEL}
          </StyledLink>
        )
      })}
    </Breadcrumbs>
  )
}
