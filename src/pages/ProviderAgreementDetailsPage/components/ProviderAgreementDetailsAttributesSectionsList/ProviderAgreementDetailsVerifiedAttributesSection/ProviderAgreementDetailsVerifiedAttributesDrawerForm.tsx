import React from 'react'
import type { ProviderAgreementDetailsVerifiedAttributesDrawerVerifingFormValues } from './ProviderAgreementDetailsVerifiedAttributesDrawer'
import type { TenantVerifier } from '@/api/api.generatedTypes'
import { Trans, useTranslation } from 'react-i18next'
import { Box, Link, Stack, Typography } from '@mui/material'
import { attributesHelpLink } from '@/config/constants'
import { ProviderAgreementDetailsVerifiedAttributesDrawerDatePicker } from './ProviderAgreementDetailsVerifiedAttributesDrawerDatePicker'
import { ProviderAgreementDetailsVerifiedAttributesDrawerRadioGroup } from './ProviderAgreementDetailsAttributesDrawerRadioGroup'

type ProviderAgreementDetailsVerifiedAttributesDrawerFormProps = {
  formState: ProviderAgreementDetailsVerifiedAttributesDrawerVerifingFormValues
  setFormState: React.Dispatch<
    React.SetStateAction<ProviderAgreementDetailsVerifiedAttributesDrawerVerifingFormValues>
  >
  verifier: TenantVerifier | undefined
}

export const ProviderAgreementDetailsVerifiedAttributesDrawerForm: React.FC<
  ProviderAgreementDetailsVerifiedAttributesDrawerFormProps
> = ({ formState, setFormState, verifier }) => {
  const { t } = useTranslation('agreement', {
    keyPrefix:
      'providerRead.sections.attributesSectionsList.verifiedSection.attributes.attributesDrawer.verify',
  })
  const handleRadioChange = (selectedValue: string) => {
    setFormState((prev) => {
      return {
        ...prev,
        hasExpirationDate:
          selectedValue as ProviderAgreementDetailsVerifiedAttributesDrawerVerifingFormValues['hasExpirationDate'],
      }
    })
  }

  const handleDateChange = (selectedDate: Date | null) => {
    if (selectedDate) {
      setFormState((prev) => {
        return { ...prev, expirationDate: selectedDate }
      })
    }
  }

  const radioValue = formState.hasExpirationDate ?? (verifier?.expirationDate ? 'YES' : 'NO')
  const dateValue =
    formState.expirationDate ??
    (verifier?.expirationDate ? new Date(verifier.expirationDate) : new Date())

  return (
    <Stack spacing={3} mt={0} component="form" noValidate>
      <ProviderAgreementDetailsVerifiedAttributesDrawerRadioGroup
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
          <ProviderAgreementDetailsVerifiedAttributesDrawerDatePicker
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
