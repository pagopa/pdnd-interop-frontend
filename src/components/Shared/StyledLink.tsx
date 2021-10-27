import React, { FunctionComponent } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { Link as MUILink, LinkProps } from '@mui/material'

type StyledLinkProps = {
  to: string
}

export const StyledLink: FunctionComponent<StyledLinkProps & LinkProps> = React.forwardRef(
  ({ children, to, ...props }, ref) => {
    return (
      <MUILink component={RouterLink} to={to} {...props} ref={ref}>
        {children}
      </MUILink>
    )
  }
)
