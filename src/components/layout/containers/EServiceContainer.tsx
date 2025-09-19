import React from 'react'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Card,
  IconButton,
  Stack,
  Typography,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { ButtonNaked } from '@pagopa/mui-italia'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'

import { InformationContainer } from '@pagopa/interop-fe-commons'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from '@tanstack/react-query'
import { EServiceQueries } from '@/api/eservice'
import { Link } from '@/router'
import type { CatalogEService } from '@/api/api.generatedTypes'

type EServiceContainerProps = {
  eservice: CatalogEService
  onRemove?: (id: string, name: string) => void
}

export const EServiceContainer = ({ eservice, onRemove }: EServiceContainerProps) => {
  const { t } = useTranslation('shared-components', { keyPrefix: 'eserviceContainer' })
  const panelContentId = React.useId()
  const headerId = React.useId()
  const alreadyPrefetched = React.useRef(false)
  const [hasExpandedOnce, setHasExpandedOnce] = React.useState(false)

  const queryClient = useQueryClient()

  const handlePrefetchEService = () => {
    if (alreadyPrefetched.current) return
    alreadyPrefetched.current = true
    queryClient.prefetchQuery(
      EServiceQueries.getDescriptorCatalog(eservice.id, eservice.activeDescriptor?.id as string)
    )
  }

  return (
    <Stack direction="row" alignItems="center">
      <Stack direction="row" alignItems="center" spacing={2}>
        {onRemove && (
          <IconButton
            aria-label={t('removeAttributeAriaLabel', { eserviceName: eservice.name })}
            onClick={onRemove.bind(null, eservice.id, eservice.name)}
            //color={'error' as unknown as 'primary'} //TODO COLOR
          >
            <RemoveCircleOutlineIcon sx={{ color: '#D85757' }} />
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
          >
            <Typography fontWeight={600}>{eservice.name}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {hasExpandedOnce && (
              <EServiceDetails
                eserviceId={eservice.id}
                eserviceDescription={eservice.description}
                descriptorId={eservice.activeDescriptor?.id as string}
              />
            )}
          </AccordionDetails>
        </Accordion>
      </Card>
    </Stack>
  )
}

const EServiceDetails: React.FC<{
  eserviceId: string
  eserviceDescription: string
  descriptorId: string
}> = ({ eserviceId, eserviceDescription, descriptorId }) => {
  const { t } = useTranslation('shared-components', { keyPrefix: 'eserviceContainer' })

  return (
    <Stack direction="row" alignItems="flex-end" justifyContent="space-between" sx={{ mt: 1 }}>
      <Stack spacing={2}>
        <Typography variant="body2">{eserviceDescription}</Typography>
        <InformationContainer
          direction="column"
          content={eserviceId}
          copyToClipboard={{
            value: eserviceId,
            tooltipTitle: t('idCopytooltipLabel'),
          }}
          label={t('eserviceIdField')}
        />
      </Stack>
      <ButtonNaked
        component={Link}
        to="SUBSCRIBE_CATALOG_VIEW"
        target="_blank"
        params={{
          eserviceId: eserviceId,
          descriptorId: descriptorId,
        }}
        endIcon={<OpenInNewIcon />}
        sx={{ ml: 2, fontWeight: 700, color: 'primary.main', pb: 1.5, pr: 4 }}
      >
        {t('viewEserviceBtn')}
      </ButtonNaked>
    </Stack>
  )
}
