import React from 'react'
import { Link, Stack, type LinkProps } from '@mui/material'

type IconLinkProps<D extends React.ElementType = 'a'> = {
  startIcon?: React.ReactNode
  endIcon?: React.ReactNode
  children: React.ReactNode
  inline?: boolean
  component?: D
} & LinkProps<D>

export const IconLink = <D extends React.ElementType = 'a'>({
  startIcon,
  endIcon,
  children,
  inline,
  ...linkProps
}: IconLinkProps<D>) => {
  return (
    <Link variant="body2" underline="hover" {...linkProps}>
      <Stack
        gap={0.25}
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
        component="span"
        sx={{
          cursor: 'pointer',
          textDecoration: 'inherit',
          display: inline ? 'inline-flex' : 'flex',
        }}
      >
        {startIcon} <span>{children}</span> {endIcon}
      </Stack>
    </Link>
  )
}
