import React, { CSSProperties, FunctionComponent } from 'react'
import { Container } from 'react-bootstrap'

type WhiteBackgroundProps = {
  containerClassNames?: string
  containerStyles?: CSSProperties
  stickToTop?: boolean
  verticallyCentered?: boolean
}

const MAX_WIDTH = 1300

export const WhiteBackground: FunctionComponent<WhiteBackgroundProps> = ({
  children,
  containerClassNames = '',
  containerStyles = {},
  stickToTop = false,
  verticallyCentered = false,
}) => {
  const StyledContainer = () => (
    <Container className={containerClassNames} style={containerStyles}>
      {children}
    </Container>
  )

  if (stickToTop) {
    return (
      <div className="px-4 py-4 bg-white w-100">
        <div className="mx-auto" style={{ maxWidth: MAX_WIDTH }}>
          <StyledContainer />
        </div>
      </div>
    )
  }

  return (
    <div className={`w-100${verticallyCentered ? ' my-auto' : ''}`}>
      <div className="px-4 py-4 bg-white mx-auto my-4" style={{ maxWidth: MAX_WIDTH }}>
        <StyledContainer />
      </div>
    </div>
  )
}
