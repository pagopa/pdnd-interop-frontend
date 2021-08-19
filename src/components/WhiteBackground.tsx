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
  /* 
    Don't generalize the children container, aka don't try to extract 

      <Container className={containerClassNames} style={containerStyles}>
        {children}
      </Container>

    This would cause a rerender of the whole tree that breaks some forms.
    See the difference in the onboarding form (add info for "Rappresentante Legale")
    between commit '9577ef2' and the following one.
  */

  if (stickToTop) {
    return (
      <div className="px-4 py-4 bg-white w-100">
        <div className="mx-auto" style={{ maxWidth: MAX_WIDTH }}>
          <Container className={containerClassNames} style={containerStyles}>
            {children}
          </Container>
        </div>
      </div>
    )
  }

  return (
    <div className={`w-100${verticallyCentered ? ' my-auto' : ''}`}>
      <div className="px-4 py-4 bg-white mx-auto my-4" style={{ maxWidth: MAX_WIDTH }}>
        <Container className={containerClassNames} style={containerStyles}>
          {children}
        </Container>
      </div>
    </div>
  )
}
