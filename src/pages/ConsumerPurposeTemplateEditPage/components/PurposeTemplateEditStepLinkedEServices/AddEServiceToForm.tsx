import React from 'react'
import { useFormContext } from 'react-hook-form'
import { Box, Stack } from '@mui/material'
import { EServiceGroup } from './EServiceGroup'
import type { EditStepLinkedEServicesForm } from './PurposeTemplateEditLinkedEService'
import { PurposeTemplateMutations } from '@/api/purposeTemplate/purposeTemplate.mutations'
import type { CatalogEService, PurposeTemplateWithCompactCreator } from '@/api/api.generatedTypes'

export type AddEServiceToFormProps = {
  readOnly: boolean
  purposeTemplate: PurposeTemplateWithCompactCreator
  linkedEServices: CatalogEService[]
  showWarning: boolean
}

export const AddEServiceToForm: React.FC<AddEServiceToFormProps> = ({
  readOnly,
  purposeTemplate,
  linkedEServices,
  showWarning,
}) => {
  const { watch, setValue } = useFormContext<EditStepLinkedEServicesForm>()
  const { mutate: removeEService } = PurposeTemplateMutations.useUnlinkEserviceFromPurposeTemplate()

  const eserviceGroup = watch(`eservices`)

  const mergedEServices = [...eserviceGroup, ...linkedEServices]

  const handleRemoveAttributeFromGroup = (eserviceId: string) => {
    const newEServicesGroup = eserviceGroup.filter((eservice) => eservice.id !== eserviceId) //TODO: SHOULD IT BE REMOVED WHEN THE API IS AVAILABLE?
    setValue(`eservices`, newEServicesGroup, {
      shouldValidate: false,
    })
    removeEService({ purposeTemplateId: purposeTemplate.id, eserviceId })
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
