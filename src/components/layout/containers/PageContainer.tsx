import React from 'react'
import type { SxProps } from '@mui/material'
import { Box, Button, Skeleton, Stack, Tooltip, Typography } from '@mui/material'
import isEqual from 'lodash/isEqual'
import { useFormState, useWatch } from 'react-hook-form'
import type { Control, FieldValues } from 'react-hook-form'
import type { ActionItemButton } from '@/types/common.types'
import { StatusChip } from '@/components/shared/StatusChip'
import { PageNavigation, type PageNavigationProps } from './PageNavigation'

type PageContainerFormDirtyStateContextValue = {
  updateOwner: (ownerId: string, stepKey: string | number | undefined, isDirty: boolean) => void
  unregisterOwner: (ownerId: string) => void
  stepKey: string | number | undefined
}

const PageContainerFormDirtyStateContext =
  React.createContext<PageContainerFormDirtyStateContextValue>({
    updateOwner: () => {},
    unregisterOwner: () => {},
    stepKey: undefined,
  })

export const usePageContainerFormDirtyState = <TFieldValues extends FieldValues>(
  control: Control<TFieldValues>
) => {
  const { updateOwner, unregisterOwner, stepKey } = React.useContext(
    PageContainerFormDirtyStateContext
  )
  const ownerId = React.useId()
  const { isDirty, defaultValues } = useFormState({ control })
  const values = useWatch({ control })
  const hasUnsavedChanges = isDirty || !isEqual(values, defaultValues)

  React.useEffect(() => {
    updateOwner(ownerId, stepKey, hasUnsavedChanges)
  }, [hasUnsavedChanges, ownerId, stepKey, updateOwner])

  React.useEffect(() => () => unregisterOwner(ownerId), [ownerId, unregisterOwner])
}

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
      {isLoading ? <PageContainerIntroSkeleton /> : <PageContainerIntro {...props} />}
      {!isLoading && <PageContainerActions {...props} />}
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
