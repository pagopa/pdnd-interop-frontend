import React, { FunctionComponent } from 'react'
import { AttachFile as AttachFileIcon, Launch as LaunchIcon } from '@mui/icons-material'
import { Box, Typography } from '@mui/material'
import { ButtonNaked } from '@pagopa/mui-italia'

type Resource = {
  label: string
  onClick: VoidFunction
  type?: 'download' | 'externalLink'
}

type ResourceListProps = {
  resources: Array<Resource>
}

export const ResourceList: FunctionComponent<ResourceListProps> = ({ resources }) => {
  return (
    <React.Fragment>
      {resources.map(({ label, onClick, type = 'download' }, i) => {
        const Icon = { download: AttachFileIcon, externalLink: LaunchIcon }[type]
        return (
          <ButtonNaked key={i} sx={{ bgcolor: '#fefefe' }} onClick={onClick} color="inherit">
            <Icon fontSize="small" color="primary" />{' '}
            <Box component="span" sx={{ display: 'inline', pr: 3 }}>
              <Typography component="span">{label}</Typography>
            </Box>
          </ButtonNaked>
        )
      })}
    </React.Fragment>
  )
}
