import React from 'react'
import { Box, ButtonProps, Skeleton, Stack, Typography } from '@mui/material'
import { ButtonNaked } from '@pagopa/mui-italia'
import InfoRoundedIcon from '@mui/icons-material/InfoRounded'
import { useDialog } from '@/contexts'
import { useTranslation } from 'react-i18next'
import { AttributeQueries } from '@/api/attribute'

export const AttributeContainerRow = <T extends { id: string; name: string }>({
  attribute,
  showOrLabel,
  buttons = [],
}: {
  attribute: T
  showOrLabel?: boolean
  buttons?: Array<
    {
      label: React.ReactNode | string
      action: (attributeId: string, attributeName: string) => void
    } & Partial<Omit<ButtonProps, 'onClick' | 'children' | 'action'>>
  >
}) => {
  const { openDialog } = useDialog()
  const { t } = useTranslation('attribute')
  const prefetch = AttributeQueries.usePrefetchSingle()

  const handleOpenAttributeDetailsDialog = (attribute: T) => {
    openDialog({ type: 'showAttributeDetails', attribute })
  }

  const handlePrefetchAttribute = () => {
    prefetch(attribute.id)
  }

  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Typography sx={{ flex: 1 }} variant="body2">
        {attribute.name}
      </Typography>
      <Stack sx={{ flexShrink: 0 }} direction="row" spacing={2}>
        {buttons.map(({ action, label, ...buttonProps }, i) => (
          <ButtonNaked
            key={i}
            onClick={action.bind(null, attribute.id, attribute.name)}
            color="primary"
            {...buttonProps}
          >
            {label}
          </ButtonNaked>
        ))}

        <ButtonNaked
          onClick={handleOpenAttributeDetailsDialog.bind(null, attribute)}
          aria-label={t('showInfoSrLabel')}
          onFocusVisible={handlePrefetchAttribute}
        >
          <span onPointerEnter={handlePrefetchAttribute}>
            <InfoRoundedIcon fontSize="small" color="primary" />
          </span>
        </ButtonNaked>
      </Stack>
      <Typography
        component="span"
        sx={{
          flexShrink: 0,
          visibility: showOrLabel ? 'visible' : 'hidden',
        }}
        width={50}
        variant="body2"
        fontStyle="italic"
      >
        {t('or')}
      </Typography>
    </Stack>
  )
}

export const AttributeContainerRowSkeleton: React.FC<{ showOrLabel?: boolean }> = ({
  showOrLabel,
}) => {
  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Box sx={{ flex: 1 }}>
        <Box sx={{ width: '50%' }}>
          <Skeleton />
        </Box>
      </Box>
      <Stack sx={{ flexShrink: 0, pr: 8 }} direction="row" spacing={2}>
        <Skeleton variant="circular" width={19} height={19} />
      </Stack>
      <Skeleton
        sx={{
          flexShrink: 0,
          visibility: showOrLabel ? 'visible' : 'hidden',
        }}
        width={52}
      />
    </Stack>
  )
}
