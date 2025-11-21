import React from 'react'
import { useFormContext } from 'react-hook-form'
import { Box, Stack } from '@mui/material'
import { EServiceGroup } from './EServiceGroup'
import type { EditStepLinkedEServicesForm } from './PurposeTemplateEditLinkedEService'
import { PurposeTemplateMutations } from '@/api/purposeTemplate/purposeTemplate.mutations'
import type {
  PurposeTemplateWithCompactCreator,
  CompactPurposeTemplateEService,
  CompactDescriptor,
  CatalogEService,
} from '@/api/api.generatedTypes'

export type LinkedEServiceWithDescriptor = {
  eservice: CompactPurposeTemplateEService
  descriptor: CompactDescriptor
}

export type AddEServiceToFormProps = {
  readOnly: boolean
  purposeTemplate: PurposeTemplateWithCompactCreator
  linkedEServices: LinkedEServiceWithDescriptor[]
  showWarning: boolean
}

export const AddEServiceToForm: React.FC<AddEServiceToFormProps> = ({
  readOnly,
  purposeTemplate,
  linkedEServices,
  showWarning,
}) => {
  const { watch } = useFormContext<EditStepLinkedEServicesForm>()
  const { mutate: removeEService } = PurposeTemplateMutations.useUnlinkEserviceFromPurposeTemplate()

  const eserviceGroup = watch(`eservices`)

  // Merge form EServices with linked EServices and their descriptors
  const mergedEServices: CatalogEService[] = [
    ...eserviceGroup,
    ...linkedEServices.map((linkedItem) => ({
      id: linkedItem.eservice.id,
      name: linkedItem.eservice.name,
      description: linkedItem.eservice.description || '',
      producer: linkedItem.eservice.producer,
      activeDescriptor: linkedItem.descriptor,
      isMine: false,
    })),
  ]

  const handleRemoveAttributeFromGroup = (eserviceId: string) => {
    removeEService({
      purposeTemplateId: purposeTemplate.id,
      eserviceId,
    })
  }

  return (
    <Box>
      <Stack spacing={3}>
        <EServiceGroup
          key={0}
          group={mergedEServices}
          readOnly={readOnly}
          onRemoveEServiceFromGroup={handleRemoveAttributeFromGroup}
          purposeTemplate={purposeTemplate}
          showWarning={showWarning}
        />
      </Stack>
    </Box>
  )
}
