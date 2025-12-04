import React from 'react'
import { Divider } from '@mui/material'
import { SidebarItemGroup } from './components/SidebarItemGroup'
import { useState } from 'react'
import { type RouteKey, useCurrentRoute, useGeneratePath } from '@/router'
import { getCurrentSelfCareProductId } from '@/utils/common.utils'
import ExitToAppRoundedIcon from '@mui/icons-material/ExitToAppRounded'
import PeopleIcon from '@mui/icons-material/People'
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle'
import { useTranslation } from 'react-i18next'
import type { SidebarRoute, SidebarRoutes } from './sidebar.types'
import { SELFCARE_BASE_URL } from '@/config/env'
import { Link } from 'react-router-dom'
import { useIsRouteInCurrentSubtree } from '../layout/SideNav/hooks/useIsRouteInCurrentSubtree'
import { AuthHooks } from '@/api/auth'
import { SidebarItem } from './components/SidebarItem'

type InteropSidebarItems = {
  routes: SidebarRoutes
}

export const InteropSidebarItems: React.FC<InteropSidebarItems> = ({ routes }) => {
  const generatePath = useGeneratePath()
  const isRouteInCurrentSubtree = useIsRouteInCurrentSubtree()
  const { t } = useTranslation('sidebar')

  const pathname = useCurrentRoute().routeKey
  const { jwt, isAdmin } = AuthHooks.useJwt()

  const selfcareUsersPageUrl =
    jwt && `${SELFCARE_BASE_URL}/dashboard/${jwt.selfcareId}/users#${getCurrentSelfCareProductId()}`
  const selfcareGroupsPageUrl = jwt && `${SELFCARE_BASE_URL}/dashboard/${jwt.selfcareId}/groups`

  const [parentExpandedItem, setParentExpandedItem] = useState<string | undefined>(
    routes.find(
      (route) =>
        route.rootRouteKey === pathname || route.children?.some((child) => child.to === pathname)
    )?.rootRouteKey
  )

  const handleExpandParent = (routeKey: RouteKey) => {
    setParentExpandedItem((prev) => (prev === routeKey ? undefined : routeKey))
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
            notification={{
              content: 0,
              show: true,
            }}
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
            notification: {
              content: 0,
              show: true,
            },
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
                notification={{
                  show: route?.showNotification ?? false,
                  content: 0,
                }}
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
