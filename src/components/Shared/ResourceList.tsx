import React, { FunctionComponent } from 'react'
import { Box } from '@mui/system'
import { StyledButton } from './StyledButton'
import {
  FileDownloadOutlined as FileDownloadOutlinedIcon,
  Launch as LaunchIcon,
} from '@mui/icons-material'
import { Grid, Typography } from '@mui/material'

type Resource = {
  label: string
  description?: string
  onClick: VoidFunction
  type?: 'download' | 'externalLink'
}

type ResourceListProps = {
  resources: Array<Resource>
}

export const ResourceList: FunctionComponent<ResourceListProps> = ({ resources }) => {
  return (
    <Grid container columnSpacing={1} rowSpacing={1} alignItems="stretch">
      {resources.map(({ label, description, onClick, type = 'download' }, i) => {
        const Icon = {
          download: FileDownloadOutlinedIcon,
          externalLink: LaunchIcon,
        }[type]

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
              onClick={onClick}
              color="inherit"
            >
              <Box component="span" sx={{ display: 'inline', pr: 3 }}>
                <Typography sx={{ fontWeight: 600 }} component="span">
                  {label}
                </Typography>
                {description && (
                  <React.Fragment>
                    <br />
                    <Typography component="span">{description}</Typography>
                  </React.Fragment>
                )}
              </Box>
              <Icon fontSize="medium" color="primary" />
            </StyledButton>
          </Grid>
        )
      })}
    </Grid>
  )
}
