import React from 'react'
import type { AgreementVerifiedAttributesDrawerVerifingFormValues } from './AgreementVerifiedAttributesDrawer'
import type { TenantVerifier } from '@/api/api.generatedTypes'
import { Trans, useTranslation } from 'react-i18next'
import { Box, Link, Stack, Typography } from '@mui/material'
import { AgreementVerifiedAttributesDrawerRadioGroup } from './AgreementVerifiedAttributesDrawerRadioGroup'
import { AgreementVerifiedAttributesDrawerDatePicker } from './AgreementVerifiedAttributesDrawerDatePicker'
import { attributesHelpLink } from '@/config/constants'

type AgreementVerifiedAttributesDrawerFormProps = {
  formState: AgreementVerifiedAttributesDrawerVerifingFormValues
  setFormState: React.Dispatch<
    React.SetStateAction<AgreementVerifiedAttributesDrawerVerifingFormValues>
  >
  verifier: TenantVerifier | undefined
}

const AgreementVerifiedAttributesDrawerForm: React.FC<
  AgreementVerifiedAttributesDrawerFormProps
> = ({ formState, setFormState, verifier }) => {
  const { t } = useTranslation('agreement', { keyPrefix: 'read.attributes.verified.drawer.verify' })

  const handleRadioChange = (selectedValue: string) => {
    setFormState((prev) => {
      return {
        ...prev,
        hasExpirationDate:
          selectedValue as AgreementVerifiedAttributesDrawerVerifingFormValues['hasExpirationDate'],
      }
    })
  }

  const handleDateChange = (selectedDate: number | null) => {
    if (selectedDate) {
      setFormState((prev) => {
        return { ...prev, expirationDate: new Date(selectedDate) }
      })
    }
  }

  const radioValue = formState.hasExpirationDate ?? (verifier?.expirationDate ? 'YES' : 'NO')
  const dateValue =
    formState.expirationDate ??
    (verifier?.expirationDate ? new Date(verifier.expirationDate) : new Date())

  return (
    <Stack spacing={3} mt={0} component="form" noValidate>
      <AgreementVerifiedAttributesDrawerRadioGroup
        name="hasExpirationDate"
        label={t('form.radioGroup.label')}
        options={[
          { label: t('form.radioGroup.options.NO'), value: 'NO' },
          { label: t('form.radioGroup.options.YES'), value: 'YES' },
        ]}
        sx={{ my: 0 }}
        value={radioValue}
        onChange={handleRadioChange}
      />

      {radioValue === 'YES' && (
        <Box>
          <AgreementVerifiedAttributesDrawerDatePicker
            sx={{ my: 0 }}
            label={t('form.datePicker.label')}
            value={dateValue}
            onChange={handleDateChange}
          />
          <Box mt={3}>
            <Typography variant="label">{t('info.title')}</Typography>
            <Typography variant="body2">
              <Trans
                components={{
                  1: <Link href={attributesHelpLink} target="_blank" />,
                }}
              >
                {t('info.description')}
              </Trans>
            </Typography>
          </Box>
        </Box>
      )}
    </Stack>
  )
}

export default AgreementVerifiedAttributesDrawerForm
