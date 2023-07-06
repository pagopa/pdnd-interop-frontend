import React from 'react'
import type { SxProps } from '@mui/material'
import { Box, Button, Skeleton, Stack, Typography } from '@mui/material'
import type { ActionItem, ActionItemButton } from '@/types/common.types'
import { ActionMenu } from '@/components/shared/ActionMenu'
import { InfoTooltip } from '@/components/shared/InfoTooltip'

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
      {isLoading ? <StyledIntroSkeleton /> : <StyledIntro {...props} />}
      <Box sx={{ mt: 4 }}>{children}</Box>
    </Box>
  )
}

export const PageContainerSkeleton: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <Box>
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
      <Box sx={{ mt: 4 }}>{children}</Box>
    </Box>
  )
}

type StyledIntroProps = {
  title?: string
  description?: string
  topSideActions?: TopSideActions
  newTopSideActions?: Array<ActionItemButton>
}

const StyledIntro: React.FC<StyledIntroProps> = ({
  title,
  description,
  newTopSideActions,
  topSideActions = null,
}) => {
  return (
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

        {newTopSideActions &&
          newTopSideActions.map(({ action, label, color, icon: Icon, ...props }, i) => (
            <Button
              key={i}
              onClick={action}
              variant="text"
              color={color}
              startIcon={Icon && <Icon />}
              {...props}
            >
              {label}
            </Button>
          ))}

        {topSideActions?.actionMenu && <ActionMenu actions={topSideActions.actionMenu} />}
      </Stack>
    </Stack>
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
