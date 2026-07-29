import type { RequesterCertifiedAttribute } from '@/api/api.generatedTypes'
import { Drawer } from '@/components/shared/Drawer'
import { RHFTextField } from '@/components/shared/react-hook-form-inputs'
import { Stack, Typography } from '@mui/material'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { Trans, useTranslation } from 'react-i18next'

type ChangeAttributeValueDrawerProps = {
  attribute: RequesterCertifiedAttribute
  isOpen: boolean
  onClose: () => void
}

type ChangeAttributeValueFormValues = {
  value: number
}

const ChangeAttributeValueDrawer: React.FC<ChangeAttributeValueDrawerProps> = ({
  attribute,
  isOpen,
  onClose,
}) => {
  const { t } = useTranslation('party', {
    keyPrefix: 'tenantCertifier.assignTab.changeValueDrawer',
  })

  const formMethods = useForm<ChangeAttributeValueFormValues>({
    defaultValues: {
      value: attribute.discreteValue ?? undefined,
    },
  })

  const onSubmit = formMethods.handleSubmit(({ value }: ChangeAttributeValueFormValues) => {
    console.log('TODO function')
  })

  return (
    <FormProvider {...formMethods}>
      <Drawer
        title={t('title')}
        subtitle={t('subtitle', {
          attributeName: attribute.attributeName,
          tenantName: attribute.tenantName,
        })}
        buttonAction={{
          action: onSubmit,
          label: t('submitBtnLabel'),
        }}
        onTransitionExited={formMethods.reset}
        onClose={onClose}
        isOpen={isOpen}
      >
        <Stack component="form" noValidate spacing={3}>
          <Typography variant="body2">
            <Trans
              components={{
                strong: <Typography component="span" variant="inherit" fontWeight={600} />,
              }}
            >
              {t('actualValue', { value: attribute.discreteValue })}
            </Trans>
          </Typography>
          <RHFTextField
            id="value-field"
            label={t('form.valueField.label')}
            name="value"
            rules={{
              required: true,
              min: 1,
              max: 1000000000,
              validate: (value) =>
                Number.isInteger(Number(value)) || t('form.valueField.validation.integer'),
            }}
            required
            size="small"
            type="number"
          />
        </Stack>
      </Drawer>
    </FormProvider>
  )
}

export default ChangeAttributeValueDrawer
