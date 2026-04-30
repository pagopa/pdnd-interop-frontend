import React from 'react'
import type { SxProps } from '@mui/material'
import { Box, Button, Skeleton, Stack, Tooltip, Typography } from '@mui/material'
import type { ActionItemButton } from '@/types/common.types'
import { Breadcrumbs } from '../Breadcrumbs'
import { StatusChip } from '@/components/shared/StatusChip'
import { Link, type RouteKey } from '@/router'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { ActionMenu, ActionMenuSkeleton } from '@/components/shared/ActionMenu'

export type PageBackToAction = {
  label: string
  to: RouteKey
  params?: Record<string, string>
  urlParams?: Record<string, string>
}

type PageContainerActionsProps = {
  statusChip?: React.ComponentProps<typeof StatusChip>
  topSideActions?: Array<ActionItemButton>
}

type PageContainerBreadcrumbsProps = {
  backToAction?: PageBackToAction
}

type PageContainerSecondaryIntroProps = {
  label: string
  link: {
    label: string
    onClink: () => void
  }
  actions: Array<ActionItemButton>
  statusChip?: React.ComponentProps<typeof StatusChip>
}

type PageContainerIntroProps = {
  title?: string
  description?: string | React.ReactNode
  secondaryIntro?: PageContainerSecondaryIntroProps
} & PageContainerActionsProps

type PageContainerProps = {
  isLoading?: boolean
  sx?: SxProps
  children: React.ReactNode
} & PageContainerBreadcrumbsProps &
  PageContainerIntroProps

type PageContainerSkeletonProps = {
  children?: React.ReactNode
  backToAction?: PageBackToAction
}

export const PageContainer: React.FC<PageContainerProps> = ({ children, isLoading, ...props }) => {
  return (
    <Stack direction={'column'} spacing={3}>
      <PageContainerBreadcrumbs {...props} />
      {isLoading ? <PageContainerIntroSkeleton /> : <PageContainerIntro {...props} />}
      {/* {!isLoading && <PageContainerActions {...props} />} */}
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
      <PageContainerBreadcrumbs backToAction={backToAction} />
      <PageContainerIntroSkeleton />
      <Box sx={{ mt: 1 }}>{children}</Box>
    </Box>
  )
}

const PageContainerIntro: React.FC<PageContainerIntroProps> = ({
  title,
  description,
  statusChip,
  topSideActions,
  secondaryIntro,
}) => {
  return (
    <Box sx={{ flex: 1 }}>
      <Stack direction="row" spacing={2}>
        {title && (
          <Typography component="h1" variant="h4">
            {title}
          </Typography>
        )}
        {<PageContainerActions statusChip={statusChip} topSideActions={topSideActions} />}
      </Stack>
      {description && <PageContainerSubtitle description={description} />}
      {secondaryIntro && <PageContainerSecondaryIntro {...secondaryIntro} />}
    </Box>
  )
}

type PageContainerSubtitle = {
  description: string | React.ReactNode
}

const PageContainerSubtitle: React.FC<PageContainerSubtitle> = ({ description }) => {
  return typeof description === 'string' ? (
    <Typography component="p" variant="body1" sx={{ mt: 1, mb: 0 }}>
      {description}
    </Typography>
  ) : (
    description
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
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
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

const PageContainerActions: React.FC<PageContainerActionsProps> = ({
  statusChip,
  topSideActions,
}) => {
  if (!statusChip && !topSideActions) return null

  const primaryActions = topSideActions?.filter(
    (action) => action.hierarchy && action.hierarchy === 'primary'
  )
  const secondaryActions = topSideActions?.filter(
    (action) => action.hierarchy && action.hierarchy === 'secondary'
  )
  const menuActions = topSideActions?.filter((action) => action.hierarchy === undefined)

  const getButtonWrapper = (tooltip?: string, disabled?: boolean) => {
    return tooltip
      ? ({ children }: { children: React.ReactElement }) => (
          <Tooltip arrow title={tooltip}>
            <span tabIndex={disabled ? 0 : undefined}>{children}</span>
          </Tooltip>
        )
      : React.Fragment
  }

  return (
    <Stack
      sx={{ minHeight: 40 }}
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      flex={1}
    >
      <Box>{statusChip && <StatusChip {...statusChip} />}</Box>
      <Stack direction="row" spacing={2}>
        {secondaryActions &&
          secondaryActions.map(({ action, label, color, icon: Icon, tooltip, ...props }, index) => {
            const Wrapper = getButtonWrapper(tooltip, props.disabled)
            return (
              <Wrapper key={index}>
                <Button
                  onClick={action}
                  variant="outlined"
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
        {primaryActions &&
          primaryActions.map(({ action, label, color, icon: Icon, tooltip, ...props }, index) => {
            const Wrapper = getButtonWrapper(tooltip, props.disabled)
            return (
              <Wrapper key={index}>
                <Button
                  onClick={action}
                  variant="contained"
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
        {menuActions ? <ActionMenu actions={menuActions} /> : <ActionMenuSkeleton />}
      </Stack>
    </Stack>
  )
}

export const PageContainerSecondaryIntro: React.FC<PageContainerSecondaryIntroProps> = ({
  label,
  link,
  statusChip,
  actions,
}) => {
  return (
    <Box bgcolor="ThreeDFace" py={2} px={2} borderRadius={1} mt={3}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Stack direction="row" spacing={4} alignItems="center">
          <Typography component="h2" variant="body2" textTransform="uppercase">
            {label}
          </Typography>
          <Button
            component="a"
            type="button"
            variant="naked"
            sx={{ textDecoration: 'underline' }}
            onClick={link.onClink}
          >
            {link.label}
          </Button>
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
    </Stack>
  )
}
