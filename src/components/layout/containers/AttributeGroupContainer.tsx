import React from 'react'
import ClearIcon from '@mui/icons-material/Clear'
import type { CardProps, SxProps } from '@mui/material'
import { Card, CardContent, CardHeader, IconButton, alpha } from '@mui/material'
import { theme } from '@pagopa/interop-fe-commons'
import { useTranslation } from 'react-i18next'

type AttributeGroupContainerProps = CardProps & {
  title: string
  onRemove?: () => void
  subheader?: React.ReactNode
  children?: React.ReactNode
  color?: 'primary' | 'success' | 'error' | 'warning' | 'gray'
  cardContentSx?: SxProps
}

const containerColors = {
  primary: {
    textColor: 'white',
    headerColor: theme.palette.primary.dark,
    borderColor: theme.palette.primary.dark,
    bodyColor: 'white',
  },
  success: {
    textColor: theme.palette.text.primary,
    headerColor: theme.palette.success.extraLight,
    borderColor: theme.palette.success.extraLight,
    bodyColor: alpha(theme.palette.success.main, 0.08),
  },
  error: {
    textColor: theme.palette.text.primary,
    headerColor: theme.palette.error.extraLight,
    borderColor: theme.palette.error.extraLight,
    bodyColor: alpha(theme.palette.error.main, 0.08),
  },
  warning: {
    textColor: theme.palette.text.primary,
    headerColor: theme.palette.warning.extraLight,
    borderColor: theme.palette.warning.extraLight,
    bodyColor: alpha(theme.palette.warning.main, 0.08),
  },
  gray: {
    textColor: theme.palette.text.primary,
    headerColor: '#F5F5F5',
    borderColor: '#F5F5F5',
    bodyColor: 'white',
  },
}

export const AttributeGroupContainer: React.FC<AttributeGroupContainerProps> = ({
  title,
  onRemove,
  children,
  subheader,
  cardContentSx,
  color = 'primary',
  ...cardProps
}) => {
  const { t } = useTranslation('shared-components', { keyPrefix: 'attributeGroupContainer' })
  const { headerColor, borderColor, bodyColor, textColor } = containerColors[color]

  return (
    <Card
      {...cardProps}
      sx={{ border: '1px solid', borderColor, bgcolor: bodyColor, ...cardProps.sx }}
    >
      <CardHeader
        titleTypographyProps={{ variant: 'body1', fontWeight: 600, color: textColor }}
        title={title}
        action={
          onRemove && (
            <IconButton
              aria-label={t('removeGroupAriaLabel')}
              size="small"
              onClick={onRemove}
              sx={{ backgroundColor: 'transparent' }}
            >
              <ClearIcon sx={{ color: 'white' }} />
            </IconButton>
          )
        }
        sx={{ py: 1, bgcolor: headerColor }}
      />
      {subheader}
      {children && (
        <CardContent
          sx={{
            p: 2,
            '&:last-child': {
              pb: 2,
            },
            ...cardContentSx,
          }}
        >
          {children}
        </CardContent>
      )}
    </Card>
  )
}
