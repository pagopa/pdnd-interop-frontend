import React from 'react'
import {
  Accordion as MUIAccordion,
  AccordionDetails,
  AccordionSummary,
  Paper,
  Typography,
  Box,
  Skeleton,
  Divider,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Stack } from '@mui/material'
import { Chip } from '@mui/material'

type SummaryAccordionProps = {
  headline: string
  title: string
  children: React.ReactNode
  defaultExpanded?: boolean
  showWarning?: boolean
  warningLabel?: string
}
export const SummaryAccordion: React.FC<SummaryAccordionProps> = ({
  headline,
  title,
  children,
  defaultExpanded,
  showWarning,
  warningLabel,
}) => {
  const id = React.useId()

  return (
    <Paper elevation={8} sx={{ borderRadius: 4, overflow: 'hidden' }}>
      <MUIAccordion
        disableGutters
        defaultExpanded={defaultExpanded}
        sx={{
          '.MuiAccordionSummary-root': {
            alignItems: 'center',
          },
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon color="primary" />}
          aria-controls={`panel-content-${id}`}
          id={`panel-header-${id}`}
          sx={{
            px: 4,
            alignItems: 'end',
            py: 1.5,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            <Stack direction="row" alignItems="center">
              <Typography variant="subtitle2">{headline}</Typography>
              <Typography sx={{ ml: 1 }} variant="h6">
                {title}
              </Typography>
            </Stack>
            {showWarning && warningLabel && (
              <Chip label={warningLabel} color="warning" size="small" sx={{ mr: 3 }} />
            )}
          </Box>
        </AccordionSummary>
        <AccordionDetails sx={{ px: 4, pb: 3 }}>
          <Divider sx={{ mb: 3, mt: -1 }} />
          {children}
        </AccordionDetails>
      </MUIAccordion>
    </Paper>
  )
}

export const SummaryAccordionSkeleton: React.FC = () => {
  return <Skeleton variant="rectangular" height={114} sx={{ borderRadius: 4 }} component="div" />
}
