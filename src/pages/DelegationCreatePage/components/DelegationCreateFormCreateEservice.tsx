import { Alert, FormControlLabel, Switch } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { DelegationCreateEServiceAutocomplete } from './DelegationCreateEServiceAutocomplete'
import { useState } from 'react'
import { RHFTextField } from '@/components/shared/react-hook-form-inputs'
import { DelegationKind } from '@/api/api.generatedTypes'

type DelegationCreateFormCreateEserviceProps = {
  delegationKind: DelegationKind
  onChange: (value: boolean) => void
  handleTemplateNameAutocompleteChange: (eserviceTemplateName: string) => void
}

export const DelegationCreateFormCreateEservice: React.FC<
  DelegationCreateFormCreateEserviceProps
> = ({ delegationKind, onChange, handleTemplateNameAutocompleteChange }) => {
  const { t } = useTranslation('party', {
    keyPrefix: 'delegations.create',
  })

  const [isEserviceFromTemplate, setIsEserviceFromTemplate] = useState(false)

  const handleChange = () => {
    setIsEserviceFromTemplate((prev) => {
      const updatedState = !prev
      onChange(updatedState)
      return updatedState
    })
  }

  return (
    <>
      <FormControlLabel
        control={<Switch checked={isEserviceFromTemplate} onChange={handleChange} />}
        label={t('delegateField.provider.switchEserviceFromTemplate')}
        labelPlacement="end"
        componentsProps={{ typography: { variant: 'body2' } }}
      />
      {isEserviceFromTemplate ? (
        <>
          <Alert severity="info">{t('delegateField.provider.alertEserviceFromTemplate')}</Alert>
          <DelegationCreateEServiceAutocomplete
            delegationKind={delegationKind}
            createFromTemplate={true}
            handleTemplateNameAutocompleteChange={handleTemplateNameAutocompleteChange}
          />
        </>
      ) : (
        <>
          {' '}
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
