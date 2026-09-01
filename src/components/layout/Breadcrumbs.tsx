import React from 'react'
import { useTranslation } from 'react-i18next'
import { Breadcrumbs as MUIBreadcrumbs, Link as MUILink, Typography } from '@mui/material'
import {
  generatePath,
  Link as RouterLink,
  useParams as useReactRouterParams,
} from 'react-router-dom'
import { getParentRoutes, routes, type RouteKey } from '@/router'
import { useCurrentRoute } from '@/router/hooks/useCurrentRoute'
import type sharedComponentsNs from '@/static/locales/en/shared-components.json'

const macrosectionRouteKeys = new Set<RouteKey>([
  'SUBSCRIBE',
  'PROVIDE',
  'TENANT',
  'CLIENT_MANAGEMENT',
])

export function Breadcrumbs() {
  const { t, i18n } = useTranslation('shared-components')
  const routeLabels = t('routeLabels', {
    returnObjects: true,
  }) as typeof sharedComponentsNs.routeLabels
  const { routeKey } = useCurrentRoute()
  const params = useReactRouterParams()

  const labels: Record<RouteKey, string | false> = {
    ...routeLabels,

    /*
     * The PROVIDE_ESERVICE_MANAGE breadcrumb segment must not be visible in the PROVIDE_ESERVICE_EDIT and PROVIDE_ESERVICE_SUMMARY routes
     */
    PROVIDE_ESERVICE_MANAGE: ['PROVIDE_ESERVICE_SUMMARY', 'PROVIDE_ESERVICE_EDIT'].includes(
      routeKey
    )
      ? false
      : routeLabels.PROVIDE_ESERVICE_MANAGE,

    /*
     * The PROVIDE_ESERVICE_TEMPLATE_DETAILS breadcrumb segment must not be visible in edit and summary routes
     */
    PROVIDE_ESERVICE_TEMPLATE_DETAILS: [
      'PROVIDE_ESERVICE_TEMPLATE_SUMMARY',
      'PROVIDE_ESERVICE_TEMPLATE_EDIT',
    ].includes(routeKey)
      ? false
      : routeLabels.PROVIDE_ESERVICE_TEMPLATE_DETAILS,

    /*
     * The SUBSCRIBE_AGREEMENT_READ breadcrumb segment must not be visible in the SUBSCRIBE_AGREEMENT_EDIT route
     */
    SUBSCRIBE_AGREEMENT_READ:
      routeKey === 'SUBSCRIBE_AGREEMENT_EDIT' ? false : routeLabels.SUBSCRIBE_AGREEMENT_READ,

    /*
     * The SUBSCRIBE_PURPOSE_DETAILS breadcrumb segment must not be visible in edit and summary routes
     */
    SUBSCRIBE_PURPOSE_DETAILS: [
      'SUBSCRIBE_PURPOSE_EDIT',
      'SUBSCRIBE_PURPOSE_SUMMARY',
      'SUBSCRIBE_PURPOSE_FROM_TEMPLATE_EDIT',
    ].includes(routeKey)
      ? false
      : routeLabels.SUBSCRIBE_PURPOSE_DETAILS,

    SUBSCRIBE_PURPOSE_TEMPLATE_DETAILS: [
      'SUBSCRIBE_PURPOSE_TEMPLATE_SUMMARY',
      'SUBSCRIBE_PURPOSE_TEMPLATE_EDIT',
    ].includes(routeKey)
      ? false
      : routeLabels.SUBSCRIBE_PURPOSE_TEMPLATE_DETAILS,

    SUBSCRIBE_PURPOSE_FROM_TEMPLATE_EDIT:
      (routeLabels as Record<string, string | false>).SUBSCRIBE_PURPOSE_FROM_TEMPLATE_EDIT ?? false,

    SUBSCRIBE_PURPOSE_CREATE_FROM_TEMPLATE:
      (routeLabels as Record<string, string | false>).SUBSCRIBE_PURPOSE_CREATE_FROM_TEMPLATE ??
      false,

    DEFAULT: false,
    ASSISTENCE_PARTY_SELECTION: false,
    PROVIDE_ESERVICE_TEMPLATE_PUBLISH_THANK_YOU: false,
    PROVIDE_ESERVICE_PUBLISH_THANK_YOU: false,
    SUBSCRIBE_PURPOSE_PUBLISH_THANK_YOU: false,
    SUBSCRIBE_RISK_ANALYSIS_LIST:
      routeKey === 'SUBSCRIBE_RISK_ANALYSIS_LIST'
        ? false
        : routeLabels.SUBSCRIBE_RISK_ANALYSIS_LIST,
    SUBSCRIBE_RISK_ANALYSIS_INFO_COMPILE:
      routeKey === 'SUBSCRIBE_RISK_ANALYSIS_APPROVAL'
        ? false
        : routeLabels.SUBSCRIBE_RISK_ANALYSIS_INFO_COMPILE,
  }

  const routeKeys = [...getParentRoutes(routeKey), routeKey].filter((key) => labels[key] !== false)

  if (routeKeys.length < 2) return null

  const getPath = (key: RouteKey) => {
    const routePath = routes[key].path
    const normalizedPath = routePath.startsWith('/') ? routePath : `/${routePath}`
    return `/${i18n.language}${generatePath(normalizedPath, params)}`
  }

  return (
    <MUIBreadcrumbs sx={{ mb: 1 }}>
      {routeKeys.map((key, index) => {
        const label = labels[key]
        const isCurrentRoute = index === routeKeys.length - 1

        if (isCurrentRoute) {
          return <span key={key}>{label}</span>
        }

        if (macrosectionRouteKeys.has(key)) {
          return (
            <Typography key={key} component="span" color="text.secondary">
              {label}
            </Typography>
          )
        }

        return (
          <MUILink
            key={key}
            component={RouterLink}
            to={getPath(key)}
            sx={{ fontWeight: 700 }}
            color="inherit"
          >
            {label}
          </MUILink>
        )
      })}
    </MUIBreadcrumbs>
  )
}
