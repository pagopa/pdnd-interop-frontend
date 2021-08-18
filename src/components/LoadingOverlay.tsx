import React, { FunctionComponent } from 'react'
import { Spinner } from 'react-bootstrap'

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
          <div className="mx-auto my-auto text-center bg-white px-4 py-4 rounded">
            <Spinner variant="primary" animation="grow" />
            {loadingText && <p className="text-primary fw-bold mt-2 mb-0">{loadingText}</p>}
          </div>
        </div>
      ) : null}
    </React.Fragment>
  )
}
