import React from 'react'
import { WhiteBackground } from './WhiteBackground'

type Image = {
  src: string
  alt: string
}

type MessageNoActionProps = {
  img: Image
  title: string
  description: string[]
}

export function MessageNoAction({ img, title, description }: MessageNoActionProps) {
  return (
    <WhiteBackground verticallyCentered={true}>
      <div className="text-center mx-auto" style={{ maxWidth: 400 }}>
        <i>
          <img src={img.src} alt={img.alt} />
        </i>
        {title && (
          <p className="fw-bold mt-4 mb-3 h1" dangerouslySetInnerHTML={{ __html: title }}></p>
        )}
        {description.map((p, i) => (
          <p key={i} dangerouslySetInnerHTML={{ __html: p }} />
        ))}
      </div>
    </WhiteBackground>
  )
}
