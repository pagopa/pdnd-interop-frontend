import type { GridProps } from '@mui/material'
import { Box, Grid, Stack, Typography } from '@mui/material'
import { CopyToClipboardButton } from '@pagopa/mui-italia'
import React from 'react'

type VerticalInformationContainerProps = {
  label: string
  labelDescription?: string
  content?: string
  copyToClipboard?: { value: string; tooltipTitle: string }
  gridProps?: Pick<GridProps, 'xs' | 'sm' | 'md' | 'lg' | 'xl'>
}

export const VerticalInformationContainer: React.FC<VerticalInformationContainerProps> = ({
  label,
  labelDescription,
  content,
  copyToClipboard,
  gridProps = { xs: 12, md: 6 },
}) => {
  return (
    <Grid item {...gridProps}>
      <Stack sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ pb: 2 }}>
          <Typography variant="body2" fontWeight={600}>
            {label}
          </Typography>

          {labelDescription && (
            <Typography variant="caption" color="text.secondary" sx={{ pt: 1 }}>
              {labelDescription}
            </Typography>
          )}
        </Box>

        {content && (
          <Box
            sx={{
              mt: 'auto',
              display: 'flex',
              alignItems: 'center',
              alignSelf: 'flex-start',
              justifyContent: 'space-between',
              borderRadius: 1,
              bgcolor: 'grey.50',
              pl: 1.5,
              py: copyToClipboard ? 0.5 : 1.5,
              pr: copyToClipboard ? 0.5 : 1.5,
            }}
          >
            <Typography variant="body2" fontWeight={600} sx={{ whiteSpace: 'break-spaces' }}>
              {content}
            </Typography>

            {copyToClipboard && (
              <CopyToClipboardButton
                value={copyToClipboard.value}
                tooltipTitle={copyToClipboard.tooltipTitle}
                sx={{ m: 0, alignSelf: 'flex-start' }}
              />
            )}
          </Box>
        )}
      </Stack>
    </Grid>
  )
}
