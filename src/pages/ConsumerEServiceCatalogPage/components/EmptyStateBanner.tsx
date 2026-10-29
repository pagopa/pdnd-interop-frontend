import React from 'react'
import EmojiObjectsOutlinedIcon from '@mui/icons-material/EmojiObjectsOutlined'
import { Card, CardActions, CardContent, CardHeader, Typography } from '@mui/material'
import { MIButton } from '@pagopa/mui-italia'
import { useTranslation } from 'react-i18next'

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
  const { t } = useTranslation('eservice', { keyPrefix: 'featuredList' })
  return (
    <Card sx={{ padding: 2 }}>
      <CardHeader
        avatar={<EmojiObjectsOutlinedIcon />}
        title={title}
        titleTypographyProps={{
          variant: 'label',
          fontWeight: 500,
        }}
        sx={{ '& .MuiCardHeader-avatar': { mr: 1, height: '24px', width: '24px' }, p: 0 }}
      />
      <CardContent sx={{ mt: 0.5, ml: 4, mb: 0, p: 0, '&:last-child': { pb: 0 } }}>
        <Typography variant="body2" fontSize={'0.9rem'}>
          {description}
        </Typography>
      </CardContent>
      {onGoToCatalog && (
        <CardActions sx={{ mt: 2, ml: 4, p: 0 }}>
          <MIButton type="button" id={'catalog'} variant="text" onClick={onGoToCatalog}>
            {t('emptyStateBanner.eservices.goToCatalogButtonLabel')}
          </MIButton>
        </CardActions>
      )}
    </Card>
  )
}

export default EmptyStateBanner
