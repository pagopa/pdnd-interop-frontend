import React, { FunctionComponent } from 'react'
import { LoadingWithMessage } from './LoadingWithMessage'
import { Overlay } from './Overlay'

type LoadingOverlayProps = {
  isLoading: boolean
  loadingText?: string
}

export const LoadingOverlay: FunctionComponent<LoadingOverlayProps> = ({
  isLoading,
  loadingText,
  children,
}) => {
  return (
    <React.Fragment>
      {children}
      {isLoading ? (
        <Overlay>
          <LoadingWithMessage label={loadingText} />
        </Overlay>
      ) : null}
    </React.Fragment>
  )
}
