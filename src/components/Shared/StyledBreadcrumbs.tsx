import React, { useContext } from 'react'
import { useLocation } from 'react-router-dom'
import { Breadcrumbs, Typography } from '@mui/material'
import { StyledLink } from './StyledLink'
import { Lang, MappedRouteConfig } from '../../../types'
import { getBits, isSamePath } from '../../lib/router-utils'
import { URL_FRAGMENTS } from '../../lib/constants'
import { useRoute } from '../../hooks/useRoute'
import { LangContext } from '../../lib/context'

export function StyledBreadcrumbs() {
  const location = useLocation()
  const { routes } = useRoute()
  const { lang } = useContext(LangContext)
  const currentRoute: MappedRouteConfig | undefined = Object.values(routes).find((r) =>
    isSamePath(location.pathname, r.PATH)
  )

  if (!currentRoute) {
    return null
  }

  const filterFalseParents = (links: Array<{ label: string; path: string }>, lang: Lang) => {
    const _links = [...links]
    // Handle exception for /modifica paths
    if (_links[_links.length - 1].path.endsWith(URL_FRAGMENTS.EDIT[lang])) {
      // Remove item before that one, because it is not a true parent
      _links.splice(_links.length - 2, 1)
    }

    return _links
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

  // Remove false parent "Gestisci" when current route is "Modifica"
  const filteredLinks = filterFalseParents(links, lang)

  // Don't display breadcrumbs for first level descentants, they are useless
  if (filteredLinks.length < 2) {
    return null
  }

  return (
    <Breadcrumbs sx={{ mb: 5 }}>
      {filteredLinks.map(({ label, path }, i) => {
        if (i === filteredLinks.length - 1) {
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
