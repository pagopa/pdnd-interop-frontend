import React, { FunctionComponent } from 'react'

type DescriptionBlockProps = {
  label: string
}

export const DescriptionBlock: FunctionComponent<DescriptionBlockProps> = ({ children, label }) => {
  return (
    <div className="mb-3">
      <strong>{label}</strong>
      <br />
      {children}
    </div>
  )
}
