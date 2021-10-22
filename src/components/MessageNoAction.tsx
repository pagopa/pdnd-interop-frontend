import React from 'react'
import { RequestOutcomeMessage } from '../../types'

export function MessageNoAction({ img, title, description }: RequestOutcomeMessage) {
  return (
    <div className="text-center mx-auto my-auto" style={{ maxWidth: 440 }}>
      <i>
        <img width={120} src={img.src} alt={img.alt} />
      </i>
      {title && (
        <p className="fw-bold mt-4 mb-3 h2" dangerouslySetInnerHTML={{ __html: title }}></p>
      )}
      {description.map((paragraph, i) => (
        <React.Fragment key={i}>{paragraph}</React.Fragment>
      ))}
    </div>
  )
}
