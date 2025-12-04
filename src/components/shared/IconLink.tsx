import React from 'react'
import { Link, Stack, Tooltip, type LinkProps } from '@mui/material'

type IconLinkProps<D extends React.ElementType = 'a'> = {
  startIcon?: React.ReactNode
  endIcon?: React.ReactNode
  children: React.ReactNode
  tooltip?: React.ReactNode
  component?: D
} & LinkProps<D>

export const IconLink = <D extends React.ElementType = 'a'>({
  startIcon,
  endIcon,
  children,
  tooltip,
  ...linkProps
}: IconLinkProps<D>) => {
  const Wrapper = tooltip
    ? ({ children }: { children: React.ReactElement }) => (
        <Tooltip placement="right" arrow title={tooltip}>
          <span style={{ width: 'fit-content' }}>{children}</span>
        </Tooltip>
      )
    : React.Fragment
  return (
    <Wrapper>
      <Link
        variant="body2"
        underline="hover"
        {...linkProps}
        sx={{
          verticalAlign: 'inherit',
          ...linkProps.sx,
          '&:disabled, &[aria-disabled="true"]': {
            opacity: 0.5,
            cursor: 'not-allowed',
            pointerEvents: 'none',
            color: 'rgba(23, 50, 77, 0.6)',
          },
        }}
      >
        <Stack
          flexDirection="row"
          justifyContent="center"
          alignItems="center"
          component="span"
          gap={1}
          sx={{
            cursor: 'pointer',
            textDecoration: 'inherit',
            display: 'inline-flex',
          }}
        >
          {startIcon} <span>{children}</span>
          {endIcon}
        </Stack>
      </Link>
    </Wrapper>
  )
}
