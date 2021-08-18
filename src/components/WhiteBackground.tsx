import React, { FunctionComponent } from 'react'

export const WhiteBackground: FunctionComponent = ({ children }) => {
  return <div className="my-4 px-4 py-4 bg-white">{children}</div>
}
