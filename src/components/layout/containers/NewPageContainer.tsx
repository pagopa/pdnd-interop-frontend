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

type ActionsSectionProps = {
  topSideActions?: Array<ActionItemButton>
}

type BreadcrumbsSectionProps = {
  backToAction?: PageBackToAction
}

type HeaderInfoSectionProps = {
  label: string
  link: {
    label: string
    onClick: () => void
  }
  actions?: Array<ActionItemButton>
  statusChip?: React.ComponentProps<typeof StatusChip>
}

type IntroProps = {
  title?: string
  description?: string | React.ReactNode
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
  topSideActions,
  infoSection,
}) => {
  return (
    <Box sx={{ flex: 1 }}>
      <Stack direction="row" spacing={2}>
        {title && (
          <Typography component="h1" variant="h4">
            {title}
          </Typography>
        )}
        {<PageContainerActions topSideActions={topSideActions} />}
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

const ActionsSection: React.FC<ActionsSectionProps> = ({ topSideActions }) => {
  if (!topSideActions) return null

  const primaryActions = topSideActions?.filter((action) => action.hierarchy === 'primary')
  const secondaryActions = topSideActions?.filter((action) => action.hierarchy === 'secondary')
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
      justifyContent="flex-end"
      flex={1}
    >
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

export const HeaderInfoSection: React.FC<HeaderInfoSectionProps> = ({
  label,
  link,
  statusChip,
  actions = [],
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
            onClick={link.onClick}
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
