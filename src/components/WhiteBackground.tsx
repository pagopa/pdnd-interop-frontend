import React, { CSSProperties, FunctionComponent } from 'react'
import { Container } from 'react-bootstrap'

type WhiteBackgroundProps = {
  containerClassNames?: string
  containerStyles?: CSSProperties
}

export const WhiteBackground: FunctionComponent<WhiteBackgroundProps> = ({
  children,
  containerClassNames = '',
  containerStyles = {},
}) => {
  return (
    <div className="my-4 px-4 py-4 bg-white">
      <Container className={containerClassNames} style={containerStyles}>
        {children}
      </Container>
    </div>
  )
}
