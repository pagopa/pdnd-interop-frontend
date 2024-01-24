import React from 'react'
import type { SxProps } from '@mui/material'
import { Box, Button, Skeleton, Stack, Tooltip, Typography } from '@mui/material'
import type { ActionItemButton } from '@/types/common.types'
import { Breadcrumbs } from '../Breadcrumbs'
import { StatusChip } from '@/components/shared/StatusChip'
import { Link, type RouteKey } from '@/router'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

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

type PageContainerIntroProps = {
  title?: string
  description?: string
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
  backToAction?: PageBackToAction
}

export const PageContainer: React.FC<PageContainerProps> = ({ children, isLoading, ...props }) => {
  return (
    <Box>
      <PageContainerBreadcrumbs {...props} />
      {isLoading ? <PageContainerIntroSkeleton /> : <PageContainerIntro {...props} />}
      {!isLoading && <PageContainerActions {...props} />}
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

const PageContainerIntro: React.FC<PageContainerIntroProps> = ({ title, description }) => {
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

  return (
    <Stack
      sx={{ mt: 1, minHeight: 40 }}
      direction="row"
      alignItems="center"
      justifyContent="space-between"
    >
      <Box>{statusChip && <StatusChip {...statusChip} />}</Box>
      <Box>
        {topSideActions &&
          topSideActions.map(({ action, label, color, icon: Icon, tooltip, ...props }, i) => {
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
    </Stack>
  )
}
