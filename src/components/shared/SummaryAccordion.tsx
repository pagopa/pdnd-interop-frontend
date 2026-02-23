import React from 'react'
import {
  Accordion as MUIAccordion,
  AccordionDetails,
  AccordionSummary,
  Chip,
  Paper,
  Typography,
  Box,
  Skeleton,
  Divider,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

type SummaryAccordionProps = {
  headline: string
  title: string
  children: React.ReactNode
  defaultExpanded?: boolean
  warningChipLabel?: string
}
export const SummaryAccordion: React.FC<SummaryAccordionProps> = ({
  headline,
  title,
  children,
  defaultExpanded,
  warningChipLabel,
}) => {
  const id = React.useId()

  return (
    <Paper elevation={8} sx={{ borderRadius: 4, overflow: 'hidden' }}>
      <MUIAccordion disableGutters defaultExpanded={defaultExpanded}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon color="primary" />}
          aria-controls={`panel-content-${id}`}
          id={`panel-header-${id}`}
          sx={{
            px: 4,
            alignItems: 'end',
            py: 1.5,
            '& .MuiAccordionSummary-expandIconWrapper': {
              mb: 1,
            },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            <Typography variant="subtitle2">{headline}</Typography>
            <Typography sx={{ ml: 1 }} variant="h6">
              {title}
            </Typography>
            {warningChipLabel && (
              <Chip
                label={warningChipLabel}
                color="warning"
                variant="filled"
                size="small"
                sx={{ ml: 'auto', mr: 2 }}
              />
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
