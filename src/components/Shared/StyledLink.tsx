import React, { ElementType, FunctionComponent } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { Link as MUILink, LinkProps } from '@mui/material'

type StyledLinkProps = {
  to?: string
  component?: ElementType
}

const StyledLinkComponent: FunctionComponent<StyledLinkProps & LinkProps> = React.forwardRef(
  ({ children, component = RouterLink, ...props }, ref) => {
    return (
      <MUILink {...props} component={component} ref={ref}>
        {children}
      </MUILink>
    )
  }
)

StyledLinkComponent.displayName = 'StyledButton'

export const StyledLink = StyledLinkComponent
