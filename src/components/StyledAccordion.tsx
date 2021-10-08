import React, { useState } from 'react'

type AccordionEntry = {
  summary: string | JSX.Element
  details: string | JSX.Element
}

type StyledAccordionProps = {
  entries: AccordionEntry[]
}

export function StyledAccordion({ entries }: StyledAccordionProps) {
  const [index, setIndex] = useState<number | null>(null)

  const collapse = () => {
    setIndex(null)
  }

  const wrapToggle = (newIndex: number) => (e: any) => {
    e.preventDefault()

    if (newIndex === index) {
      collapse()
    } else {
      setIndex(newIndex)
    }
  }
  return (
    <React.Fragment>
      {entries.map(({ summary, details }, i: number) => {
        return (
          <div className="mt-2 py-3 px-3 border-bottom border-secondary" key={i}>
            <button
              className="reset-btn w-100 d-flex justify-content-between align-items-center"
              onClick={wrapToggle(i)}
            >
              <span>{summary}</span>
              <i className={`text-primary fs-5 bi bi-chevron-${i === index ? 'up' : 'down'}`} />
            </button>
            <div
              style={{
                overflow: 'hidden',
                transition: '0.45s max-height ease-in-out',
                maxHeight: i !== index ? 0 : 500,
              }}
            >
              <div className="pt-3">{details}</div>
            </div>
          </div>
        )
      })}
    </React.Fragment>
  )
}
