import React from 'react'
import { Box, Button, ButtonProps, Stack, SxProps, Typography } from '@mui/material'
import { ActionItem } from '@/types/common.types'
import ActionMenu from '@/components/shared/ActionMenu'

export type TopSideActions = {
  buttons: Array<ActionItem & Omit<ButtonProps, keyof ActionItem | 'onClick'>>
  actionMenu?: Array<ActionItem>
}

type Props = {
  title: string
  description?: string
  topSideActions?: TopSideActions
  sx?: SxProps
}

export const PageContainer: React.FC<Props & { children: React.ReactNode }> = ({
  children,
  sx,
  ...props
}) => {
  return (
    <Box sx={sx}>
      <StyledIntro {...props} />
      <Box sx={{ mt: 4 }}>{children}</Box>
    </Box>
  )
}

type StyledIntroProps = {
  title: string
  description?: string
  topSideActions?: TopSideActions
}

const StyledIntro: React.FC<StyledIntroProps> = ({ title, description, topSideActions = null }) => {
  return (
    <Stack direction="row" alignItems="end" spacing={2}>
      <Box sx={{ flex: 1 }}>
        <Typography component="h1" variant="h4">
          {title}
        </Typography>
        {description && (
          <Typography component="p" variant="body1" sx={{ mt: 1, mb: 0 }}>
            {description}
          </Typography>
        )}
      </Box>

      <Stack direction="row" alignItems="center" spacing={2}>
        {topSideActions?.buttons &&
          topSideActions.buttons.map(({ action, label, ...props }, i) => (
            <Button key={i} onClick={action} variant="outlined" size="small" {...props}>
              {label}
            </Button>
          ))}
        {topSideActions?.actionMenu && <ActionMenu actions={topSideActions.actionMenu} />}
      </Stack>
    </Stack>
  )
}
