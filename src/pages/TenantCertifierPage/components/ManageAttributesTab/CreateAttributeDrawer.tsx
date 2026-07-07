import type { AttributeKind } from '@/api/api.generatedTypes'
import { AttributeMutations } from '@/api/attribute'
import { Drawer } from '@/components/shared/Drawer'
import { RHFRadioGroup, RHFTextField } from '@/components/shared/react-hook-form-inputs'
import { FEATURE_FLAG_ATTRIBUTE_CERTIFIED_DISCRETE } from '@/config/env'
import { Stack, Typography } from '@mui/material'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { match } from 'ts-pattern'

type CreateAttributeDrawerProps = {
  isOpen: boolean
  onClose: () => void
}

type CreateNewAttributeFormValues = {
  kind: Extract<AttributeKind, 'CERTIFIED' | 'CERTIFIED_DISCRETE'>
  name: string
  description: string
  thresholdType: string
}

export const CreateAttributeDrawer: React.FC<CreateAttributeDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const { t } = useTranslation('party', { keyPrefix: 'tenantCertifier.manageTab.drawer' })

  const { mutate: createCertifiedAttribute } = AttributeMutations.useCreateCertified()
  const { mutate: createCertifiedDiscreteAttribute } =
    AttributeMutations.useCreateCertifiedDiscrete()

  const formMethods = useForm<CreateNewAttributeFormValues>({
    defaultValues: {
      kind: 'CERTIFIED',
      name: '',
      description: '',
      thresholdType: undefined,
    },
  })

  const onSubmit = formMethods.handleSubmit(
    ({ kind, name, description }: CreateNewAttributeFormValues) => {
      match(kind)
        .with('CERTIFIED', () =>
          createCertifiedAttribute({ name, description }, { onSuccess: onClose })
        )
        .with('CERTIFIED_DISCRETE', () => {
          createCertifiedDiscreteAttribute({ name, description }, { onSuccess: onClose })
        })
        .exhaustive()
    }
  )

  const kindOptions: Array<{
    label: string
    value: Extract<AttributeKind, 'CERTIFIED' | 'CERTIFIED_DISCRETE'>
  }> = [
    { label: t('form.kindField.kindRadio.optionCertifiedLabel'), value: 'CERTIFIED' },
    {
      label: t('form.kindField.kindRadio.optionCertifiedDiscreteLabel'),
      value: 'CERTIFIED_DISCRETE',
    },
  ]

  return (
    <FormProvider {...formMethods}>
      <Drawer
        title={t('title')}
        subtitle={t('subtitle')}
        buttonAction={{
          action: onSubmit,
          label: t('submitBtnLabel'),
        }}
        onTransitionExited={formMethods.reset}
        onClose={onClose}
        isOpen={isOpen}
      >
        {FEATURE_FLAG_ATTRIBUTE_CERTIFIED_DISCRETE && (
          <Stack component="form" noValidate spacing={5} mb={3}>
            <Stack spacing={3}>
              <Typography fontWeight={600} variant="label">
                {t('form.kindField.label')}
              </Typography>
              <RHFRadioGroup name="kind" options={kindOptions} rules={{ required: true }} />
            </Stack>

            <Stack spacing={3}>
              <Typography fontWeight={600} variant="label">
                {t('form.infoFields.label')}
              </Typography>
              <RHFTextField
                label={t('form.infoFields.nameField.label')}
                name="name"
                inputProps={{ maxLength: 160 }}
                size="small"
                required
                rules={{ required: true, minLength: 5 }}
                infoLabel={t('form.infoFields.nameField.infoLabel')}
              />
              <RHFTextField
                label={t('form.infoFields.descriptionField.label')}
                multiline
                name="description"
                inputProps={{ maxLength: 250 }}
                size="small"
                required
                rules={{ required: true, minLength: 10 }}
                infoLabel={t('form.infoFields.descriptionField.infoLabel')}
              />
            </Stack>
          </Stack>
        )}
        {!FEATURE_FLAG_ATTRIBUTE_CERTIFIED_DISCRETE && (
          <Stack component="form" noValidate spacing={3}>
            <RHFTextField
              label={t('form.infoFields.nameField.label')}
              labelType="external"
              name="name"
              inputProps={{ maxLength: 160 }}
              rules={{ required: true, minLength: 5 }}
              infoLabel={t('form.infoFields.nameField.infoLabel')}
            />
            <RHFTextField
              label={t('form.infoFields.descriptionField.label')}
              labelType="external"
              multiline
              name="description"
              inputProps={{ maxLength: 250 }}
              rules={{ required: true, minLength: 10 }}
              infoLabel={t('form.infoFields.descriptionField.infoLabel')}
            />
          </Stack>
        )}
      </Drawer>
    </FormProvider>
  )
}
