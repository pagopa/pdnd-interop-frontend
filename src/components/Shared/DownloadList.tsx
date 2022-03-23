import React, { FunctionComponent } from 'react'
import { Box } from '@mui/system'
import { StyledButton } from './StyledButton'
import { FileDownloadOutlined as FileDownloadOutlinedIcon } from '@mui/icons-material'
import { Grid, Typography } from '@mui/material'

type Download = {
  label: string
  description?: string
  onClick: VoidFunction
}

type DownloadListProps = {
  downloads: Array<Download>
}

export const DownloadList: FunctionComponent<DownloadListProps> = ({ downloads }) => {
  return (
    <Grid container columnSpacing={1} rowSpacing={1} alignItems="stretch">
      {downloads.map((d, i) => {
        return (
          <Grid item xs={6} key={i}>
            <StyledButton
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                textAlign: 'left',
                p: 2,
                width: '100%',
                height: '100%',
                bgcolor: 'background.paper',
              }}
              onClick={d.onClick}
              color="inherit"
            >
              <Box component="span" sx={{ display: 'inline', pr: 3 }}>
                <Typography sx={{ fontWeight: 600 }} component="span">
                  {d.label}
                </Typography>
                {d.description && (
                  <React.Fragment>
                    <br />
                    <Typography component="span">{d.description}</Typography>
                  </React.Fragment>
                )}
              </Box>
              <FileDownloadOutlinedIcon fontSize="medium" color="primary" />
            </StyledButton>
          </Grid>
        )
      })}
    </Grid>
  )
}
