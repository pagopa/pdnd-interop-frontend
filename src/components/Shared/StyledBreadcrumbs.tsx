import React from 'react'
import { useLocation } from 'react-router-dom'
import { Breadcrumbs, Typography } from '@mui/material'
import { RouteConfigWithParents } from '../../../types'
import { DECORATED_ROUTES } from '../../lib/constants'
import { StyledLink } from './StyledLink'

export function StyledBreadcrumbs() {
  const location = useLocation()
  const currentRoute: RouteConfigWithParents | undefined = DECORATED_ROUTES.find(
    (r) => r.PATH === location.pathname
  )

  if (!currentRoute) {
    return null
  }

  const links = [...(currentRoute.PARENTS || []), currentRoute]

  return (
    <Breadcrumbs>
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
