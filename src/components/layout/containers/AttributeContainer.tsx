import React from 'react'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Card,
  CardActions,
  Chip,
  IconButton,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { ButtonNaked } from '@pagopa/mui-italia'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'
import { AttributeQueries } from '@/api/attribute'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import { useTranslation } from 'react-i18next'

type AttributeContainerProps<TAttribute extends { id: string; name: string }> = {
  attribute: TAttribute
  actions?: Array<{
    label: React.ReactNode
    action: (attributeId: string, attributeName: string) => void
    color?: 'primary' | 'error'
  }>
  chipLabel?: string
  checked?: boolean
  onRemove?: (id: string, name: string) => void
}

export const AttributeContainer = <TAttribute extends { id: string; name: string }>({
  attribute,
  actions,
  chipLabel,
  checked,
  onRemove,
}: AttributeContainerProps<TAttribute>) => {
  const panelContentId = React.useId()
  const headerId = React.useId()
  const alreadyPrefetched = React.useRef(false)
  const [hasExpandedOnce, setHasExpandedOnce] = React.useState(false)

  const prefetch = AttributeQueries.usePrefetchSingle()

  const handlePrefetchAttribute = () => {
    if (alreadyPrefetched.current) return
    alreadyPrefetched.current = true
    prefetch(attribute.id)
  }

  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Stack direction="row" alignItems="center" spacing={2}>
        {checked && <CheckCircleIcon sx={{ color: 'success.main' }} />}
        {onRemove && (
          <IconButton
            onClick={onRemove.bind(null, attribute.id, attribute.name)}
            color={'error' as unknown as 'primary'}
          >
            <RemoveCircleOutlineIcon />
          </IconButton>
        )}
      </Stack>
      <Card sx={{ borderRadius: 1, border: '1px solid', borderColor: 'divider', flex: 1 }}>
        <Accordion
          disableGutters
          sx={{
            '&:before': { display: 'none' },
          }}
        >
          <AccordionSummary
            onClick={() => setHasExpandedOnce(true)}
            onPointerEnter={handlePrefetchAttribute}
            onFocusVisible={handlePrefetchAttribute}
            expandIcon={<ExpandMoreIcon />}
            aria-controls={panelContentId}
            id={headerId}
          >
            <Typography fontWeight={600}>{attribute.name}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {hasExpandedOnce && <AttributeDetails attributeId={attribute.id} />}
          </AccordionDetails>
        </Accordion>
        {(chipLabel || (actions && actions.length > 0)) && (
          <Stack
            sx={{ px: 2, pb: 2 }}
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box>{chipLabel && <Chip label={chipLabel} />}</Box>
            <CardActions disableSpacing sx={{ p: 0 }}>
              <Stack direction="row" spacing={2}>
                {actions?.map(({ action, label, color = 'primary' }, i) => (
                  <ButtonNaked
                    key={i}
                    onClick={action.bind(null, attribute.id, attribute.name)}
                    color={color}
                  >
                    {label}
                  </ButtonNaked>
                ))}
              </Stack>
            </CardActions>
          </Stack>
        )}
      </Card>
    </Stack>
  )
}

const AttributeDetails: React.FC<{ attributeId: string }> = ({ attributeId }) => {
  const { t } = useTranslation('shared-components', { keyPrefix: 'attributeContainer' })
  const { data: attribute, isInitialLoading } = AttributeQueries.useGetSingle(attributeId, {
    suspense: false,
  })

  if (isInitialLoading || !attribute) {
    return (
      <>
        <Skeleton />
        <Skeleton />
      </>
    )
  }

  return (
    <Stack sx={{ mt: 1 }} spacing={2}>
      <Typography variant="body2">{attribute.description}</Typography>
      <InformationContainer
        content={attributeId}
        copyToClipboard={{
          value: attributeId,
          tooltipTitle: t('idCopytooltipLabel'),
        }}
        label={t('attributeIdLabel')}
      />
    </Stack>
  )
}

export const AttributeContainerSkeleton: React.FC<{ checked?: boolean }> = ({ checked }) => {
  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Stack direction="row" alignItems="center" spacing={2}>
        {checked && <Skeleton variant="circular" height={23} width={23} />}
      </Stack>
      <Skeleton
        variant="rectangular"
        sx={{ borderRadius: 1, border: '1px solid', borderColor: 'divider', flex: 1 }}
        height={51}
      />
    </Stack>
  )
}
