import React from 'react'
import { Divider } from '@mui/material'
import { SidebarItemGroup } from './components/SidebarItemGroup'
import { useState } from 'react'
import { type RouteKey, useCurrentRoute, useGeneratePath } from '@/router'
import ExitToAppRoundedIcon from '@mui/icons-material/ExitToAppRounded'
import PeopleIcon from '@mui/icons-material/People'
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle'
import { useTranslation } from 'react-i18next'
import type { SidebarRoute, SidebarRoutes } from './sidebar.types'
import {
  NOTIFICATION_COUNT_REFRESH_INTERVAL,
  SELFCARE_BASE_URL,
  SELFCARE_PRODUCT_ID,
} from '@/config/env'
import { Link } from 'react-router-dom'
import { useIsRouteInCurrentSubtree } from './hooks/useIsRouteInCurrentSubtree'
import { AuthHooks } from '@/api/auth'
import { SidebarItem } from './components/SidebarItem'
import { useQuery } from '@tanstack/react-query'
import { NotificationQueries } from '@/api/notification'
import { match } from 'ts-pattern'
import { routes as routesDefinitions } from '@/router/routes'
import { get } from 'lodash'

type InteropSidebarItems = {
  routes: SidebarRoutes
}

export const InteropSidebarItems: React.FC<InteropSidebarItems> = ({ routes }) => {
  const generatePath = useGeneratePath()
  const isRouteInCurrentSubtree = useIsRouteInCurrentSubtree()
  const { t } = useTranslation('sidebar')

  const pathname = useCurrentRoute().routeKey
  const { jwt, isAdmin, isSupport } = AuthHooks.useJwt()

  const selfcareUsersPageUrl =
    jwt && `${SELFCARE_BASE_URL}/dashboard/${jwt.selfcareId}/users#${SELFCARE_PRODUCT_ID}`
  const selfcareGroupsPageUrl = jwt && `${SELFCARE_BASE_URL}/dashboard/${jwt.selfcareId}/groups`

  const [parentExpandedItem, setParentExpandedItem] = useState<string | undefined>(
    routes.find(
      (route) =>
        route.rootRouteKey === pathname || route.children?.some((child) => child.to === pathname)
    )?.rootRouteKey
  )

  const { data: inAppNotificationCount } = useQuery({
    ...NotificationQueries.getInAppNotificationsCount(),
    refetchInterval: NOTIFICATION_COUNT_REFRESH_INTERVAL,
    enabled: !isSupport,
  })

  const handleExpandParent = (routeKey: RouteKey) => {
    setParentExpandedItem((prev) => (prev === routeKey ? undefined : routeKey))
  }

  const getNotificationCountByRouteKey = (routeKey: RouteKey, kind: 'root' | 'child') => {
    const path = routesDefinitions[routeKey]?.path
    const notificationCount = match(kind)
      .with('root', () => get(inAppNotificationCount, path.substring(1).split('/')[0])?.totalCount)
      .with('child', () => get(inAppNotificationCount, path.substring(1).replaceAll('/', '.')))
      .exhaustive()
    return notificationCount ?? 0
  }

  const renderChildItems = (route: SidebarRoute) =>
    route.children
      ?.filter((child) => !child.hide)
      .map((child) => {
        const routeKey = child.to
        return (
          <SidebarItem
            isSelected={isRouteInCurrentSubtree(routeKey)}
            component={Link}
            to={generatePath(routeKey)}
            key={routeKey}
            label={child.label}
            notification={getNotificationCountByRouteKey(routeKey, 'child')}
          />
        )
      })

  return (
    <>
      {routes
        .filter(({ hide }) => !hide)
        .map((route) => {
          const sidebarItemProps: SidebarItem<typeof Link> = {
            isSelected: isRouteInCurrentSubtree(route.rootRouteKey),
            StartIcon: route.icon,
            label: route.label,
            notification: getNotificationCountByRouteKey(route.rootRouteKey, 'root'),
            component: Link,
            divider: route.divider,
            to: generatePath(route.rootRouteKey),
          }

          if (route.children && route.children.length > 0) {
            return (
              <SidebarItemGroup
                renderOnCollapsed={
                  <SidebarItem datatest-id={route.label} key={route.label} {...sidebarItemProps} />
                }
                key={route.label}
                notification={getNotificationCountByRouteKey(route.rootRouteKey, 'root')}
                label={route.label}
                divider={route.divider}
                isSelected={route.children?.some((child) => isRouteInCurrentSubtree(child.to))}
                isExpanded={parentExpandedItem === route.rootRouteKey}
                handleExpandParent={() => handleExpandParent(route.rootRouteKey)}
                icon={route.icon}
              >
                {renderChildItems(route)}
              </SidebarItemGroup>
            )
          }

          return <SidebarItem key={route.label} {...sidebarItemProps} />
        })}
      {isAdmin && (
        <>
          <Divider sx={{ marginBottom: 2 }} />
          <SidebarItem
            href={selfcareUsersPageUrl}
            label={t('userExternalLinkLabel')}
            StartIcon={PeopleIcon}
            EndIcon={ExitToAppRoundedIcon}
          />
          <SidebarItem
            href={selfcareGroupsPageUrl}
            label={t('groupsExternalLinkLabel')}
            target="_blank"
            StartIcon={SupervisedUserCircleIcon}
            EndIcon={ExitToAppRoundedIcon}
            typographyProps={{ sx: { fontWeight: 600 } }}
          />
        </>
      )}
    </>
  )
}
