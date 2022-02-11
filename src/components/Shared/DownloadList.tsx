import React, { FunctionComponent } from 'react'
import { Box } from '@mui/system'
import { StyledButton } from './StyledButton'
import { FileDownloadOutlined as FileDownloadOutlinedIcon } from '@mui/icons-material'

type Download = {
  label: string
  onClick: VoidFunction
}

type DownloadListProps = {
  downloads: Array<Download>
}

export const DownloadList: FunctionComponent<DownloadListProps> = ({ downloads }) => {
  return (
    <Box sx={{ py: 1, borderTop: 1, borderColor: 'divider', color: 'text.secondary' }}>
      {downloads.map((d, i) => {
        return (
          <StyledButton key={i} onClick={d.onClick} color="inherit">
            <FileDownloadOutlinedIcon fontSize="small" sx={{ mr: 1 }} color="inherit" /> {d.label}
          </StyledButton>
        )
      })}
    </Box>
  )
}
