import type {
  AttributeCertifiedDiscreteComparator,
  DescriptorAttribute,
} from '@/api/api.generatedTypes'
import React from 'react'
import { FormProvider, type SubmitHandler, useForm } from 'react-hook-form'
import { create } from 'zustand'
import { Drawer } from '../Drawer'
import { Stack } from '@mui/material'
import { RHFAutocompleteSingle, RHFTextField } from '../react-hook-form-inputs'
import isEmpty from 'lodash/isEmpty'
import { useTranslation } from 'react-i18next'

type ConfigureCertifiedDiscreteAttributeDrawerProps = {
  onSubmit: (comparator: AttributeCertifiedDiscreteComparator, threshold: number) => void
  submitButtonLabel: string
}

type ConfigureCertifiedDiscreteAttributeDrawerStore = {
  isOpen: boolean
  open: (attribute: DescriptorAttribute) => void
  close: VoidFunction
  attribute?: DescriptorAttribute
}

// TODO check if is more simple to add this in autocomplete directly and in attributeContainer directly
// because AttributeGroup is used only in creation eservice and not in updateAttributesDrawer

export const useConfigureCertifiedDiscreteAttributeDrawer =
  create<ConfigureCertifiedDiscreteAttributeDrawerStore>((set) => ({
    isOpen: false,
    open: (attribute) => set({ attribute, isOpen: true }),
    close: () => set({ isOpen: false, attribute: undefined }),
  }))

type ConfigureCertifiedDiscreteAttributeFormValues = {
  comparator: AttributeCertifiedDiscreteComparator
  threshold: number
}

export const ConfigureCertifiedDiscreteAttributeDrawer: React.FC<
  ConfigureCertifiedDiscreteAttributeDrawerProps
> = ({ onSubmit, submitButtonLabel }) => {
  const { t } = useTranslation('shared-components', {
    keyPrefix: 'configureCertifiedDiscreteAttributeDrawer',
  })
  const { t: tCommon } = useTranslation('common', {
    keyPrefix: 'comparators',
  })
  const { isOpen, close, attribute } = useConfigureCertifiedDiscreteAttributeDrawer()
  const formMethods = useForm<ConfigureCertifiedDiscreteAttributeFormValues>({
    defaultValues: {
      comparator: attribute?.discreteConfig?.comparator ?? 'GT',
      threshold: attribute?.discreteConfig?.threshold ?? undefined,
    },
  })

  const handleFormSubmit: SubmitHandler<ConfigureCertifiedDiscreteAttributeFormValues> = ({
    comparator,
    threshold,
  }) => {
    onSubmit(comparator, threshold)
  }

  React.useEffect(() => {
    if (isOpen) {
      formMethods.reset({
        comparator: attribute?.discreteConfig?.comparator ?? 'GT',
        threshold: attribute?.discreteConfig?.threshold ?? undefined,
      })
    }
  }, [isOpen, formMethods, attribute])

  const comparatorOptions = [
    { label: tCommon('GT'), value: 'GT' as AttributeCertifiedDiscreteComparator },
    { label: tCommon('LT'), value: 'LT' as AttributeCertifiedDiscreteComparator },
    { label: tCommon('GTE'), value: 'GTE' as AttributeCertifiedDiscreteComparator },
    { label: tCommon('LTE'), value: 'LTE' as AttributeCertifiedDiscreteComparator },
    { label: tCommon('EQ'), value: 'EQ' as AttributeCertifiedDiscreteComparator },
    { label: tCommon('NE'), value: 'NE' as AttributeCertifiedDiscreteComparator },
  ]

  return (
    <FormProvider {...formMethods}>
      <Drawer
        isOpen={isOpen}
        title={t('title')}
        subtitle={t('subtitle', { attributeName: attribute?.name })}
        onTransitionExited={formMethods.reset}
        onClose={close}
        buttonAction={{
          label: submitButtonLabel,
          action: formMethods.handleSubmit(handleFormSubmit),
          form: 'discrete-attribute-form',
          type: 'submit',
          color: isEmpty(formMethods.formState.errors) ? 'primary' : 'error',
          fontColor: 'white',
        }}
      >
        <Stack component={'form'} noValidate id="discrete-attribute-form">
          <RHFAutocompleteSingle
            name="comparator"
            label={t('comparatorLabel')}
            options={comparatorOptions}
            focusOnMount
            size="small"
            rules={{ required: true }}
          />
          <RHFTextField
            name="threshold"
            label={t('thresholdLabel')}
            type="number"
            rules={{
              required: true,
              min: 1,
              max: 1000000000,
              validate: (value) => Number.isInteger(Number(value)) || t('validation.integer'),
            }}
            required
            sx={{ mt: 2 }}
          />
        </Stack>
      </Drawer>
    </FormProvider>
  )
}
