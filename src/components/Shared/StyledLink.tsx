import React, { FunctionComponent } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { Link as MUILink, LinkProps } from '@mui/material'

type StyledLinkProps = {
  to: string
}

export const StyledLink: FunctionComponent<StyledLinkProps & LinkProps> = ({
  children,
  to,
  ...props
}) => {
  return (
    <MUILink component={RouterLink} to={to} {...props}>
      {children}
    </MUILink>
  )
}
