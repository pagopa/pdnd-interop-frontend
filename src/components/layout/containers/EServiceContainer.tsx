import React from 'react'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Card,
  IconButton,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { ButtonNaked } from '@pagopa/mui-italia'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'

import { InformationContainer } from '@pagopa/interop-fe-commons'
import { useTranslation } from 'react-i18next'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { EServiceQueries } from '@/api/eservice'
import { Link } from '@/router'

type EServiceContainerProps<TEService extends { id: string; name: string }> = {
  eservice: TEService
  onRemove?: (id: string, name: string) => void
}

export const EServiceContainer = <TEService extends { id: string; name: string }>({
  eservice,
  onRemove,
}: EServiceContainerProps<TEService>) => {
  const { t } = useTranslation('shared-components', { keyPrefix: 'eserviceContainer' })
  const panelContentId = React.useId()
  const headerId = React.useId()
  const alreadyPrefetched = React.useRef(false)
  const [hasExpandedOnce, setHasExpandedOnce] = React.useState(false)

  const queryClient = useQueryClient()

  const handlePrefetchAttribute = () => {
    if (alreadyPrefetched.current) return
    alreadyPrefetched.current = true
    queryClient.prefetchQuery(EServiceQueries.getSingle(eservice.id))
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
            onPointerEnter={handlePrefetchAttribute}
            onFocusVisible={handlePrefetchAttribute}
            expandIcon={<ExpandMoreIcon />}
            aria-controls={panelContentId}
            id={headerId}
          >
            <Typography fontWeight={600}>{eservice.name}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {hasExpandedOnce && <EServiceDetails eserviceId={eservice.id} />}
          </AccordionDetails>
        </Accordion>
      </Card>
    </Stack>
  )
}

const EServiceDetails: React.FC<{ eserviceId: string }> = ({ eserviceId }) => {
  const { t } = useTranslation('shared-components', { keyPrefix: 'eserviceContainer' })
  const { data: eservice, isLoading } = useQuery(EServiceQueries.getSingle(eserviceId))

  if (isLoading || !eservice) {
    return (
      <>
        <Skeleton />
        <Skeleton />
      </>
    )
  }

  return (
    <Stack direction="row" alignItems="flex-end" justifyContent="space-between" sx={{ mt: 1 }}>
      <Stack spacing={2}>
        <Typography variant="body2">{eservice.description}</Typography>
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
          eserviceId: eservice.id,
          descriptorId: '343c889d-6c1b-4302-bccb-a0d4e5b94932', //TODO: WHERE I GET THE DESCRIPTOR ID?
        }}
        endIcon={<OpenInNewIcon />}
        sx={{ ml: 2, fontWeight: 700, color: 'primary.main', pb: 1.5, pr: 4 }}
      >
        {t('viewEserviceBtn')}
      </ButtonNaked>
    </Stack>
  )
}

export const EServiceContainerSkeleton: React.FC<{ checked?: boolean }> = ({ checked }) => {
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
