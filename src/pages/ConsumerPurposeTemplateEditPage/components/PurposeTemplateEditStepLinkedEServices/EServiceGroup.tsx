import React from 'react'
import { Box, Stack } from '@mui/material'
import { useTranslation } from 'react-i18next'
import AddIcon from '@mui/icons-material/Add'
import { ButtonNaked } from '@pagopa/mui-italia'
import type { CatalogEService, PurposeTemplateWithCompactCreator } from '@/api/api.generatedTypes'
import { EServiceAutocomplete } from '@/components/shared/EServiceAutoComplete'
import { EServiceContainer } from '@/components/layout/containers/EServiceContainer'
import { PurposeTemplateMutations } from '@/api/purposeTemplate/purposeTemplate.mutations'
import { useToastNotification } from '@/stores/toast-notification.store'

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
  const { showToast } = useToastNotification()

  const handleDeleteEServiceFromGroup = (eserviceId: string) => {
    onRemoveEServiceFromGroup(eserviceId)
  }

  const handleAddEServiceToGroup = (eservice: CatalogEService) => {
    addEService(
      {
        purposeTemplateId: purposeTemplate.id,
        eserviceId: eservice.id,
      },
      {
        onSuccess: () => {
          setIsEServiceAutocompleteShown(false)
          showToast(t('notifications.eserviceLinkSuccess'), 'success')
        },
        onError: () => {
          showToast(t('notifications.eserviceLinkError'), 'error')
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
              alreadySelectedEServiceIds={group.map((e) => e.id)}
              purposeTemplate={purposeTemplate}
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
