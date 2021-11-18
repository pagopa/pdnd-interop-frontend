import React, { FunctionComponent } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { Link as MUILink, LinkProps } from '@mui/material'

type StyledLinkProps = {
  to?: string
  component?: any
}

const StyledLinkComponent: FunctionComponent<StyledLinkProps & LinkProps> = React.forwardRef(
  ({ children, to, component = RouterLink, ...props }, ref) => {
    return (
      <MUILink component={component} to={to} {...props} ref={ref}>
        {children}
      </MUILink>
    )
  }
)

StyledLinkComponent.displayName = 'StyledButton'

export const StyledLink = StyledLinkComponent
