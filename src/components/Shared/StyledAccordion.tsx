import React from 'react'
import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material'
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material'
import { MEDIUM_MAX_WIDTH } from '../../lib/constants'

type AccordionEntry = {
  summary: string | JSX.Element
  details: string | JSX.Element
}

type StyledAccordionProps = {
  entries: AccordionEntry[]
}

export function StyledAccordion({ entries }: StyledAccordionProps) {
  return (
    <React.Fragment>
      {entries.map(({ summary, details }, i: number) => (
        <Accordion sx={{ maxWidth: MEDIUM_MAX_WIDTH }} key={i}>
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
