import React from 'react'
import { Alert, Box, IconButton, Stack, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'
import AddIcon from '@mui/icons-material/Add'
import { ButtonNaked } from '@pagopa/mui-italia'
import { match } from 'ts-pattern'
import { ResourceAutoComplete } from '@/components/shared/ResourceAutoComplete'
import { PurposeTemplateMutations } from '@/api/purposeTemplate/purposeTemplate.mutations'
import type {
  LinkableResourceRequest,
  PurposeTemplateWithCompactCreator,
} from '@/api/api.generatedTypes'
import type { LinkableCandidate } from '@/utils/purposeTemplate.utils'

export type ResourceGroupProps = {
  group: LinkableCandidate[]
  readOnly: boolean
  onRemove: (r: { resourceKind: 'ESERVICE' | 'ESERVICE_TEMPLATE'; id: string }) => void
  purposeTemplate: PurposeTemplateWithCompactCreator
  showWarning: boolean
}

function isCandidateInvalid(candidate: LinkableCandidate): boolean {
  return match(candidate)
    .with({ resourceKind: 'ESERVICE' }, (c) => {
      const state = c.value.activeDescriptor?.state
      return state === 'SUSPENDED' || state === 'ARCHIVED'
    })
    .with({ resourceKind: 'ESERVICE_TEMPLATE' }, (c) => {
      const state = c.value.publishedVersion?.state
      return state === 'SUSPENDED' || state === 'DEPRECATED'
    })
    .exhaustive()
}

function buildLinkPayload(candidate: LinkableCandidate): LinkableResourceRequest {
  return match(candidate)
    .with({ resourceKind: 'ESERVICE' }, (c) => ({
      resourceKind: 'ESERVICE' as const,
      eserviceId: c.value.id,
    }))
    .with({ resourceKind: 'ESERVICE_TEMPLATE' }, (c) => ({
      resourceKind: 'ESERVICE_TEMPLATE' as const,
      eserviceTemplateId: c.value.id,
    }))
    .exhaustive()
}

export const ResourceGroup: React.FC<ResourceGroupProps> = ({
  group,
  readOnly,
  onRemove,
  purposeTemplate,
  showWarning,
}) => {
  const { t } = useTranslation('purposeTemplate', { keyPrefix: 'edit.step2' })
  const [isAutocompleteShown, setIsAutocompleteShown] = React.useState(true)
  const { mutate: linkResource } = PurposeTemplateMutations.useLinkResourceToPurposeTemplate()

  const handleAddResource = (candidate: LinkableCandidate) => {
    const payload = {
      purposeTemplateId: purposeTemplate.id,
      ...buildLinkPayload(candidate),
    }
    linkResource(payload, {
      onSuccess: () => setIsAutocompleteShown(false),
    })
  }

  const alreadySelectedResourceIds = group.map((c) => ({
    resourceKind: c.resourceKind,
    id: c.value.id,
  }))

  return (
    <>
      {group.length > 0 && (
        <Stack component="ul" spacing={1.2} sx={{ listStyleType: 'none', pl: 0, mt: 1, mb: 4 }}>
          {group.map((candidate) => {
            const invalid = isCandidateInvalid(candidate)
            return (
              <Box component="li" key={`${candidate.resourceKind}:${candidate.value.id}`}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  {!readOnly && (
                    <IconButton
                      aria-label={t('removeResourceAriaLabel', { name: candidate.value.name })}
                      onClick={() =>
                        onRemove({
                          resourceKind: candidate.resourceKind,
                          id: candidate.value.id,
                        })
                      }
                    >
                      <RemoveCircleOutlineIcon color="error" />
                    </IconButton>
                  )}
                  <Typography fontWeight={600}>{candidate.value.name}</Typography>
                </Stack>
                {showWarning && invalid && (
                  <Alert severity="warning" sx={{ mt: 1 }}>
                    {t('warning.invalidResource')}
                  </Alert>
                )}
              </Box>
            )
          })}
        </Stack>
      )}
      {!readOnly && isAutocompleteShown && (
        <ResourceAutoComplete
          onAddResource={handleAddResource}
          alreadySelectedResourceIds={alreadySelectedResourceIds}
          purposeTemplate={purposeTemplate}
        />
      )}
      {!readOnly && !isAutocompleteShown && (
        <ButtonNaked
          color="primary"
          type="button"
          sx={{ fontWeight: 700, alignSelf: 'flex-start' }}
          startIcon={<AddIcon fontSize="small" />}
          onClick={() => setIsAutocompleteShown(true)}
        >
          {t('addBtn')}
        </ButtonNaked>
      )}
    </>
  )
}
