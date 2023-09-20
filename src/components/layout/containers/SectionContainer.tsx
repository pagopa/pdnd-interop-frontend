import { IconLink } from '@/components/shared/IconLink'
import type { ActionItemButton } from '@/types/common.types'
import { Box, Typography, Paper, Skeleton, Stack, Tooltip, Button, Divider } from '@mui/material'
import type { PaperProps, SkeletonProps } from '@mui/material'
import React from 'react'

type TypographyProps = Omit<React.ComponentProps<typeof Typography>, 'ref'> & {
  component?: React.ElementType
}

interface SectionContainerProps extends PaperProps {
  title?: string
  description?: React.ReactNode
  children: React.ReactNode
  component?: React.ElementType
  titleTypographyProps?: TypographyProps
  descriptionTypographyProps?: TypographyProps

  innerSection?: boolean

  topSideActions?: Array<ActionItemButton>
  bottomActions?: Array<Omit<React.ComponentProps<typeof IconLink>, 'children'> & { label: string }>

  /**
   * The `newDesign` prop is temporary and will be removed when the new section container design will be
   * implemented in the overall application.
   */
  newDesign?: boolean
}

export function SectionContainer({
  title,
  description,
  children,
  innerSection,
  sx,
  component = 'section',
  titleTypographyProps,
  descriptionTypographyProps,
  newDesign,
  topSideActions,
  bottomActions,
  ...props
}: SectionContainerProps) {
  const titleVariant = !newDesign ? 'overline' : innerSection ? 'sidenav' : 'h6'
  const descriptionVariant = newDesign ? 'body2' : 'caption'

  return (
    <Paper
      component={component}
      sx={{ bgcolor: 'white', p: !innerSection ? 3 : 0, mt: 2, borderRadius: 2, ...sx }}
      {...props}
    >
      <Stack spacing={1}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          {title && (
            <Typography
              component={innerSection ? 'h3' : 'h2'}
              variant={titleVariant}
              {...titleTypographyProps}
            >
              {title}
            </Typography>
          )}
          {topSideActions && (
            <Stack direction="row" spacing={2}>
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
          )}
        </Stack>
        {description && (
          <Typography
            color="text.secondary"
            variant={descriptionVariant}
            {...descriptionTypographyProps}
          >
            {description}
          </Typography>
        )}
      </Stack>
      <Box sx={{ mt: !!(title || description) ? 2 : 0 }}>{children}</Box>
      {bottomActions && bottomActions.length > 0 && (
        <>
          <Divider sx={{ my: 2 }} />
          <Stack alignItems="start" spacing={1.5}>
            {bottomActions.map(({ label, ...props }, i) => (
              <IconLink key={i} {...props}>
                {label}
              </IconLink>
            ))}
          </Stack>
        </>
      )}
    </Paper>
  )
}

export const SectionContainerSkeleton: React.FC<SkeletonProps> = ({ sx, ...props }) => {
  return <Skeleton variant="rectangular" sx={{ borderRadius: 2, mt: 2, ...sx }} {...props} />
}
