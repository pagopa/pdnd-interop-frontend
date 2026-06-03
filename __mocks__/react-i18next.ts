import noop from 'lodash/noop'
import React from 'react'

export const useTranslation = () => {
  return {
    t: (str: string) => str,
    i18n: {
      changeLanguage: () => new Promise(noop),
      language: 'it',
    },
  }
}

const renderTransNodes = (
  text: string,
  components?: Record<string, React.ReactElement>
): React.ReactNode[] => {
  const nodes: React.ReactNode[] = []
  const tagRegex = /<([a-zA-Z0-9]+)>(.*?)<\/\1>/g
  let lastIndex = 0

  for (const match of text.matchAll(tagRegex)) {
    const [matchedText, tag, content] = match

    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index))
    }

    const component = components?.[tag]
    nodes.push(
      component
        ? React.cloneElement(component, { key: match.index }, renderTransNodes(content, components))
        : renderTransNodes(content, components)
    )

    lastIndex = match.index + matchedText.length
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex))
  }

  return nodes
}

export const Trans = ({
  children,
  components,
  i18nKey,
  defaults,
}: {
  children?: React.ReactNode
  components?: Record<string, React.ReactElement>
  i18nKey?: string
  defaults?: string
}) => {
  const text = typeof children === 'string' ? children : (i18nKey ?? defaults)
  return typeof text === 'string' ? renderTransNodes(text, components) : children
}
