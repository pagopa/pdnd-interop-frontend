import React from 'react'
import type { SxProps } from '@mui/material'
import { Box, Button, Skeleton, Stack, Tooltip, Typography } from '@mui/material'
import { PageContainerFormDirtyStateContext } from '@/hooks/usePageContainerFormDirtyState'
import type { ActionItemButton } from '@/types/common.types'
import { StatusChip } from '@/components/shared/StatusChip'
import { PageNavigation, type PageNavigationProps } from './PageNavigation'

export { usePageContainerFormDirtyState } from '@/hooks/usePageContainerFormDirtyState'

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
  const [formDirtyOwners, setFormDirtyOwners] = React.useState<
    Record<string, { stepKey: string | number | undefined; isDirty: boolean }>
  >({})
  const [hasDomUnsavedChanges, setHasDomUnsavedChanges] = React.useState(false)
  const wizardStepKey = props.navigation?.mode === 'wizard' ? props.navigation.stepKey : undefined

  React.useEffect(() => {
    setHasDomUnsavedChanges(false)
  }, [wizardStepKey])

  const updateOwner = React.useCallback(
    (ownerId: string, stepKey: string | number | undefined, isDirty: boolean) => {
      setFormDirtyOwners((owners) => {
        if (!isDirty) {
          if (!(ownerId in owners)) return owners
          const { [ownerId]: _owner, ...remainingOwners } = owners
          return remainingOwners
        }
        return { ...owners, [ownerId]: { stepKey, isDirty } }
      })
    },
    []
  )
  const unregisterOwner = React.useCallback((ownerId: string) => {
    setFormDirtyOwners((owners) => {
      if (!(ownerId in owners)) return owners
      const { [ownerId]: _owner, ...remainingOwners } = owners
      return remainingOwners
    })
  }, [])
  const formDirtyState = React.useMemo(
    () => ({ updateOwner, unregisterOwner, stepKey: wizardStepKey }),
    [unregisterOwner, updateOwner, wizardStepKey]
  )
  const hasFormUnsavedChanges = Object.values(formDirtyOwners).some(
    (owner) => owner.stepKey === wizardStepKey && owner.isDirty
  )
  const hasUnsavedChanges = hasDomUnsavedChanges || hasFormUnsavedChanges

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
      {isLoading ? <PageContainerIntroSkeleton /> : <PageContainerHeader {...props} />}
      <PageContainerFormDirtyStateContext.Provider value={formDirtyState}>
        <Box
          sx={{ mt: 1 }}
          onChangeCapture={
            props.navigation?.mode === 'wizard' ? () => setHasDomUnsavedChanges(true) : undefined
          }
        >
          {children}
        </Box>
      </PageContainerFormDirtyStateContext.Provider>
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

const PageContainerHeader: React.FC<PageContainerIntroProps & PageContainerActionsProps> = ({
  title,
  description,
  statusChip,
  topSideActions,
}) => {
  const hasTitleGroup = Boolean(title || statusChip)
  const hasActions = Boolean(topSideActions && topSideActions.length > 0)

  if (!hasTitleGroup && !hasActions && !description) return null

  return (
    <Box>
      {(hasTitleGroup || hasActions) && (
        <Stack
          data-testid="page-container-header"
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          flexWrap="wrap"
          columnGap={2}
          rowGap={1}
          sx={{ minHeight: 40 }}
        >
          {hasTitleGroup && (
            <Stack
              data-testid="page-container-header-title"
              direction="row"
              alignItems="center"
              flexWrap="wrap"
              columnGap={2}
              rowGap={1}
              sx={{ minWidth: 0 }}
            >
              {title && (
                <Typography component="h1" variant="h4" sx={{ overflowWrap: 'anywhere' }}>
                  {title}
                </Typography>
              )}
              {statusChip && <StatusChip {...statusChip} />}
            </Stack>
          )}
          {hasActions && <PageContainerActions topSideActions={topSideActions} />}
        </Stack>
      )}
      {description && <PageContainerSubtitle description={description} />}
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

const PageContainerActions: React.FC<Pick<PageContainerActionsProps, 'topSideActions'>> = ({
  topSideActions,
}) => {
  if (!topSideActions || topSideActions.length === 0) return null

  return (
    <Stack
      data-testid="page-container-header-actions"
      direction="row"
      alignItems="center"
      justifyContent="flex-end"
      flexWrap="wrap"
      gap={1}
      sx={{ ml: 'auto' }}
    >
      {topSideActions.map(({ action, label, color, icon: Icon, tooltip, ...props }, i) => {
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
