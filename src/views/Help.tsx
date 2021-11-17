import React from 'react'
import snakeCase from 'lodash/snakeCase'
import { StyledIntro } from '../components/Shared/StyledIntro'
import textData from '../assets/data/help.json'
import { Contained } from '../components/Shared/Contained'

type Anchor = 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

type Entry = {
  type: Anchor | 'p'
  text: string
}

type EntryTreeBranch = Entry & {
  branches: EntryTreeBranch[]
}

export function Help() {
  const getNestingLevel = (tag: Anchor): number => +tag.replace('h', '')

  const anchorTags: Anchor[] = ['h2', 'h3', 'h4', 'h5', 'h6']
  const minimumNestingLevel = getNestingLevel(anchorTags[0])

  const toTOCTree = (arr: Entry[]): EntryTreeBranch[] =>
    arr.reduce((acc: any, entry: Entry) => {
      if (!anchorTags.includes(entry.type as any)) {
        return acc
      }

      const nestingLevel = getNestingLevel(entry.type as Anchor) - minimumNestingLevel
      addTOCChildren(acc, entry, nestingLevel)
      return acc
    }, [])

  const addTOCChildren = (acc: EntryTreeBranch[], entry: Entry, nestingLevel: number) => {
    if (nestingLevel === 0) {
      acc.push({ ...entry, branches: [] })
    } else {
      addTOCChildren(acc[acc.length - 1].branches, entry, nestingLevel - 1)
    }
  }

  const TOCBranch = ({ text, branches }: EntryTreeBranch) => {
    return (
      <ul>
        <li>
          <a href={`#${snakeCase(text)}`}>{text}</a>
          {Boolean(branches.length > 0) &&
            branches.map((branch, i) => <TOCBranch key={i} {...branch} />)}
        </li>
      </ul>
    )
  }

  const TOCTree = ({ data }: { data: EntryTreeBranch[] }) => (
    <React.Fragment>
      {data.map((branch: any, i: any) => (
        <TOCBranch key={i} {...branch} />
      ))}
    </React.Fragment>
  )

  return (
    <React.Fragment>
      <StyledIntro>
        {{
          title: 'Pagina di supporto',
          description:
            'In questa pagina puoi trovare tutti i riferimenti necessari alla risoluzione dei problemi',
        }}
      </StyledIntro>

      <TOCTree data={toTOCTree(textData as Entry[])} />

      <Contained>
        {/* Page content */}
        {textData.map(({ type, text }, i) => {
          const HTMLTag = type as keyof JSX.IntrinsicElements

          if (anchorTags.includes(type as any)) {
            return (
              <HTMLTag id={`${snakeCase(text)}`} key={i}>
                {text}
              </HTMLTag>
            )
          }

          return <HTMLTag key={i}>{text}</HTMLTag>
        })}
      </Contained>
    </React.Fragment>
  )
}
