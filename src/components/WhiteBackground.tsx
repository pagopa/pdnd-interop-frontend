import React, { CSSProperties, FunctionComponent } from 'react'
import { Container } from 'react-bootstrap'

type WhiteBackgroundProps = {
  containerClassNames?: string
  containerStyles?: CSSProperties
  noVerticalMargin?: boolean
}

export const WhiteBackground: FunctionComponent<WhiteBackgroundProps> = ({
  children,
  containerClassNames = '',
  containerStyles = {},
  noVerticalMargin = false,
}) => {
  return (
    <div
      className={`${noVerticalMargin ? '' : 'my-4 '}px-4 py-4 bg-white w-100 mx-auto`}
      style={{ maxWidth: 1300 }}
    >
      <Container className={containerClassNames} style={containerStyles}>
        {children}
      </Container>
    </div>
  )
}
