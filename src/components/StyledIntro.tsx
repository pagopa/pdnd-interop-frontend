import React, { FunctionComponent } from 'react'
import { Row } from 'react-bootstrap'

type ChildrenProps = {
  title: React.ReactNode
  description?: React.ReactNode
}

type StyledIntroProps = {
  children: ChildrenProps
  priority?: 1 | 2 | 3
  additionalClasses?: string
}

export const StyledIntro: FunctionComponent<StyledIntroProps> = ({
  children,
  additionalClasses,
  priority = 1,
}) => {
  // from https://stackoverflow.com/a/33471928
  // Priority 1 is h2, 2 is h3, 3 is h4
  const TitleTag = `h${priority + 1}` as keyof JSX.IntrinsicElements

  return (
    <Row className={`mb-4 ${additionalClasses || ''}`} style={{ maxWidth: 480 }}>
      <TitleTag>{children.title}</TitleTag>
      {children.description && <p>{children.description}</p>}
    </Row>
  )
}
