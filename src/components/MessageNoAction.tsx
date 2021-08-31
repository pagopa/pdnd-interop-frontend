import React from 'react'
import { RequestOutcomeMessage } from '../../types'
import { WhiteBackground } from './WhiteBackground'

export function MessageNoAction({ img, title, description }: RequestOutcomeMessage) {
  return (
    <WhiteBackground verticallyCentered={true}>
      <div className="text-center mx-auto" style={{ maxWidth: 400 }}>
        <i>
          <img src={img.src} alt={img.alt} />
        </i>
        {title && (
          <p className="fw-bold mt-4 mb-3 h1" dangerouslySetInnerHTML={{ __html: title }}></p>
        )}
        {description.map((paragraph, i) => (
          <React.Fragment key={i}>{paragraph}</React.Fragment>
        ))}
      </div>
    </WhiteBackground>
  )
}
