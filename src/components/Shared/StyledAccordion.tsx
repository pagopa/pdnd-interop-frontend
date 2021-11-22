import React from 'react'
import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material'
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material'

type AccordionEntry = {
  summary: string | JSX.Element
  details: string | JSX.Element
}

type StyledAccordionProps = {
  entries: Array<AccordionEntry>
}

export function StyledAccordion({ entries }: StyledAccordionProps) {
  return (
    <React.Fragment>
      {entries.map(({ summary, details }, i: number) => (
        <Accordion key={i}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`panel-content-${i}`}
            id={`panel-header-${i}`}
          >
            <Typography>{summary}</Typography>
          </AccordionSummary>
          <AccordionDetails>{details}</AccordionDetails>
        </Accordion>
      ))}
    </React.Fragment>
  )
}
