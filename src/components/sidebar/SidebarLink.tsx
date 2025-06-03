import type { SvgIconComponent } from '@mui/icons-material'
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material'
import type { ComponentPropsWithoutRef, ElementType } from 'react'

type PolymorphicProps<C extends ElementType, P = {}> = P & { component?: C } & Omit<
    ComponentPropsWithoutRef<C>,
    keyof P | 'component'
  >

export type SideNavItemLinkProps<C extends ElementType = 'a'> = PolymorphicProps<
  C,
  {
    label: string
    typographyProps?: ComponentPropsWithoutRef<typeof Typography>
    isActive?: boolean
    StartIcon?: SvgIconComponent
    EndIcon?: SvgIconComponent
    indented?: boolean
    disabled?: boolean
    collapsed?: boolean
  }
>

export function SidebarLink<C extends ElementType = 'a'>({
  label,
  isActive,
  StartIcon,
  EndIcon,
  component,
  disabled,
  indented = false,
  typographyProps,
  collapsed,
  ...props
}: SideNavItemLinkProps<C>) {
  return (
    <ListItem disablePadding>
      <ListItemButton component={component ?? 'a'} {...props} disabled={disabled}>
        <Stack direction="row" sx={{ flexGrow: 1, paddingLeft: 2 }}>
          {StartIcon && (
            <ListItemIcon>
              <StartIcon fontSize="inherit" color={isActive ? 'primary' : undefined} />
            </ListItemIcon>
          )}
          {!collapsed && (
            <ListItemText
              disableTypography
              sx={{ color: 'inherit' }}
              primary={
                <Typography
                  color="inherit"
                  {...typographyProps}
                  sx={{
                    fontWeight: isActive ? 600 : 300,
                    pl: indented ? 4 : 0,
                    ...typographyProps?.sx,
                  }}
                >
                  {label}
                </Typography>
              }
            />
          )}
          {!collapsed && EndIcon && (
            <ListItemIcon>
              <EndIcon color="action" />
            </ListItemIcon>
          )}
        </Stack>
      </ListItemButton>
    </ListItem>
  )
}
