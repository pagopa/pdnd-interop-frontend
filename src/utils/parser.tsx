import React from 'react'

type RootNode = {
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

export const htmlJsonFormatParser = (json: Node, route: string): React.ReactNode => {
  switch (json.node) {
    case 'root':
      return <>{json.child.map((item) => htmlJsonFormatParser(item, route))}</>
    case 'element':
      const filteredAttr = { ...json.attr }
      if (filteredAttr.style) delete filteredAttr.style
      if (filteredAttr.class) delete filteredAttr.class
      if (filteredAttr.href && (filteredAttr.href as string).startsWith('#', 0)) {
        if (route.startsWith('/', 0)) {
          const path = route.substring(1)
          filteredAttr.href = `${path}/${filteredAttr.href}`
        }
      }
      return React.createElement(
        json.tag,
        { ...filteredAttr, key: Math.random() },
        json.child ? json.child.map((item) => htmlJsonFormatParser(item, route)) : undefined
      )
    case 'text':
      return json.text
    default:
      break
  }
}
