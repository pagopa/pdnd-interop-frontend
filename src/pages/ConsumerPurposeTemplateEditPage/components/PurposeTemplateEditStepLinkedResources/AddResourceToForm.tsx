import React from 'react'
import { Box, Stack } from '@mui/material'
import { useFormContext } from 'react-hook-form'
import { match } from 'ts-pattern'
import { ResourceGroup } from './ResourceGroup'
import { PurposeTemplateMutations } from '@/api/purposeTemplate/purposeTemplate.mutations'
import type {
  LinkableResourceRequest,
  PurposeTemplateWithCompactCreator,
} from '@/api/api.generatedTypes'
import type { LinkableCandidate } from '@/utils/purposeTemplate.utils'

export type EditStepLinkedResourcesForm = {
  resources: LinkableCandidate[]
}

export type AddResourceToFormProps = {
  readOnly: boolean
  purposeTemplate: PurposeTemplateWithCompactCreator
  linkedResources: LinkableCandidate[]
  showWarning: boolean
}

function buildUnlinkBody(input: {
  resourceKind: 'ESERVICE' | 'ESERVICE_TEMPLATE'
  id: string
}): LinkableResourceRequest {
  return match(input)
    .with({ resourceKind: 'ESERVICE' }, ({ id }) => ({
      resourceKind: 'ESERVICE' as const,
      eserviceId: id,
    }))
    .with({ resourceKind: 'ESERVICE_TEMPLATE' }, ({ id }) => ({
      resourceKind: 'ESERVICE_TEMPLATE' as const,
      eserviceTemplateId: id,
    }))
    .exhaustive()
}

export const AddResourceToForm: React.FC<AddResourceToFormProps> = ({
  readOnly,
  purposeTemplate,
  linkedResources,
  showWarning,
}) => {
  const { watch } = useFormContext<EditStepLinkedResourcesForm>()
  const { mutate: unlinkResource } = PurposeTemplateMutations.useUnlinkResourceFromPurposeTemplate()

  const formResources = watch('resources') ?? []
  const mergedResources: LinkableCandidate[] = [...formResources, ...linkedResources]

  const handleRemove = (item: { resourceKind: 'ESERVICE' | 'ESERVICE_TEMPLATE'; id: string }) => {
    unlinkResource({
      purposeTemplateId: purposeTemplate.id,
      ...buildUnlinkBody(item),
    })
  }

  return (
    <Box>
      <Stack spacing={3}>
        <ResourceGroup
          group={mergedResources}
          readOnly={readOnly}
          onRemove={handleRemove}
          purposeTemplate={purposeTemplate}
          showWarning={showWarning}
        />
      </Stack>
    </Box>
  )
}
