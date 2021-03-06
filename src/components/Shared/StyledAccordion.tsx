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
            sx={{ px: 0 }}
          >
            <Typography
              sx={{
                flexShrink: summarySecondary ? 0 : 1,
                width: summarySecondary ? '40%' : 'auto',
              }}
            >
              {summary}
            </Typography>
            {summarySecondary && (
              <Typography component="span" color="text.secondary" variant="body2">
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
