import React from 'react'
import type { SxProps } from '@mui/material'
import { Box, Button, Skeleton, Stack, Tooltip, Typography } from '@mui/material'
import type { ActionItemButton } from '@/types/common.types'
import { StatusChip } from '@/components/shared/StatusChip'
import { PageNavigation, type PageNavigationProps } from './PageNavigation'

type PageContainerActionsProps = {
  statusChip?: React.ComponentProps<typeof StatusChip>
  topSideActions?: Array<ActionItemButton>
}

type PageContainerNavigationProps = {
  navigation?: PageNavigationProps
}

type PageContainerIntroProps = {
  title?: string
  description?: string | React.ReactNode
}

type PageContainerProps = {
  isLoading?: boolean
  sx?: SxProps
  children: React.ReactNode
} & PageContainerActionsProps &
  PageContainerNavigationProps &
  PageContainerIntroProps

type PageContainerSkeletonProps = {
  children?: React.ReactNode
  navigation?: PageNavigationProps
}

export const PageContainer: React.FC<PageContainerProps> = ({ children, isLoading, ...props }) => {
  const [hasUnsavedChanges, setHasUnsavedChanges] = React.useState(false)
  const wizardStepKey = props.navigation?.mode === 'wizard' ? props.navigation.stepKey : undefined

  React.useEffect(() => {
    setHasUnsavedChanges(false)
  }, [wizardStepKey])

  const navigation =
    props.navigation?.mode === 'wizard'
      ? {
          ...props.navigation,
          hasUnsavedChanges: props.navigation.hasUnsavedChanges ?? hasUnsavedChanges,
        }
      : props.navigation

  return (
    <Box>
      <PageContainerNavigation navigation={navigation} />
      {isLoading ? <PageContainerIntroSkeleton /> : <PageContainerIntro {...props} />}
      {!isLoading && <PageContainerActions {...props} />}
      <Box
        sx={{ mt: 1 }}
        onChangeCapture={
          props.navigation?.mode === 'wizard' ? () => setHasUnsavedChanges(true) : undefined
        }
      >
        {children}
      </Box>
    </Box>
  )
}

export const PageContainerSkeleton: React.FC<PageContainerSkeletonProps> = ({
  children,
  navigation,
}) => {
  return (
    <Box>
      <PageContainerNavigation navigation={navigation} />
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
          {description && <PageContainerSubtitle description={description} />}
        </Box>
      </Stack>
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
const PageContainerNavigation: React.FC<PageContainerNavigationProps> = ({ navigation }) => (
  <PageNavigation {...(navigation ?? {})} />
)

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
      <Stack direction="row" spacing={1}>
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
      </Stack>
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
