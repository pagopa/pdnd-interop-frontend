import React from 'react'
import { Alert } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { RHFTextField, RHFSwitch } from '@/components/shared/react-hook-form-inputs'
import { useFormContext, useWatch } from 'react-hook-form'
import type { DelegationKind } from '@/api/api.generatedTypes'
import { DelegationCreateEServiceFromTemplateAutocomplete } from './DelegationCreateEServiceFromTemplateAutocomplete'

type DelegationCreateFormCreateEserviceProps = {
  delegationKind: DelegationKind
  handleTemplateNameAutocompleteChange: (eserviceTemplateName: string) => void
}

export const DelegationCreateFormCreateEservice: React.FC<
  DelegationCreateFormCreateEserviceProps
> = ({ delegationKind, handleTemplateNameAutocompleteChange }) => {
  const { t } = useTranslation('party', {
    keyPrefix: 'delegations.create',
  })

  const { control } = useFormContext()
  const isEserviceFromTemplate = useWatch({
    control,
    name: 'isEserviceFromTemplate',
    defaultValue: false,
  })

  return (
    <>
      <RHFSwitch
        name="isEserviceFromTemplate"
        label={t('delegateField.provider.switchEserviceFromTemplate')}
      />

      {isEserviceFromTemplate ? (
        <>
          <Alert severity="info">{t('delegateField.provider.alertEserviceFromTemplate')}</Alert>
          <DelegationCreateEServiceFromTemplateAutocomplete
            delegationKind={delegationKind}
            handleTemplateNameAutocompleteChange={handleTemplateNameAutocompleteChange}
          />
        </>
      ) : (
        <>
          <RHFTextField
            focusOnMount={true}
            name="eserviceName"
            label={t('eserviceField.label')}
            infoLabel={t('eserviceField.infoLabel')}
            inputProps={{ maxLength: 60 }}
            rules={{ required: true, minLength: 5 }}
            sx={{ my: 2 }}
          />
          <RHFTextField
            name="eserviceDescription"
            label={t('eserviceField.descriptionLabel')}
            infoLabel={t('eserviceField.descriptionInfoLabel')}
            multiline
            size="small"
            inputProps={{ maxLength: 250 }}
            rules={{ required: true, minLength: 10 }}
            sx={{ mb: 1, mt: 1 }}
          />
        </>
      )}
    </>
  )
}
