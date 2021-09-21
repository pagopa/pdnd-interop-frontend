import React, { CSSProperties, FunctionComponent } from 'react'
import { Container } from 'react-bootstrap'

type WhiteBackgroundProps = {
  containerClassNames?: string
  containerStyles?: CSSProperties
  stickToTop?: boolean
  noBottomSpacing?: boolean
}

const MAX_WIDTH = 1300

export const WhiteBackground: FunctionComponent<WhiteBackgroundProps> = ({
  children,
  containerClassNames = '',
  containerStyles = {},
  stickToTop = false,
  noBottomSpacing = false,
}) => {
  /* 
    Don't generalize the children container, aka don't try to extract 

      <Container className={containerClassNames} style={containerStyles}>
        {children}
      </Container>

    It would cause a rerender of Container at each render that breaks some forms.
    This is due to React reconciliation, see why here:
    https://reactjs.org/docs/higher-order-components.html#dont-use-hocs-inside-the-render-method
    
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
    <div className="w-100 mt-4">
      <div
        className={`px-4 pt-4 bg-white mx-auto${noBottomSpacing ? '' : ' pb-4'}`}
        style={{ maxWidth: MAX_WIDTH }}
      >
        <Container className={`py-5 ${containerClassNames}`} style={containerStyles}>
          {children}
        </Container>
      </div>
    </div>
  )
}
