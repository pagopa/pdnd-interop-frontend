import React from 'react'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Card,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { ButtonNaked } from '@pagopa/mui-italia'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import type { EServiceWithDescriptor } from '@/types/eservice.types'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from '@tanstack/react-query'
import { EServiceQueries } from '@/api/eservice'
import { Link } from '@/router'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'

type EServiceContainerProps = {
  eserviceWithDescriptor: EServiceWithDescriptor
  showWarning: boolean
  onRemove?: (id: string, name: string) => void
}

export const EServiceContainer = ({
  eserviceWithDescriptor,
  showWarning,
  onRemove,
}: EServiceContainerProps) => {
  const { t } = useTranslation('shared-components', { keyPrefix: 'eserviceContainer' })
  const panelContentId = React.useId()
  const headerId = React.useId()
  const alreadyPrefetched = React.useRef(false)
  const [hasExpandedOnce, setHasExpandedOnce] = React.useState(false)

  const queryClient = useQueryClient()

  const isEServiceStateValid = eserviceWithDescriptor.descriptor.state === 'PUBLISHED'

  const handlePrefetchEService = () => {
    if (alreadyPrefetched.current) return
    alreadyPrefetched.current = true
    queryClient.prefetchQuery(
      EServiceQueries.getDescriptorCatalog(
        eserviceWithDescriptor.eservice.id,
        eserviceWithDescriptor.descriptor.id
      )
    )
  }

  return (
    <>
      <Stack direction="row" alignItems="center">
        <Stack direction="row" alignItems="center" spacing={2}>
          {onRemove && (
            <IconButton
              aria-label={t('removeAttributeAriaLabel', {
                eserviceName: eserviceWithDescriptor.eservice.name,
              })}
              onClick={onRemove.bind(
                null,
                eserviceWithDescriptor.eservice.id,
                eserviceWithDescriptor.eservice.name
              )}
            >
              <RemoveCircleOutlineIcon color="error" />
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
              onPointerEnter={handlePrefetchEService}
              onFocusVisible={handlePrefetchEService}
              expandIcon={<ExpandMoreIcon />}
              aria-controls={panelContentId}
              id={headerId}
              disabled={!isEServiceStateValid}
            >
              <Typography fontWeight={600}>{eserviceWithDescriptor.eservice.name}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {hasExpandedOnce && (
                <EServiceDetails
                  eserviceId={eserviceWithDescriptor.eservice.id}
                  eserviceDescription={eserviceWithDescriptor.eservice.description ?? ''}
                  descriptorId={eserviceWithDescriptor.descriptor.id}
                />
              )}
            </AccordionDetails>
          </Accordion>
        </Card>
        {(eserviceWithDescriptor.descriptor.state === 'ARCHIVED' && (
          <Tooltip title={t('tooltipTitle.ARCHIVED')}>
            <ErrorOutlineIcon color="error" />
          </Tooltip>
        )) ||
          (eserviceWithDescriptor.descriptor.state === 'SUSPENDED' && (
            <Tooltip title={t(`tooltipTitle.${eserviceWithDescriptor.descriptor.state}`)}>
              <ErrorOutlineIcon color="error" />
            </Tooltip>
          ))}
      </Stack>
      {showWarning && (
        <Typography variant="body2" color="error" sx={{ ml: 7, fontWeight: 600 }}>
          {eserviceWithDescriptor.descriptor.state === 'ARCHIVED'
            ? t('warning.ARCHIVED')
            : eserviceWithDescriptor.descriptor.state === 'SUSPENDED' && t('warning.SUSPENDED')}
        </Typography>
      )}
    </>
  )
}

const EServiceDetails: React.FC<{
  eserviceId: string
  eserviceDescription: string
  descriptorId: string
}> = ({ eserviceId, eserviceDescription, descriptorId }) => {
  const { t } = useTranslation('shared-components', { keyPrefix: 'eserviceContainer' })

  return (
    <Stack spacing={2} sx={{ mt: 1, pr: 4 }}>
      <Typography variant="body2">{eserviceDescription}</Typography>
      <Stack direction="row" alignItems="flex-end" justifyContent="space-between">
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <InformationContainer
            direction="row"
            content={eserviceId}
            copyToClipboard={{
              value: eserviceId,
              tooltipTitle: t('idCopytooltipLabel'),
            }}
            label={t('eserviceIdField')}
          />
        </Box>
        <ButtonNaked
          component={Link}
          to="SUBSCRIBE_CATALOG_VIEW"
          target="_blank"
          params={{
            eserviceId: eserviceId,
            descriptorId: descriptorId,
          }}
          endIcon={<OpenInNewIcon />}
          sx={{ fontWeight: 700, color: 'primary.main' }}
        >
          {t('viewEserviceBtn')}
        </ButtonNaked>
      </Stack>
    </Stack>
  )
}
