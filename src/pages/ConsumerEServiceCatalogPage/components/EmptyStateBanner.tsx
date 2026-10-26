import React from 'react'
import EmojiObjectsOutlinedIcon from '@mui/icons-material/EmojiObjectsOutlined'
import { Card, CardActions, CardContent, CardHeader, Typography } from '@mui/material'
import { MIButton } from '@pagopa/mui-italia'

type EmptyStateBannerProps = {
  title: string
  description: string
  onGoToCatalog?: () => void
}

const EmptyStateBanner: React.FC<EmptyStateBannerProps> = ({
  title,
  description,
  onGoToCatalog,
}) => {
  return (
    <Card>
      <CardHeader
        avatar={<EmojiObjectsOutlinedIcon />}
        title={title}
        titleTypographyProps={{
          variant: 'label',
          fontWeight: 500,
        }}
        sx={{ '& .MuiCardHeader-avatar': { mr: 1, height: '24px', width: '24px' }, pb: 0 }}
      />
      <CardContent sx={{ py: 1, pr: 2, pl: 6 }}>
        <Typography variant="body2" fontSize={'0.9rem'}>
          {description}
        </Typography>
      </CardContent>
      <CardActions sx={{ py: 2, pr: 2, pl: 6 }}>
        <MIButton type="button" id={'catalog'} variant="text" onClick={onGoToCatalog}>
          {'Vai al catalogo'}
        </MIButton>
      </CardActions>
    </Card>
  )
}

export default EmptyStateBanner
