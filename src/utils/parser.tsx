import { routes } from '@/router/routes'
import React from 'react'
// import ppHtmlJsonFormat from '../static/privacy-policy-it-ast.json'
// import tosHtmlJsonFormat from '../static/terms-of-service-it-ast.json'

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

export const htmlJsonFormatParser = (json: Node): React.ReactNode => {
  switch (json.node) {
    case 'root':
      return <>{json.child.map((item) => htmlJsonFormatParser(item))}</>
    case 'element':
      const filteredAttr = { ...json.attr }
      if (filteredAttr.style) delete filteredAttr.style
      if (filteredAttr.class) delete filteredAttr.class
      if (filteredAttr.href) {
        if ((filteredAttr.href as string).startsWith('#', 0)) {
          filteredAttr.href = `it/${routes.TOS.PATH.it}/${filteredAttr.href}`
        }
      }
      return React.createElement(
        json.tag,
        { ...filteredAttr, key: Math.random() },
        json.child ? json.child.map((item) => htmlJsonFormatParser(item)) : undefined
      )
    case 'text':
      return json.text
    default:
      break
  }
}

// export const PrivacyPolicyPage: React.FC = () => {
//   return <>{htmlJsonFormatParser(ppHtmlJsonFormat as Node)}</>
// }

// export const TOSPage: React.FC = () => {
//   return <>{htmlJsonFormatParser(tosHtmlJsonFormat as Node)}</>
// }
