import React from 'react'

type SmallLabelProps = {
  text: string
}

export function SmallLabel({ text }: SmallLabelProps) {
  return <span className="d-block text-dark fw-bold fs-6 mt-4 mb-2">{text}</span>
}
