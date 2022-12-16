import React from 'react'
import {
  Accordion as MUIAccordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

export type AccordionEntry = {
  summary: string | JSX.Element
  summarySecondary?: string | JSX.Element
  details: string | JSX.Element
}

type StyledAccordionProps = {
  entries: Array<AccordionEntry>
}

export function Accordion({ entries }: StyledAccordionProps) {
  return (
    <>
      {entries.map(({ summary, summarySecondary, details }, i: number) => (
        <MUIAccordion key={i}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`panel-content-${i}`}
            id={`panel-header-${i}`}
            sx={{ px: 0 }}
          >
            <Typography
              component={'span'}
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
        </MUIAccordion>
      ))}
    </>
  )
}
