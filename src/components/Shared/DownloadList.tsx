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
    <Grid container columnSpacing={2}>
      {downloads.map((d, i) => {
        return (
          <Grid item xs={6} key={i}>
            <StyledButton
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                textAlign: 'left',
                px: 1,
                py: 1,
                width: '100%',
              }}
              onClick={d.onClick}
              color="inherit"
            >
              <Box sx={{ display: 'inline-block', pr: 3 }}>
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
