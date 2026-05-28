import React from 'react'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  IconButton,
  Stack,
  Typography,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import { ButtonNaked } from '@pagopa/mui-italia'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import { useTranslation } from 'react-i18next'
import { match } from 'ts-pattern'
import { Link } from '@/router'
import type { LinkableCandidate } from '@/utils/purposeTemplate.utils'

type ResourceContainerProps = {
  candidate: LinkableCandidate
  onRemove?: () => void
}

export const ResourceContainer: React.FC<ResourceContainerProps> = ({ candidate, onRemove }) => {
  const { t } = useTranslation('shared-components', { keyPrefix: 'resourceContainer' })
  const { t: tPT } = useTranslation('purposeTemplate', { keyPrefix: 'edit.step2' })
  const panelContentId = React.useId()
  const headerId = React.useId()

  const name = candidate.value.name

  const publisher = match(candidate)
    .with({ resourceKind: 'ESERVICE' }, (c) => c.value.producer.name)
    .with({ resourceKind: 'ESERVICE_TEMPLATE' }, (c) => c.value.creator.name)
    .exhaustive()
  const optionLabelKey =
    candidate.resourceKind === 'ESERVICE' ? 'options.eservice' : 'options.eserviceTemplate'
  const displayLabel = tPT(optionLabelKey, { name, publisher })

  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      {onRemove && (
        <IconButton aria-label={t('removeAriaLabel', { name })} onClick={onRemove}>
          <RemoveCircleOutlineIcon color="error" />
        </IconButton>
      )}
      <Box
        component="fieldset"
        sx={{
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
          m: 0,
          px: 1,
          pt: 0,
          pb: 0,
          flex: 1,
          minWidth: 0,
        }}
      >
        <Box
          component="legend"
          sx={{
            px: 0.5,
            ml: 0.5,
            fontSize: 12,
            color: 'text.secondary',
            lineHeight: 1,
          }}
        >
          {tPT('autocompleteInput.label')}
        </Box>
        <Accordion
          disableGutters
          sx={{
            '&:before': { display: 'none' },
            backgroundColor: 'transparent',
            boxShadow: 'none',
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={panelContentId}
            id={headerId}
          >
            <Typography fontWeight={600}>{displayLabel}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <ResourceDetails candidate={candidate} />
          </AccordionDetails>
        </Accordion>
      </Box>
    </Stack>
  )
}

const ResourceDetails: React.FC<{ candidate: LinkableCandidate }> = ({ candidate }) => {
  const { t } = useTranslation('shared-components', { keyPrefix: 'resourceContainer' })

  return match(candidate)
    .with({ resourceKind: 'ESERVICE' }, ({ value }) => (
      <Stack direction="row" alignItems="flex-end" justifyContent="space-between" sx={{ mt: 1 }}>
        <Stack spacing={2}>
          <Typography variant="body2">{value.description}</Typography>
          <InformationContainer
            direction="column"
            content={value.id}
            copyToClipboard={{ value: value.id, tooltipTitle: t('idCopyTooltipLabel') }}
            label={t('eservice.idField')}
          />
        </Stack>
        {value.activeDescriptor && (
          <ButtonNaked
            component={Link}
            to="SUBSCRIBE_CATALOG_VIEW"
            target="_blank"
            params={{ eserviceId: value.id, descriptorId: value.activeDescriptor.id }}
            endIcon={<OpenInNewIcon />}
            sx={{ ml: 2, fontWeight: 700, color: 'primary.main', pb: 1.5, pr: 4 }}
          >
            {t('eservice.viewBtn')}
          </ButtonNaked>
        )}
      </Stack>
    ))
    .with({ resourceKind: 'ESERVICE_TEMPLATE' }, ({ value }) => (
      <Stack direction="row" alignItems="flex-end" justifyContent="space-between" sx={{ mt: 1 }}>
        <Stack spacing={2}>
          <Typography variant="body2">{value.description}</Typography>
          <InformationContainer
            direction="column"
            content={value.id}
            copyToClipboard={{ value: value.id, tooltipTitle: t('idCopyTooltipLabel') }}
            label={t('eserviceTemplate.idField')}
          />
        </Stack>
        <ButtonNaked
          component={Link}
          to="SUBSCRIBE_ESERVICE_TEMPLATE_DETAILS"
          target="_blank"
          params={{
            eServiceTemplateId: value.id,
            eServiceTemplateVersionId: value.publishedVersion.id,
          }}
          endIcon={<OpenInNewIcon />}
          sx={{ ml: 2, fontWeight: 700, color: 'primary.main', pb: 1.5, pr: 4 }}
        >
          {t('eserviceTemplate.viewBtn')}
        </ButtonNaked>
      </Stack>
    ))
    .exhaustive()
}
