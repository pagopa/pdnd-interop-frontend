import { Box, Stack, Typography } from '@mui/material'
import { CopyToClipboardButton } from '@pagopa/mui-italia'
import React from 'react'

type VerticalInformationContainerProps = {
  label: string
  labelDescription?: string
  content?: string
  copyToClipboard?: { value: string; tooltipTitle: string }
}

export const VerticalInformationContainer: React.FC<VerticalInformationContainerProps> = ({
  label,
  labelDescription,
  content,
  copyToClipboard,
}) => {
  return (
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
            py: 0.5,
            pr: 0.5,
          }}
        >
          <Typography variant="body2" fontWeight={600}>
            {content}
          </Typography>

          {copyToClipboard && (
            <CopyToClipboardButton
              value={copyToClipboard.value}
              tooltipTitle={copyToClipboard.tooltipTitle}
              sx={{ m: 0 }}
            />
          )}
        </Box>
      )}
    </Stack>
  )
}
