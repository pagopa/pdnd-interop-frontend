import React from 'react'
import { useFormContext } from 'react-hook-form'
import { Box, Stack } from '@mui/material'
import { EServiceGroup } from './EServiceGroup'
import type { EditStepLinkedEServicesForm } from './PurposeTemplateEditLinkedEService'

export type AddEServiceToFormProps = {
  readOnly: boolean
}

export const AddEServiceToForm: React.FC<AddEServiceToFormProps> = ({ readOnly }) => {
  const { watch, setValue } = useFormContext<EditStepLinkedEServicesForm>()

  const eserviceGroup = watch(`eservices`)

  const handleRemoveAttributeFromGroup = (eserviceId: string) => {
    const newEServicesGroup = eserviceGroup.filter((eservice) => eservice.id !== eserviceId)
    setValue(`eservices`, newEServicesGroup, {
      shouldValidate: false,
    })

    //TODO IS THERE A API CALL FOR DELETING AN ESERVICE FROM A PURPOSE TEMPLATE?
  }

  return (
    <Box>
      <Stack spacing={3}>
        <EServiceGroup
          key={0}
          group={eserviceGroup}
          readOnly={readOnly}
          onRemoveEServiceFromGroup={handleRemoveAttributeFromGroup}
        />
      </Stack>
    </Box>
  )
}
