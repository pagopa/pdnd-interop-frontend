import React, { FunctionComponent } from 'react'
import { LoadingWithMessage } from './LoadingWithMessage'

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
        <div
          className="position-absolute top-0 bottom-0 start-0 end-0 bg-black bg-opacity-50 d-flex"
          style={{ zIndex: 1 }}
        >
          <LoadingWithMessage label={loadingText} />
        </div>
      ) : null}
    </React.Fragment>
  )
}
