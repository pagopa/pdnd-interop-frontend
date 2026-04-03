import React, { useEffect, useRef } from 'react'
import { Alert } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { RHFTextField, RHFSwitch } from '@/components/shared/react-hook-form-inputs'
import { useFormContext, useWatch } from 'react-hook-form'
import type { DelegationKind } from '@/api/api.generatedTypes'
import { DelegationCreateEServiceFromTemplateAutocomplete } from './DelegationCreateEServiceFromTemplateAutocomplete'
import { Stack } from '@mui/system'

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

  const childSwitchRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Focus the switch when the component mounts to improve accessibility
    const timeoutId = setTimeout(() => {
      if (childSwitchRef.current) {
        childSwitchRef.current.focus()
      }
    }, 0)

    return () => clearTimeout(timeoutId)
  }, [])

  return (
    <>
      <RHFSwitch
        name="isEserviceFromTemplate"
        label={t('delegateField.provider.switchEserviceFromTemplate')}
        inputRef={childSwitchRef}
      />

      {isEserviceFromTemplate ? (
        <>
          <Stack spacing={3}>
            <Alert severity="info">{t('delegateField.provider.alertEserviceFromTemplate')}</Alert>
            <DelegationCreateEServiceFromTemplateAutocomplete
              delegationKind={delegationKind}
              handleTemplateNameAutocompleteChange={handleTemplateNameAutocompleteChange}
            />
          </Stack>
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
