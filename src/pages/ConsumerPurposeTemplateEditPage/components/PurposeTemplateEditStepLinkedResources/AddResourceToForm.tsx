import React from 'react'
import { Box, Stack } from '@mui/material'
import { useFormContext } from 'react-hook-form'
import { ResourceGroup } from './ResourceGroup'
import { PurposeTemplateMutations } from '@/api/purposeTemplate/purposeTemplate.mutations'
import type { PurposeTemplateWithCompactCreator } from '@/api/api.generatedTypes'
import {
  toLinkableResourceRequest,
  type LinkableCandidate,
} from '@/utils/purposeTemplate.utils'

export type EditStepLinkedResourcesForm = {
  resources: LinkableCandidate[]
}

export type AddResourceToFormProps = {
  readOnly: boolean
  purposeTemplate: PurposeTemplateWithCompactCreator
  linkedResources: LinkableCandidate[]
  showWarning: boolean
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
      ...toLinkableResourceRequest(item),
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
