import React from 'react'
import { Box, Stack } from '@mui/material'
import { useTranslation } from 'react-i18next'
import AddIcon from '@mui/icons-material/Add'
import { ButtonNaked } from '@pagopa/mui-italia'
import { useFormContext } from 'react-hook-form'
import { EServiceAutocomplete } from '@/components/shared/EServiceAutoComplete'
import { EServiceContainer } from '@/components/layout/containers/EServiceContainer'
import type { EditStepLinkedEServicesForm } from './PurposeTemplateEditLinkedEService'
import type { PurposeTemplate } from '@/api/purposeTemplate/mockedResponses'
import { PurposeTemplateMutations } from '@/api/purposeTemplate/purposeTemplate.mutations'
import type { CatalogEService } from '@/api/api.generatedTypes'
import type { EServiceWithDescriptor } from '@/types/eservice.types'

export type EServiceGroupProps = {
  group: Array<EServiceWithDescriptor>
  readOnly: boolean
  onRemoveEServiceFromGroup: (eserviceId: string) => void
  purposeTemplate: PurposeTemplate
  showWarning: boolean
}

export const EServiceGroup: React.FC<EServiceGroupProps> = ({
  group,
  readOnly,
  onRemoveEServiceFromGroup,
  purposeTemplate,
  showWarning,
}) => {
  const { t } = useTranslation('purposeTemplate', { keyPrefix: 'edit.step2' })
  const [isEServiceAutocompleteShown, setIsEServiceAutocompleteShown] = React.useState(true)
  const { mutate: addEService } = PurposeTemplateMutations.useAddEserviceToPurposeTemplate()

  const handleDeleteEServiceFromGroup = (eserviceId: string) => {
    onRemoveEServiceFromGroup(eserviceId)
  }

  const { watch, setValue } = useFormContext<EditStepLinkedEServicesForm>()
  const eserviceGroup = watch('eservices')

  const handleAddEServiceToGroup = (eservice: CatalogEService) => {
    addEService({ purposeTemplateId: purposeTemplate.id, eserviceId: eservice.id })

    // Convert CatalogEService to EServiceWithDescriptor
    const eserviceWithDescriptor: EServiceWithDescriptor = {
      eservice: {
        id: eservice.id,
        name: eservice.name,
        producer: eservice.producer,
      },
      descriptor: eservice.activeDescriptor!,
    }

    const newEServiceGroup = [...eserviceGroup] //TODO: SHOULD IT BE REMOVED WHEN THE API IS AVAILABLE?
    newEServiceGroup.push(eserviceWithDescriptor)
    setValue('eservices', newEServiceGroup)
    setIsEServiceAutocompleteShown(false)
  }

  return (
    <>
      {group.length > 0 && (
        <Stack sx={{ listStyleType: 'none', pl: 0, mt: 1, mb: 4 }} component="ul" spacing={1.2}>
          {group.map((eserviceWithDescriptor) => (
            <Box component="li" key={eserviceWithDescriptor.eservice.id}>
              <EServiceContainer
                eservice={eserviceWithDescriptor}
                showWarning={showWarning}
                onRemove={
                  !readOnly
                    ? handleDeleteEServiceFromGroup.bind(null, eserviceWithDescriptor.eservice.id)
                    : undefined
                }
              />
            </Box>
          ))}
        </Stack>
      )}
      {!readOnly && (
        <>
          {isEServiceAutocompleteShown ? (
            <EServiceAutocomplete
              onAddEService={handleAddEServiceToGroup}
              alreadySelectedEServiceIds={group.map((e) => e.eservice.id)} //TODO
            />
          ) : (
            <ButtonNaked
              color="primary"
              type="button"
              sx={{ fontWeight: 700, alignSelf: 'flex-start' }}
              readOnly={readOnly}
              startIcon={<AddIcon fontSize="small" />}
              onClick={() => setIsEServiceAutocompleteShown(true)}
            >
              {t('addBtn')}
            </ButtonNaked>
          )}
        </>
      )}
    </>
  )
}
