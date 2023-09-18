import React from 'react'
import type { SxProps } from '@mui/material'
import { Box, Button, Skeleton, Stack, Tooltip, Typography } from '@mui/material'
import type { ActionItem, ActionItemButton } from '@/types/common.types'
import { ActionMenu } from '@/components/shared/ActionMenu'
import { InfoTooltip } from '@/components/shared/InfoTooltip'
import { Breadcrumbs } from '../Breadcrumbs'
import { StatusChip } from '@/components/shared/StatusChip'
import { Link, type RouteKey } from '@/router'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

export type TopSideActions = {
  buttons: Array<ActionItemButton>
  infoTooltip?: string
  actionMenu?: Array<ActionItem>
}

type PageContainerActionsProps = {
  statusChip?: React.ComponentProps<typeof StatusChip>
  newTopSideActions?: Array<ActionItemButton>
}

type PageContainerBreadcrumbsProps = {
  backToAction?: {
    label: string
    to: RouteKey
  }
}

type PageContainerIntroProps = {
  title?: string
  description?: string
  /**
   * @deprecated use newTopSideActions instead for now, will be removed in the future
   */
  topSideActions?: TopSideActions
}

type PageContainerProps = {
  isLoading?: boolean
  sx?: SxProps
  children: React.ReactNode
} & PageContainerActionsProps &
  PageContainerBreadcrumbsProps &
  PageContainerIntroProps

type PageContainerSkeletonProps = {
  children?: React.ReactNode
  backToAction?: {
    label: string
    to: RouteKey
  }
}

export const PageContainer: React.FC<PageContainerProps> = ({ children, isLoading, ...props }) => {
  return (
    <Box>
      <PageContainerBreadcrumbs {...props} />
      {isLoading ? <PageContainerIntroSkeleton /> : <PageContainerIntro {...props} />}
      <PageContainerActions {...props} />
      <Box sx={{ mt: 1 }}>{children}</Box>
    </Box>
  )
}

export const PageContainerSkeleton: React.FC<PageContainerSkeletonProps> = ({
  children,
  backToAction,
}) => {
  return (
    <Box>
      <PageContainerBreadcrumbs backToAction={backToAction} />
      <PageContainerIntroSkeleton />
      <Box sx={{ mt: 1 }}>{children}</Box>
    </Box>
  )
}

const PageContainerIntro: React.FC<PageContainerIntroProps> = ({
  title,
  description,
  topSideActions = null,
}) => {
  return (
    <Box>
      <Stack direction="row" alignItems="end" spacing={2}>
        <Box sx={{ flex: 1 }}>
          {title && (
            <Typography component="h1" variant="h4">
              {title}
            </Typography>
          )}
          {description && (
            <Typography component="p" variant="body1" sx={{ mt: 1, mb: 0 }}>
              {description}
            </Typography>
          )}
        </Box>

        <Stack direction="row" alignItems="center" spacing={2}>
          {topSideActions?.infoTooltip && <InfoTooltip label={topSideActions.infoTooltip} />}
          {topSideActions?.buttons &&
            topSideActions.buttons.map(({ action, label, ...props }, i) => (
              <Button key={i} onClick={action} variant="outlined" size="small" {...props}>
                {label}
              </Button>
            ))}

          {topSideActions?.actionMenu && <ActionMenu actions={topSideActions.actionMenu} />}
        </Stack>
      </Stack>
    </Box>
  )
}

const PageContainerBreadcrumbs: React.FC<PageContainerBreadcrumbsProps> = ({ backToAction }) => {
  return (
    <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 1 }}>
      {backToAction && (
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        <Link
          to={backToAction.to}
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

const PageContainerActions: React.FC<PageContainerActionsProps> = ({
  statusChip,
  newTopSideActions,
}) => {
  if (!statusChip && !newTopSideActions) return null

  return (
    <Stack
      sx={{ mt: 1, minHeight: 40 }}
      direction="row"
      alignItems="center"
      justifyContent="space-between"
    >
      <Box>{statusChip && <StatusChip {...statusChip} />}</Box>
      <Box>
        {newTopSideActions &&
          newTopSideActions.map(({ action, label, color, icon: Icon, tooltip, ...props }, i) => {
            const Wrapper = tooltip
              ? ({ children }: { children: React.ReactElement }) => (
                  <Tooltip arrow title={tooltip}>
                    <span tabIndex={props.disabled ? 0 : undefined}>{children}</span>
                  </Tooltip>
                )
              : React.Fragment

            return (
              <Wrapper key={i}>
                <Button
                  onClick={action}
                  variant="text"
                  size="small"
                  color={color}
                  startIcon={Icon && <Icon />}
                  {...props}
                >
                  {label}
                </Button>
              </Wrapper>
            )
          })}
      </Box>
    </Stack>
  )
}

export const PageContainerIntroSkeleton: React.FC = () => {
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

      <Stack direction="row" alignItems="center" spacing={2}></Stack>
    </Stack>
  )
}
