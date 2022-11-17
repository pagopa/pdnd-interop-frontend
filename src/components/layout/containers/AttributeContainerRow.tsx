import React from 'react'
import { Box, ButtonProps, IconButton, Skeleton, Stack, Tooltip, Typography } from '@mui/material'
import InfoRoundedIcon from '@mui/icons-material/InfoRounded'
import { useDialog } from '@/contexts'
import { useTranslation } from 'react-i18next'
import { AttributeQueries } from '@/api/attribute'
import { AttributeKey, AttributeKind, AttributeState } from '@/types/attribute.types'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import { ButtonNaked } from '@pagopa/mui-italia'

type AttributeContainerRowProps<T extends { id: string; name: string }> = {
  attribute: T
  showOrLabel?: boolean
  actions?: Array<
    {
      label: React.ReactNode
      action: (attributeId: string, attributeName: string) => void
    } & Partial<Omit<ButtonProps, 'onClick' | 'children' | 'action'>>
  >
} & ({ state?: undefined } | { state: AttributeState; kind: AttributeKind })

export const AttributeContainerRow = <T extends { id: string; name: string }>({
  attribute,
  showOrLabel,
  actions = [],
  ...props
}: AttributeContainerRowProps<T>) => {
  const { openDialog } = useDialog()
  const { t } = useTranslation('attribute')
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'status.attribute' })
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
      <Stack sx={{ flexShrink: 0 }} direction="row" alignItems="center" spacing={2}>
        {actions.map(({ action, label, ...buttonProps }, i) => (
          <ButtonNaked
            key={i}
            onClick={action.bind(null, attribute.id, attribute.name)}
            color="primary"
            {...buttonProps}
          >
            {label}
          </ButtonNaked>
        ))}

        {props.state === 'ACTIVE' && (
          <Tooltip title={tCommon(`${props.kind.toLowerCase() as AttributeKey}.${props.state}`)}>
            <CheckIcon color="success" fontSize="small" />
          </Tooltip>
        )}

        {props.state === 'REVOKED' && (
          <Tooltip title={tCommon(`${props.kind.toLowerCase() as AttributeKey}.${props.state}`)}>
            <CloseIcon color="error" fontSize="small" />
          </Tooltip>
        )}

        {!props.state && <CloseIcon sx={{ visibility: 'hidden' }} color="error" fontSize="small" />}

        <IconButton
          onClick={handleOpenAttributeDetailsDialog.bind(null, attribute)}
          aria-label={t('showInfoSrLabel')}
          onFocusVisible={handlePrefetchAttribute}
          onPointerEnter={handlePrefetchAttribute}
        >
          <InfoRoundedIcon fontSize="small" color="primary" />
        </IconButton>
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
