import React from 'react'
import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material'
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material'

type AccordionEntry = {
  summary: string | JSX.Element
  summarySecondary?: string | JSX.Element
  details: string | JSX.Element
}

type StyledAccordionProps = {
  entries: Array<AccordionEntry>
}

export function StyledAccordion({ entries }: StyledAccordionProps) {
  return (
    <React.Fragment>
      {entries.map(({ summary, summarySecondary, details }, i: number) => (
        <Accordion key={i}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`panel-content-${i}`}
            id={`panel-header-${i}`}
          >
            <Typography sx={{ flexShrink: 0, width: summarySecondary ? '40%' : 'auto' }}>
              {summary}
            </Typography>
            {summarySecondary && (
              <Typography color="text.secondary" variant="body2">
                {summarySecondary}
              </Typography>
            )}
          </AccordionSummary>
          <AccordionDetails>{details}</AccordionDetails>
        </Accordion>
      ))}
    </React.Fragment>
  )
}
