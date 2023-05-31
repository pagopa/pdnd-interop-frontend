import React from 'react'

export type RootNode = {
  node: 'root'
  child: Array<Node>
}

type ElementNode = {
  node: 'element'
  tag: string
  child?: Array<Node>
  attr?: { [key: string]: string | Array<string> }
}

type TextNode = {
  node: 'text'
  text: string
}

export type Node = RootNode | ElementNode | TextNode

function decodeHtml(html: string): string {
  const txt = document.createElement('textarea')
  txt.innerHTML = html
  return txt.value
}

export const htmlJsonFormatParser = (json: Node, route: string): React.ReactNode => {
  switch (json.node) {
    case 'root':
      return <>{json.child.map((item) => htmlJsonFormatParser(item, route))}</>
    case 'element':
      const filteredAttr: Record<string, unknown> = {
        id: json.attr?.id,
        href: json.attr?.href,
        target: json.attr?.target,
        rel: Array.isArray(json.attr?.rel) ? json.attr?.rel.join(' ') : json.attr?.rel,
      }
      /**
       * During the anchor navigation the root path will be lost.
       * To avoid that behaviour we put the path behind the anchor in the href
       */
      if (filteredAttr.href && (filteredAttr.href as string).startsWith('#', 0)) {
        if (route.startsWith('/', 0)) {
          const path = route.substring(1)
          filteredAttr.href = `${path}${filteredAttr.href}`
        }
      }
      return React.createElement(
        json.tag,
        { ...filteredAttr, key: Math.random() },
        json.child ? json.child.map((item) => htmlJsonFormatParser(item, route)) : undefined
      )
    case 'text':
      return decodeHtml(json.text)
    default:
      break
  }
}
