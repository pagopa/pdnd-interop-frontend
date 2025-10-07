import React from 'react'
import { Box, Stack } from '@mui/material'
import { useTranslation } from 'react-i18next'
import AddIcon from '@mui/icons-material/Add'
import { ButtonNaked } from '@pagopa/mui-italia'
import type { CatalogEService, PurposeTemplateWithCompactCreator } from '@/api/api.generatedTypes'
import { useFormContext } from 'react-hook-form'
import { EServiceAutocomplete } from '@/components/shared/EServiceAutoComplete'
import { EServiceContainer } from '@/components/layout/containers/EServiceContainer'
import type { EditStepLinkedEServicesForm } from './PurposeTemplateEditLinkedEService'
import { PurposeTemplateMutations } from '@/api/purposeTemplate/purposeTemplate.mutations'

export type EServiceGroupProps = {
  group: Array<CatalogEService>
  readOnly: boolean
  onRemoveEServiceFromGroup: (eserviceId: string) => void
  purposeTemplate: PurposeTemplateWithCompactCreator
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
  const { mutate: addEService } = PurposeTemplateMutations.useLinkEserviceToPurposeTemplate()

  const handleDeleteEServiceFromGroup = (eserviceId: string) => {
    onRemoveEServiceFromGroup(eserviceId)
  }

  const { watch, setValue } = useFormContext<EditStepLinkedEServicesForm>()
  const eserviceGroup = watch('eservices')

  const handleAddEServiceToGroup = (eservice: CatalogEService) => {
    // todo: Call API with hardcoded E-Service ID when selecting an E-Service - remove hardcoded ES id when read purposeTemplate eservices API is available
    const hardcodedEServiceId = '3b0f747a-e52a-4775-88c2-218a2747de8c'
    addEService(
      {
        purposeTemplateId: purposeTemplate.id,
        eserviceId: hardcodedEServiceId,
      },
      {
        onSuccess: () => {
          const newEServiceGroup = [...eserviceGroup]
          newEServiceGroup.push(eservice)
          setValue('eservices', newEServiceGroup)
          setIsEServiceAutocompleteShown(false)
        },
      }
    )
  }

  return (
    <>
      {group.length > 0 && (
        <Stack sx={{ listStyleType: 'none', pl: 0, mt: 1, mb: 4 }} component="ul" spacing={1.2}>
          {group.map((eservice) => (
            <Box component="li" key={eservice.id}>
              <EServiceContainer
                eservice={eservice}
                showWarning={showWarning}
                onRemove={
                  !readOnly ? handleDeleteEServiceFromGroup.bind(null, eservice.id) : undefined
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
              alreadySelectedEServiceIds={group.map((e) => e.id)} //TODO
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
