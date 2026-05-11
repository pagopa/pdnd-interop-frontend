import React from 'react'
import type { SxProps } from '@mui/material'
import { Box, Button, Skeleton, Stack, Tooltip, Typography } from '@mui/material'
import type { ActionItemButton } from '@/types/common.types'
import { Breadcrumbs } from '../Breadcrumbs'
import { StatusChip } from '@/components/shared/StatusChip'
import type { useParams } from '@/router'
import { Link, type RouteKey } from '@/router'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { ActionMenu, ActionMenuSkeleton } from '@/components/shared/ActionMenu'

type RouteParams<TRouteKey extends RouteKey> = ReturnType<typeof useParams<TRouteKey>>

export type PageBackToAction = {
  [K in RouteKey]: {
    label: string
    to: K // the specified route
    params?: RouteParams<K> // params corresponding to that route
    urlParams?: Record<string, string>
  }
}[RouteKey]

type ActionsSectionProps = {
  primaryAction?: ActionItemButton
  secondaryAction?: ActionItemButton
  menuActions?: Array<ActionItemButton>
}

type BreadcrumbsSectionProps = {
  backToAction?: PageBackToAction
}

type ShortCutProps =
  | {
      [K in RouteKey]: {
        type: 'link'
        label: string
        to: K // the specified route
        params?: RouteParams<K> // params corresponding to that route
        urlParams?: Record<string, string>
      }
    }[RouteKey]
  | {
      type: 'button'
      label: string
      onClick: () => void
    }

type HeaderInfoSectionProps = {
  label: string
  shortcut: ShortCutProps
  actions?: Array<ActionItemButton>
  statusChip?: React.ComponentProps<typeof StatusChip>
}

type IntroProps = {
  title?: string
  description?: string | React.ReactNode
  statusChip?: React.ComponentProps<typeof StatusChip>
  infoSection?: HeaderInfoSectionProps
} & ActionsSectionProps

type PageContainerProps = {
  isLoading?: boolean
  sx?: SxProps
  children: React.ReactNode
} & BreadcrumbsSectionProps &
  IntroProps

type PageContainerSkeletonProps = {
  children?: React.ReactNode
  backToAction?: PageBackToAction
}

type SubtitleProps = {
  description: string | React.ReactNode
}

export const NewPageContainer: React.FC<PageContainerProps> = ({
  children,
  isLoading,
  ...props
}) => {
  return (
    <Stack direction="column" spacing={3}>
      <BreadcrumbsSection {...props} />
      {isLoading ? <IntroSkeleton /> : <Intro {...props} />}
      <Box>{children}</Box>
    </Stack>
  )
}

export const PageContainerSkeleton: React.FC<PageContainerSkeletonProps> = ({
  children,
  backToAction,
}) => {
  return (
    <Box>
      <BreadcrumbsSection backToAction={backToAction} />
      <IntroSkeleton />
      <Box sx={{ mt: 1 }}>{children}</Box>
    </Box>
  )
}

const Intro: React.FC<IntroProps> = ({
  title,
  description,
  statusChip,
  primaryAction,
  secondaryAction,
  menuActions,
  infoSection,
}) => {
  return (
    <Box sx={{ flex: 1 }}>
      <Stack direction="row" alignItems="center" spacing={2}>
        {title && (
          <Typography component="h1" variant="h4" maxWidth="50%">
            {title}
          </Typography>
        )}
        {statusChip && (
          <Box>
            <StatusChip {...statusChip} />
          </Box>
        )}
        <ActionsSection
          primaryAction={primaryAction}
          secondaryAction={secondaryAction}
          menuActions={menuActions}
        />
      </Stack>
      {description && <Subtitle description={description} />}
      {infoSection && <HeaderInfoSection {...infoSection} />}
    </Box>
  )
}

const Subtitle: React.FC<SubtitleProps> = ({ description }) => {
  return typeof description === 'string' ? (
    <Typography component="p" variant="body1" sx={{ mt: 1, mb: 0 }}>
      {description}
    </Typography>
  ) : (
    description
  )
}
const BreadcrumbsSection: React.FC<BreadcrumbsSectionProps> = ({ backToAction }) => {
  return (
    <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 1 }}>
      {backToAction && (
        <Link
          to={backToAction.to}
          params={backToAction.params}
          options={backToAction.urlParams ? { urlParams: backToAction.urlParams } : undefined}
          as="button"
          startIcon={<ArrowBackIcon />}
          size="small"
          variant="naked"
        >
          {backToAction.label}
        </Link>
      )}
      <Breadcrumbs />
    </Stack>
  )
}

const ActionsSection: React.FC<ActionsSectionProps> = ({
  primaryAction,
  secondaryAction,
  menuActions,
}) => {
  if (!menuActions && !primaryAction) return null

  const renderActionButton = ({
    action,
    label,
    color,
    icon: Icon,
    tooltip,
    disabled,
    variant,
    ...props
  }: ActionItemButton) => {
    const Wrapper = tooltip
      ? ({ children }: { children: React.ReactElement }) => (
          <Tooltip arrow title={tooltip}>
            <span tabIndex={disabled ? 0 : undefined}>{children}</span>
          </Tooltip>
        )
      : React.Fragment

    return (
      <Wrapper key={label}>
        <Button
          onClick={action}
          variant={variant}
          size="small"
          color={color}
          startIcon={Icon && <Icon />}
          {...props}
        >
          {label}
        </Button>
      </Wrapper>
    )
  }

  return (
    <Stack
      sx={{ minHeight: 40 }}
      direction="row"
      alignItems="center"
      justifyContent="flex-end"
      flex={1}
    >
      <Stack direction="row" spacing={2}>
        {secondaryAction && renderActionButton(secondaryAction)}
        {primaryAction && renderActionButton(primaryAction)}
        {menuActions ? <ActionMenu actions={menuActions} /> : <ActionMenuSkeleton />}
      </Stack>
    </Stack>
  )
}

export const HeaderInfoSection: React.FC<HeaderInfoSectionProps> = ({
  label,
  shortcut,
  statusChip,
  actions = [],
}) => {
  return (
    <Box bgcolor="grey.100" py={2} px={2} borderRadius={1} mt={3}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Stack direction="row" spacing={4} alignItems="center">
          <Typography component="h2" variant="body2" textTransform="uppercase">
            {label}
          </Typography>
          {shortcut.type === 'button' && (
            <Button
              type="button"
              variant="naked"
              sx={{ textDecoration: 'underline' }}
              onClick={shortcut.onClick}
            >
              {shortcut.label}
            </Button>
          )}
          {shortcut.type === 'link' && (
            <Link
              to={shortcut.to}
              params={shortcut.params}
              options={shortcut.urlParams ? { urlParams: shortcut.urlParams } : undefined}
              as="button"
              variant="naked"
              sx={{ textDecoration: 'underline' }}
            >
              {shortcut.label}
            </Link>
          )}
          {statusChip && <StatusChip {...statusChip} />}
        </Stack>
        <Stack direction="row" spacing={3}>
          {actions.map(({ action, label, color, icon: Icon, ...props }, index) => {
            return (
              <Button
                key={index}
                onClick={action}
                variant="text"
                size="small"
                color={color}
                startIcon={Icon && <Icon />}
                {...props}
              >
                {label}
              </Button>
            )
          })}
        </Stack>
      </Stack>
    </Box>
  )
}

export const IntroSkeleton: React.FC = () => {
  return (
    <Stack direction="row" alignItems="end" spacing={2}>
      <Box sx={{ flex: 1 }}>
        <Typography component="h1" variant="h4">
          <Skeleton />
        </Typography>
        <Typography component="p" variant="body1" sx={{ mt: 1, mb: 0 }}>
          <Skeleton />
        </Typography>
      </Box>
    </Stack>
  )
}
