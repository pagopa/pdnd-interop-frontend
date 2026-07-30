import React from 'react'
import { Box, Stack } from '@mui/material'
import { ResourceGroup } from './ResourceGroup'
import { PurposeTemplateMutations } from '@/api/purposeTemplate/purposeTemplate.mutations'
import type { PurposeTemplateWithCompactCreator } from '@/api/api.generatedTypes'
import { toLinkableResourceRequest, type LinkableCandidate } from '@/utils/purposeTemplate.utils'

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
  const { mutate: unlinkResource } = PurposeTemplateMutations.useUnlinkResourceFromPurposeTemplate()

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
          group={linkedResources}
          readOnly={readOnly}
          onRemove={handleRemove}
          purposeTemplate={purposeTemplate}
          showWarning={showWarning}
        />
      </Stack>
    </Box>
  )
}
