import React from 'react'
import type { SxProps } from '@mui/material'
import { Box, Button, Skeleton, Stack, Tooltip, Typography } from '@mui/material'
import type { ActionItem, ActionItemButton } from '@/types/common.types'
import { ActionMenu } from '@/components/shared/ActionMenu'
import { InfoTooltip } from '@/components/shared/InfoTooltip'
import { Breadcrumbs } from '../Breadcrumbs'
import { StatusChip } from '@/components/shared/StatusChip'

export type TopSideActions = {
  buttons: Array<ActionItemButton>
  infoTooltip?: string
  actionMenu?: Array<ActionItem>
}

type Props = {
  title?: string
  description?: string
  /**
   * @deprecated use newTopSideActions instead for now, will be removed in the future
   */
  topSideActions?: TopSideActions
  newTopSideActions?: Array<ActionItemButton>
  statusChip?: React.ComponentProps<typeof StatusChip>
  isLoading?: boolean
  sx?: SxProps
}

export const PageContainer: React.FC<Props & { children: React.ReactNode }> = ({
  children,
  sx,
  isLoading,
  ...props
}) => {
  return (
    <Box sx={sx}>
      <Breadcrumbs />
      {isLoading ? <StyledIntroSkeleton /> : <StyledIntro {...props} />}
      <Box sx={{ mt: 4 }}>{children}</Box>
    </Box>
  )
}

export const PageContainerSkeleton: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <Box>
      <Breadcrumbs />
      <StyledIntroSkeleton />
      <Box sx={{ mt: 4 }}>{children}</Box>
    </Box>
  )
}

type StyledIntroProps = {
  title?: string
  description?: string
  topSideActions?: TopSideActions
  newTopSideActions?: Array<ActionItemButton>
  statusChip?: React.ComponentProps<typeof StatusChip>
}

const StyledIntro: React.FC<StyledIntroProps> = ({
  title,
  description,
  newTopSideActions,
  statusChip,
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
      {(newTopSideActions || statusChip) && (
        <Stack
          sx={{ mt: 1, minHeight: 40 }}
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Box>{statusChip && <StatusChip {...statusChip} />}</Box>
          <Box>
            {newTopSideActions &&
              newTopSideActions.map(
                ({ action, label, color, icon: Icon, tooltip, ...props }, i) => {
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
                }
              )}
          </Box>
        </Stack>
      )}
    </Box>
  )
}

export const StyledIntroSkeleton: React.FC = () => {
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
